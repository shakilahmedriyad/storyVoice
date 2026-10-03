"""Selects a chapter extraction strategy for uploaded books."""

from fastapi import UploadFile

from .separators.table_of_contents import extract_from_table_of_contents


async def extract_chapters(file: UploadFile):
    """Extract chapters from a PDF using its table of contents."""
    return await extract_from_table_of_contents(file)
