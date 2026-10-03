"""Compatibility import for the original audio book route module."""

from modules.audio_book.router import create_audio_book, router

audio_book_converter = create_audio_book
