"""Application service for audio book creation."""

from fastapi import HTTPException
from sqlalchemy import select

from utils.schema.Ctx import UserModel
from common.audio_converter.audio_converter import start_audio_converter
from common.audio_converter.state import ChapterConfig
from sqlalchemy.ext.asyncio import AsyncSession


from .models.model import Book
from .schemas import CreateAudioBookSchema


async def create_audio_book(
    chapters: list[ChapterConfig],
    language: str,
    storytelling_style: str,
    pacing: str,
) -> None:
    await start_audio_converter(
        chapters=chapters,
        language=language,
        storytelling_style=storytelling_style,
        pacing=pacing,
    )


async def save_audio_book(
    form_data: CreateAudioBookSchema,
    user: UserModel,
    chapters: list[ChapterConfig],
    db: AsyncSession,
) -> None:
    book_query = select(Book).where(
        Book.name == form_data.file.filename, Book.user_id == user.id
    )
    print(db)

    book = await db.execute(book_query)

    if book.scalars().first():
        raise HTTPException(
            status_code=409,
            detail="You have already uploaded a book with this name.",
        )

    book = Book(
        name=form_data.file.filename,
        user_id=user.id,
        total_chapters=len(chapters),
    )

    db.add(book)
    # saving book to the database
    book = await db.commit()
