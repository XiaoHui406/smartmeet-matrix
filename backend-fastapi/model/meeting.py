from database_engine import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, Text
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class Meeting(Base):
    __tablename__ = "meetings"

    meeting_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )
    meeting_name: Mapped[str] = mapped_column(String, nullable=False)
    organizer_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )  # 对应 Users.user_id
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    meeting_status: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )  # 1.未开始，2.进行中，3.已结束
    max_number: Mapped[Optional[int]] = mapped_column(Integer)
    meeting_type: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )  # 1.线上，2.线下，3.线上和线下
    meeting_location: Mapped[str] = mapped_column(String, nullable=False)
    rule: Mapped[Optional[str]] = mapped_column(Text)
    dining_service: Mapped[Optional[str]] = mapped_column(String)
    theme: Mapped[str] = mapped_column(String, nullable=False)
    agenda: Mapped[str] = mapped_column(Text, nullable=False)
    general_content: Mapped[str] = mapped_column(Text, nullable=False)
    key_attendees: Mapped[str] = mapped_column(Text, nullable=False)
    layout: Mapped[Optional[str]] = mapped_column(String)  # 布局图路径
    click_count: Mapped[int] = mapped_column(Integer, default=0)
    is_public: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )  # 0.私密，1.公开
    meeting_password: Mapped[Optional[str]] = mapped_column(String)


class MeetingSchema(BaseModel):
    meeting_id: int = Field(..., description="会议ID，非空")
    meeting_name: str = Field(..., description="会议名称，非空")
    organizer_id: int = Field(..., description="发起者id，对应用户表的user_id")
    start_time: datetime = Field(..., description="开始时间")
    end_time: datetime = Field(..., description="结束时间")
    meeting_status: int = Field(..., description="1.未开始，2.进行中，3.已结束")
    max_number: Optional[int] = Field(None, description="最大人数，为空则为无限制")
    meeting_type: int = Field(..., description="1.线上，2.线下，3.线上和线下")
    meeting_location: str = Field(..., description="会议地点，线上则为‘线上会议’")
    rule: Optional[str] = None
    dining_service: Optional[str] = None
    theme: str = Field(..., description="会议主题")
    agenda: str = Field(..., description="会议议程")
    general_content: str = Field(..., description="大致内容")
    key_attendees: str = Field(..., description="主要参会人员")
    layout: Optional[str] = Field(None, description="布局图路径")
    click_count: int = Field(default=0)
    is_public: int = Field(..., description="0.私密，1.公开")
    meeting_password: Optional[str] = None
    attendee_count: Optional[int] = None
    weight_score: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
