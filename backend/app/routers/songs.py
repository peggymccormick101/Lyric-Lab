import anthropic
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import ai, models, schemas
from app.database import get_db

router = APIRouter(prefix="/api", tags=["songs"])


def _build_song_context(song: models.Song) -> str:
    lines = [
        f"Topic/story: {song.topic}",
        f"Genre: {song.genre}",
        f"Mood: {song.mood}",
        f"Lyrical style: {song.style}",
        f"Perspective: {song.perspective}",
        f"Length: {song.length}",
    ]
    if song.keywords:
        lines.append(f"Key words/phrases: {song.keywords}")
    lines.append(f"\nCurrent title: {song.title}")
    lines.append(f"\nCurrent lyrics:\n{song.lyrics}")
    return "\n".join(lines)


def _handle_ai_errors(fn, *args, **kwargs):
    try:
        return fn(*args, **kwargs)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except anthropic.APIStatusError as e:
        raise HTTPException(
            status_code=502, detail=f"Claude API error ({e.status_code}): {e.message}"
        )
    except anthropic.APIConnectionError as e:
        raise HTTPException(status_code=502, detail=f"Could not reach the Claude API: {e}")


@router.post("/songs", response_model=schemas.SongDetail)
def create_song(payload: schemas.SongCreate, db: Session = Depends(get_db)):
    result = _handle_ai_errors(
        ai.generate_lyrics,
        payload.topic,
        payload.genre,
        payload.mood,
        payload.style,
        payload.perspective,
        payload.keywords,
        payload.length,
    )

    song = models.Song(
        topic=payload.topic,
        genre=payload.genre,
        mood=payload.mood,
        style=payload.style,
        perspective=payload.perspective,
        keywords=payload.keywords,
        length=payload.length,
        title=result.get("title"),
        lyrics=result.get("lyrics"),
    )
    db.add(song)
    db.commit()
    db.refresh(song)
    return song


@router.get("/songs", response_model=list[schemas.SongListItem])
def list_songs(db: Session = Depends(get_db)):
    return db.query(models.Song).order_by(models.Song.created_at.desc()).all()


@router.get("/songs/{song_id}", response_model=schemas.SongDetail)
def get_song(song_id: int, db: Session = Depends(get_db)):
    song = db.get(models.Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.delete("/songs/{song_id}", status_code=204)
def delete_song(song_id: int, db: Session = Depends(get_db)):
    song = db.get(models.Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    db.delete(song)
    db.commit()


@router.post("/songs/{song_id}/revise", response_model=schemas.ReviseResponse)
def revise_song(song_id: int, payload: schemas.ReviseRequest, db: Session = Depends(get_db)):
    song = db.get(models.Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    context = _build_song_context(song)
    history = [{"role": m.role, "content": m.content} for m in song.messages]

    result = _handle_ai_errors(ai.revise_lyrics, context, history, payload.message)

    song.title = result.get("title", song.title)
    song.lyrics = result.get("lyrics", song.lyrics)
    reply = result.get("reply", "Updated the lyrics.")

    db.add(models.Message(song_id=song.id, role="user", content=payload.message))
    db.add(models.Message(song_id=song.id, role="assistant", content=reply))
    db.commit()

    return schemas.ReviseResponse(reply=reply)
