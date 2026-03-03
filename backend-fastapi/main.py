from fastapi import FastAPI, HTTPException
import uvicorn
from typing import List, Optional
from pydantic import BaseModel
from model.meeting import MeetingSchema
from model.topic import TopicSchema
from service.chromadb_service import ChromaDBService
from service.user_service import UserService
from service.meeting_service import MeetingService
from service.topic_service import TopicService
from contextlib import asynccontextmanager


chromadb_service: ChromaDBService = ChromaDBService()


class MeetingRecommendation(BaseModel):
    meeting: MeetingSchema
    similarity_score: float


class TopicRecommendation(BaseModel):
    topic: TopicSchema
    similarity_score: float


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to ChromaDB...")
    await chromadb_service.create()

    # 启动时同步数据
    print("Syncing data from MySQL to ChromaDB...")
    meeting_count = await chromadb_service.sync_meetings_from_mysql()
    topic_count = await chromadb_service.sync_topics_from_mysql()
    print(f"Synced {meeting_count} meetings and {topic_count} topics")

    yield  # 这里是应用运行的分界点

    # 【关闭逻辑】: 如果有需要释放的资源（如关闭数据库连接池）在这里处理
    print("Shutting down... Cleaning up resources (if any)")


app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Welcome to Meeting Recommendation API"}


@app.get("/topic/recommend/{user_id}", response_model=List[TopicRecommendation])
async def topic_recommend(user_id: int, limit: int = 10) -> List[TopicRecommendation]:
    """
    基于用户 interest 推荐议题

    Args:
        user_id: 用户ID
        limit: 返回推荐数量，默认10条
    """
    # 获取用户 interest
    user_interest = await UserService.get_user_interest(user_id)

    if not user_interest:
        raise HTTPException(status_code=404, detail="User interest not found or empty")

    # 获取推荐的议题ID列表
    recommendations = await chromadb_service.get_recommended_topics(
        user_interest, n_results=limit
    )

    if not recommendations:
        return []

    # 获取议题ID列表
    topic_ids = [rec["topic_id"] for rec in recommendations]

    # 从数据库获取完整的议题信息
    topics = await TopicService.get_topics_by_id(topic_ids)
    topic_dict = {t.topic_id: t for t in topics}

    # 构建推荐结果
    results = []
    for rec in recommendations:
        topic = topic_dict.get(rec["topic_id"])
        if topic:
            results.append(
                TopicRecommendation(
                    topic=TopicSchema.model_validate(topic),
                    similarity_score=rec["similarity_score"],
                )
            )

    return results


@app.get("/meeting/recommend/{user_id}", response_model=List[MeetingRecommendation])
async def meeting_recommend(
    user_id: int, limit: int = 10
) -> List[MeetingRecommendation]:
    """
    基于用户 interest 推荐会议

    Args:
        user_id: 用户ID
        limit: 返回推荐数量，默认10条
    """
    # 获取用户 interest
    user_interest = await UserService.get_user_interest(user_id)

    if not user_interest:
        raise HTTPException(status_code=404, detail="User interest not found or empty")

    # 获取推荐的会议ID列表
    recommendations = await chromadb_service.get_recommended_meetings(
        user_interest, n_results=limit
    )

    if not recommendations:
        return []

    # 获取会议ID列表
    meeting_ids = [rec["meeting_id"] for rec in recommendations]

    # 从数据库获取完整的会议信息
    meetings = await MeetingService.get_meetings_by_id(meeting_ids)
    meeting_dict = {m.meeting_id: m for m in meetings}

    # 构建推荐结果
    results = []
    for rec in recommendations:
        meeting = meeting_dict.get(rec["meeting_id"])
        if meeting:
            results.append(
                MeetingRecommendation(
                    meeting=MeetingSchema.model_validate(meeting),
                    similarity_score=rec["similarity_score"],
                )
            )

    return results


@app.post("/sync/meetings")
async def sync_meetings():
    """手动同步会议数据到 ChromaDB"""
    count = await chromadb_service.sync_meetings_from_mysql()
    return {"message": f"Successfully synced {count} meetings to ChromaDB"}


@app.post("/sync/topics")
async def sync_topics():
    """手动同步议题数据到 ChromaDB"""
    count = await chromadb_service.sync_topics_from_mysql()
    return {"message": f"Successfully synced {count} topics to ChromaDB"}


@app.post("/sync/all")
async def sync_all():
    """手动同步所有数据到 ChromaDB"""
    meeting_count = await chromadb_service.sync_meetings_from_mysql()
    topic_count = await chromadb_service.sync_topics_from_mysql()
    return {
        "message": "Sync completed",
        "meetings_synced": meeting_count,
        "topics_synced": topic_count,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
