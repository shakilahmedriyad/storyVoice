"""Application service for audio book creation."""

from common.audio_converter.audio_converter import start_audio_converter
from common.audio_converter.state import ChapterConfig


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
