from datetime import datetime
from sqlalchemy import TIMESTAMP, ForeignKey, Text, func, String, func
from sqlalchemy.orm import Mapped, Relationship, mapped_column
from db.base import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    language: Mapped[str] = mapped_column(String(50), nullable=False)
    pacing: Mapped[str] = mapped_column(String(50), nullable=False)
    style: Mapped[str] = mapped_column(String(50), nullable=False)
    chapters: Mapped[list["Chapter"]] = Relationship(
        back_populates="book", cascade="all, delete-orphan"
    )

    is_published: Mapped[bool] = mapped_column(nullable=False, default=False)

    total_chapters: Mapped[int] = mapped_column(nullable=False, default=0)
    processed_chapters: Mapped[int] = mapped_column(nullable=False, default=0)

    processing_status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending"
    )
    processing_error: Mapped[str] = mapped_column(
        String(255), nullable=True, default=None
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.now(), init=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
        init=False,
    )


class Chapter(Base):
    __tablename__ = "chapters"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, init=False)
    chapter_index: Mapped[int] = mapped_column(nullable=False)
    user_id: Mapped[str] = mapped_column(String(255), nullable=False)
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="CASCADE", name="fk_chapter_book"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    book: Mapped["Book"] = Relationship(back_populates="chapters")

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.now(), init=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
        init=False,
    )
