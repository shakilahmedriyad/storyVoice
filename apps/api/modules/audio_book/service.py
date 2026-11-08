"""Application service for audio book creation."""

import re

from fastapi import HTTPException
from sqlalchemy import select

from utils.schema.Ctx import UserModel
from common.audio_converter.audio_converter import start_audio_converter
from common.audio_converter.state import ChapterConfig
from sqlalchemy.ext.asyncio import AsyncSession


from .models.model import Book, Chapter
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
) -> Book:
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
        name=form_data.file.filename or "Untitled Book",
        user_id=user.id,
        total_chapters=len(chapters),
    )

    db.add(book)
    # saving book to the database
    await db.commit()
    return book


_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")


def clean(text: str) -> str:
    text = text.replace("\xad", "")  # soft hyphens from PDF line breaks
    return _CONTROL_CHARS.sub("", text)  # NUL and other control chars


async def save_chapters_to_db(
    chapters: list[ChapterConfig],
    book: Book,
    db: AsyncSession,
):

    for index, ch in enumerate(chapters):
        chapter = Chapter(
            title=clean(ch["title"]),
            content=clean(ch["content"]),
            user_id=book.user_id,
            book_id=book.id,
            chapter_index=index,
        )
        db.add(chapter)

    await db.commit()
