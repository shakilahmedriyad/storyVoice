"""Extract chapter text using the PDF's embedded table of contents."""

from collections import Counter

import pymupdf
from fastapi import UploadFile


def _select_chapter_level(toc: list) -> int:
    level_counts = Counter(entry[0] for entry in toc)
    for level, count in sorted(level_counts.items()):
        if 3 <= count <= 60:
            return level
    return min(level_counts)


def _build_page_ranges(chapter_entries: list, total_pages: int) -> list[dict]:
    ranges = []
    for index, (_, title, start_page) in enumerate(chapter_entries):
        end_page = (
            chapter_entries[index + 1][2] - 1
            if index + 1 < len(chapter_entries)
            else total_pages
        )
        ranges.append(
            {"title": title.strip(), "start_page": start_page - 1, "end_page": end_page}
        )
    return ranges


def _extract_page_text(document, start_page: int, end_page: int) -> str:
    return "".join(document[page_number].get_text() for page_number in range(start_page - 1, end_page))


async def extract_from_table_of_contents(file: UploadFile):
    contents = await file.read()
    document = pymupdf.open(stream=contents, filetype="pdf")
    toc = document.get_toc()
    if not toc:
        return None

    level = _select_chapter_level(toc)
    chapter_entries = sorted(
        (entry for entry in toc if entry[0] == level), key=lambda entry: entry[2]
    )
    chapters = []
    for page_range in _build_page_ranges(chapter_entries, document.page_count):
        chapters.append(
            {
                **page_range,
                "content": _extract_page_text(
                    document, page_range["start_page"], page_range["end_page"]
                ),
            }
        )
    return chapters
