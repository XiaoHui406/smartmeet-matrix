from database_engine import get_db
from typing import List, Optional
from model.topic import Topic
from sqlalchemy import select
from service.chromadb_service import ChromaDBService


class TopicService:
    @staticmethod
    async def get_topics_by_id(id_list: List[int]) -> List[Topic]:
        """根据ID列表获取议题列表"""
        if not id_list:
            return []

        async with get_db() as db:
            result = await db.execute(select(Topic).where(Topic.topic_id.in_(id_list)))
            topics = list(result.scalars().all())
            # 保持与ID列表相同的顺序
            topic_dict = {t.topic_id: t for t in topics}
            return [topic_dict[id] for id in id_list if id in topic_dict]

    @staticmethod
    async def get_topic_by_id(topic_id: int) -> Optional[Topic]:
        """根据议题ID获取单个议题"""
        async with get_db() as db:
            result = await db.execute(select(Topic).where(Topic.topic_id == topic_id))
            return result.scalar_one_or_none()

    @staticmethod
    async def get_all_topics() -> List[Topic]:
        """获取所有议题"""
        async with get_db() as db:
            result = await db.execute(select(Topic))
            return list(result.scalars().all())

    @staticmethod
    async def sync_topic_to_chromadb(topic: Topic, chromadb_service: ChromaDBService):
        """同步单个议题到 ChromaDB"""
        await chromadb_service.update_topic(topic)

    @staticmethod
    async def delete_topic_from_chromadb(
        topic_id: int, chromadb_service: ChromaDBService
    ):
        """从 ChromaDB 删除议题"""
        await chromadb_service.delete_topic(topic_id)
