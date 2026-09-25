import pymupdf
from fastapi import UploadFile


def get_chapter_entries(toc, target_level=1):
    return [entry for entry in toc if entry[0] == target_level]


def pick_chapter_level(toc):
    from collections import Counter

    level_counts = Counter(entry[0] for entry in toc)
    for level, count in sorted(level_counts.items()):
        if 3 <= count <= 60:  # reasonable chapter range
            return level
    return min(level_counts)  # fallback to top level


def get_chapter_page_ranges(chapter_entries, total_pages):
    ranges = []
    for i, (level, title, start_page) in enumerate(chapter_entries):
        if i + 1 < len(chapter_entries):
            end_page = chapter_entries[i + 1][2] - 1  # up to next chapter's start
        else:
            end_page = total_pages  # last chapter goes to end of doc
        ranges.append(
            {"title": title.strip(), "start_page": start_page, "end_page": end_page}
        )
    return ranges


def extract_chapter_text(doc, start_page, end_page):
    text = ""
    for page_num in range(start_page - 1, end_page):  # convert to 0-indexed
        text += doc[page_num].get_text()
    return text


async def toc_separator(file: UploadFile):
    stream = await file.read()
    doc = pymupdf.open(stream=stream, filetype="pdf")
    toc = doc.get_toc()
    if not toc:
        return None  # fall back to other method

    level = pick_chapter_level(toc)
    chapter_entries = get_chapter_entries(toc, level)
    ranges = get_chapter_page_ranges(chapter_entries, doc.page_count)

    chapters = []

    for r in ranges:
        text = extract_chapter_text(doc, r["start_page"], r["end_page"])
        chapters.append(
            {
                "title": r["title"],
                "start_page": r["start_page"],
                "end_page": r["end_page"],
                "content": text,
            }
        )

    return chapters
