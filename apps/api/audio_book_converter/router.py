from typing import Annotated, cast

from fastapi import APIRouter, Form

from common.audio_converter.state import AudioBookState
from common.chapter_seperator.chapter_separator import separate_chapter_from_book
from common.audio_converter.audio_converter import book_graph
from .contract.audio_book_create_schema import CreateAudioBookSchema
from feature.edgetts.audio_converter import generate_story

router = APIRouter(prefix="/converter", tags=["Audio Book Converter"])


@router.post("/")
async def audio_book_converter(form_data: Annotated[CreateAudioBookSchema, Form()]):
    # session = client.chats.create(model="gemini-3.8-flash")
    file = form_data.file
    chapters = await separate_chapter_from_book(file=file)
    book_graph.invoke(AudioBookState({"book": [{"chapters": 1, "start": True}]}))
    return {
        "message": "Welcome to the Audio Book Converter",
    }
