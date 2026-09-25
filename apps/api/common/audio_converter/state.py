import operator

from typing import Annotated
from typing_extensions import TypedDict


def add_items(existing: list[dict], new_item: dict) -> list[dict]:
    return existing + [new_item]


class ChapterConfig(TypedDict):
    title: str
    start_page: int
    end_page: int
    content: str


class BookConfig(TypedDict):
    chapters: list[ChapterConfig]  # [{"title": "...", "content": "..."}, ...]
    current_chapter_index: int  # index of the next chapter to process
    language: str
    storytelling_style: str
    pace: str


class ProcessedChapter(TypedDict):
    chapter_title: str
    chapter_content: str  # LLM-processed text
    chapter_content_edge_tts_format: str  # LLM output prepared for TTS


class AudioBookState(TypedDict):
    # a single dict is easier than a list with one item
    book: BookConfig
    # the reducer makes returned lists get APPENDED instead of overwriting
    processed_chapters: Annotated[list[ProcessedChapter], operator.add]
