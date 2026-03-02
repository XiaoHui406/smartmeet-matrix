from fastapi import FastAPI
import uvicorn
from typing import List
from model.topic import TopicSchema
from model.meeting import MeetingSchema
from service.chromadb_service import ChromaDBService
from contextlib import asynccontextmanager


chromadb_service: ChromaDBService = ChromaDBService()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Connecting to ChromaDB...")
    await chromadb_service.create()

    yield  # 这里是应用运行的分界点

    # 【关闭逻辑】: 如果有需要释放的资源（如关闭数据库连接池）在这里处理
    print("Shutting down... Cleaning up resources (if any)")


app = FastAPI(lifespan=lifespan)


# @app.get('/')
# async def test():
#     async with get_db() as db:
#         users = await db.execute(select(User))
#         res = users.scalars().all()
#     return res


@app.get('/topic/recommend/{user_id}')
def topic_recommend(user_id: int) -> List[TopicSchema]:
    ...


@app.get('/meeting/recommend/{user_id}')
def meeting_recommend(user_id: int) -> List[MeetingSchema]:
    ...


if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)
