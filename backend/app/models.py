from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    topic = Column(Text, nullable=False)
    genre = Column(String, nullable=False)
    mood = Column(String, nullable=False)
    style = Column(String, nullable=False)
    perspective = Column(String, nullable=False)
    keywords = Column(String, nullable=True)
    length = Column(String, nullable=False)

    title = Column(String, nullable=True)
    lyrics = Column(Text, nullable=True)

    messages = relationship(
        "Message", back_populates="song", cascade="all, delete-orphan",
        order_by="Message.created_at",
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    song = relationship("Song", back_populates="messages")
