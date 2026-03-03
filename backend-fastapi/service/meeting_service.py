from database_engine import get_db
from typing import List, Optional
from model.meeting import Meeting
from sqlalchemy import select
from service.chromadb_service import ChromaDBService


class MeetingService:
    @staticmethod
    async def get_meetings_by_id(id_list: List[int]) -> List[Meeting]:
        """根据ID列表获取会议列表"""
        if not id_list:
            return []

        async with get_db() as db:
            result = await db.execute(
                select(Meeting).where(
                    (Meeting.meeting_id.in_(id_list)) & (Meeting.is_public == 1)
                )
            )
            meetings = list(result.scalars().all())
            # 保持与ID列表相同的顺序
            meeting_dict = {m.meeting_id: m for m in meetings}
            return [meeting_dict[id] for id in id_list if id in meeting_dict]

    @staticmethod
    async def get_meeting_by_id(meeting_id: int) -> Optional[Meeting]:
        """根据会议ID获取单个会议"""
        async with get_db() as db:
            result = await db.execute(
                select(Meeting).where(Meeting.meeting_id == meeting_id)
            )
            return result.scalar_one_or_none()

    @staticmethod
    async def get_all_meetings() -> List[Meeting]:
        """获取所有会议"""
        async with get_db() as db:
            result = await db.execute(select(Meeting))
            return list(result.scalars().all())

    @staticmethod
    async def sync_meeting_to_chromadb(
        meeting: Meeting, chromadb_service: ChromaDBService
    ):
        """同步单个会议到 ChromaDB"""
        await chromadb_service.update_meeting(meeting)

    @staticmethod
    async def delete_meeting_from_chromadb(
        meeting_id: int, chromadb_service: ChromaDBService
    ):
        """从 ChromaDB 删除会议"""
        await chromadb_service.delete_meeting(meeting_id)
