from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class SongCreate(BaseModel):
    topic: str = Field(min_length=1, max_length=200)
    genre: str
    mood: str
    style: str
    perspective: str
    keywords: Optional[str] = None
    length: str = "Standard"


class SongListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    title: Optional[str] = None
    topic: str
    genre: str
    mood: str
    style: str
    perspective: str
    length: str


class SongDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    topic: str
    genre: str
    mood: str
    style: str
    perspective: str
    keywords: Optional[str] = None
    length: str
    title: Optional[str] = None
    lyrics: Optional[str] = None
