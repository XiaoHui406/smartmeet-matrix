import chromadb
from chromadb.api.async_api import AsyncClientAPI
from model.meeting import Meeting
from model.topic import Topic
from typing import List, Dict, Any, Optional
from database_engine import get_db
from sqlalchemy import select
import jieba
import asyncio
from tools.forbidden_words import forbidden_words


class ChromaDBService:
    def __init__(self) -> None:
        self.chroma_client: Optional[AsyncClientAPI] = None
        self.meeting_collection = None
        self.topic_collection = None

    async def create(self):
        self.chroma_client = await chromadb.AsyncHttpClient(port=8001)
        self.meeting_collection = await self.chroma_client.get_or_create_collection(
            "meeting"
        )
        self.topic_collection = await self.chroma_client.get_or_create_collection(
            "topic"
        )
        return self

    async def sync_meetings_from_mysql(self):
        """从 MySQL 同步会议数据到 ChromaDB"""
        async with get_db() as db:
            result = await db.execute(select(Meeting))
            meetings = result.scalars().all()

            if not meetings:
                return

            # 准备 ChromaDB 数据
            ids = []
            documents = []
            metadatas = []

            for meeting in meetings:
                ids.append(str(meeting.meeting_id))
                # 将会议相关信息组合成文本并进行预处理
                doc_content = (
                    f"{meeting.meeting_name} {meeting.theme} {meeting.general_content}"
                )
                # 使用jieba分词并过滤停用词
                processed_content = await self._preprocess_content(doc_content)
                documents.append(processed_content)
                metadatas.append(
                    {
                        "meeting_name": meeting.meeting_name,
                        "theme": meeting.theme,
                    }
                )

            if not self.meeting_collection:
                raise ValueError("Meeting Collection is None")

            # 清空现有数据并添加新数据
            try:
                await self.meeting_collection.delete(where={"$and": []})
            except:
                pass

            await self.meeting_collection.add(
                ids=ids, documents=documents, metadatas=metadatas
            )

            return len(meetings)

    async def sync_topics_from_mysql(self):
        """从 MySQL 同步议题数据到 ChromaDB"""
        async with get_db() as db:
            result = await db.execute(select(Topic))
            topics = result.scalars().all()

            if not topics:
                return

            # 准备 ChromaDB 数据
            ids = []
            documents = []
            metadatas = []

            for topic in topics:
                ids.append(str(topic.topic_id))
                # 将议题相关信息组合成文本并进行预处理
                doc_content = f"{topic.topic_name} {topic.content} {topic.speaker}"
                # 使用jieba分词并过滤停用词
                processed_content = await self._preprocess_content(doc_content)
                documents.append(processed_content)
                metadatas.append(
                    {
                        "topic_name": topic.topic_name,
                        "speaker": topic.speaker,
                        "meeting_id": topic.meeting_id,
                    }
                )

            if not self.topic_collection:
                raise ValueError("Topic Collection is None")

            # 清空现有数据并添加新数据
            try:
                await self.topic_collection.delete(where={"$and": []})
            except:
                pass

            await self.topic_collection.add(
                ids=ids, documents=documents, metadatas=metadatas
            )

            return len(topics)

    async def get_recommended_meetings(
        self, user_interest: str, n_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        基于用户 interest 获取推荐的会议

        Args:
            user_interest: 用户的兴趣文本
            n_results: 返回结果数量

        Returns:
            推荐的会议列表，包含会议ID和相似度分数
        """

        if not self.meeting_collection:
            raise ValueError("Meeting Collection is None")

        # 对用户兴趣进行预处理
        processed_interest = await self._preprocess_content(user_interest)

        results = await self.meeting_collection.query(
            query_texts=[processed_interest],
            n_results=n_results,
            include=["metadatas", "distances"],
        )

        recommendations = []
        if results["ids"] and results["ids"][0]:
            for i, meeting_id in enumerate(results["ids"][0]):
                distance = results["distances"][0][i] if results["distances"] else 0
                # ChromaDB 返回的是 L2 距离，转换为相似度分数 (0-1)
                similarity_score = 1 / (1 + distance)
                recommendations.append(
                    {
                        "meeting_id": int(meeting_id),
                        "similarity_score": similarity_score,
                        "metadata": results["metadatas"][0][i]
                        if results["metadatas"]
                        else None,
                    }
                )

        return recommendations

    async def get_recommended_topics(
        self, user_interest: str, n_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        基于用户 interest 获取推荐的议题

        Args:
            user_interest: 用户的兴趣文本
            n_results: 返回结果数量

        Returns:
            推荐的议题列表，包含议题ID和相似度分数
        """

        if not self.topic_collection:
            raise ValueError("Topic Collection is None")

        # 对用户兴趣进行预处理
        processed_interest = await self._preprocess_content(user_interest)

        results = await self.topic_collection.query(
            query_texts=[processed_interest],
            n_results=n_results,
            include=["metadatas", "distances"],
        )

        recommendations = []
        if results["ids"] and results["ids"][0]:
            for i, topic_id in enumerate(results["ids"][0]):
                distance = results["distances"][0][i] if results["distances"] else 0
                # ChromaDB 返回的是 L2 距离，转换为相似度分数 (0-1)
                similarity_score = 1 / (1 + distance)
                recommendations.append(
                    {
                        "topic_id": int(topic_id),
                        "similarity_score": similarity_score,
                        "metadata": results["metadatas"][0][i]
                        if results["metadatas"]
                        else None,
                    }
                )

        return recommendations

    async def add_meeting(self, meeting: Meeting):
        """添加单个会议到 ChromaDB"""
        doc_content = f"{meeting.meeting_name} {meeting.theme} {meeting.agenda} {meeting.general_content} {meeting.key_attendees}"
        # 使用jieba分词并过滤停用词
        processed_content = await self._preprocess_content(doc_content)

        if not self.meeting_collection:
            raise ValueError("Meeting Collection is None")

        await self.meeting_collection.add(
            ids=[str(meeting.meeting_id)],
            documents=[processed_content],
            metadatas=[
                {
                    "meeting_name": meeting.meeting_name,
                    "theme": meeting.theme,
                    "meeting_type": meeting.meeting_type,
                    "meeting_status": meeting.meeting_status,
                }
            ],
        )

    async def add_topic(self, topic: Topic):
        """添加单个议题到 ChromaDB"""
        doc_content = f"{topic.topic_name} {topic.content} {topic.speaker}"
        # 使用jieba分词并过滤停用词
        processed_content = await self._preprocess_content(doc_content)

        if not self.topic_collection:
            raise ValueError("Topic Collection is None")

        await self.topic_collection.add(
            ids=[str(topic.topic_id)],
            documents=[processed_content],
            metadatas=[
                {
                    "topic_name": topic.topic_name,
                    "speaker": topic.speaker,
                    "meeting_id": topic.meeting_id,
                }
            ],
        )

    async def delete_meeting(self, meeting_id: int):
        """从 ChromaDB 删除会议"""

        if not self.meeting_collection:
            raise ValueError("Meeting Collection is None")

        await self.meeting_collection.delete(ids=[str(meeting_id)])

    async def delete_topic(self, topic_id: int):
        """从 ChromaDB 删除议题"""

        if not self.topic_collection:
            raise ValueError("Topic Collection is None")

        await self.topic_collection.delete(ids=[str(topic_id)])

    async def update_meeting(self, meeting: Meeting):
        """更新 ChromaDB 中的会议"""
        await self.delete_meeting(meeting.meeting_id)
        await self.add_meeting(meeting)

    async def update_topic(self, topic: Topic):
        """更新 ChromaDB 中的议题"""
        await self.delete_topic(topic.topic_id)
        await self.add_topic(topic)

    async def _preprocess_content(self, content: str) -> str:
        word_list: List[str] = await asyncio.to_thread(jieba.lcut, content)
        word_list = [
            word for word in word_list if len(word) > 1 and word not in forbidden_words
        ]
        return " ".join(word_list)
