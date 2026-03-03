from database_engine import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, Text, Float
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class Topic(Base):
    __tablename__ = "topics"

    topic_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )
    meeting_id: Mapped[Optional[int]] = mapped_column(Integer)
    start_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime)
    topic_name: Mapped[Optional[str]] = mapped_column(String)
    content: Mapped[Optional[str]] = mapped_column(Text)
    speaker: Mapped[Optional[str]] = mapped_column(String)
    click_count: Mapped[Optional[int]] = mapped_column(Integer, default=0)


class TopicSchema(BaseModel):
    topic_id: int = Field(..., description="议题ID")
    meeting_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    topic_name: Optional[str] = None
    content: Optional[str] = None
    speaker: Optional[str] = None
    click_count: Optional[int] = Field(default=0)

    model_config = ConfigDict(from_attributes=True)
