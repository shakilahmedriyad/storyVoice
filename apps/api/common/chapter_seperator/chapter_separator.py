"""Compatibility imports for the original misspelled package path."""

from common.chapter_separator.chapter_extractor import extract_chapters

separate_chapter_from_book = extract_chapters

__all__ = ["extract_chapters", "separate_chapter_from_book"]
