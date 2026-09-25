from fastapi import UploadFile
from enum import Enum
from pydantic import BaseModel, Field, field_validator

MAX_FILE_SIZE = 10 * 1024 * 1024


class Language(str, Enum):
    ENGLISH = "English"
    SPANISH = "Spanish"
    FRENCH = "French"
    BANGLA = "Bangla"
    URDU = "Urdu"
    HINDI = "Hindi"
    ARABIC = "Arabic"


class Style(str, Enum):
    CINEMATIC = "Cinematic"
    CLASSIC = "Classic"
    CALM = "Calm"
    JOYFUL = "Joyful"
    DOCUMENTARY = "Documentary"


class Pacing(str, Enum):
    BALANCED = "Balanced"
    RELAXED = "Relaxed"
    ENERGETIC = "Energetic"


class CreateAudioBookSchema(BaseModel):
    file: UploadFile
    language: Language
    style: Style
    pacing: Pacing
    instructions: str = Field(default="", max_length=500)

    @field_validator("file")
    @classmethod
    def validate_file(cls, value):
        if not hasattr(value, "content_type"):
            raise ValueError("Please choose a PDF file.")

        if value.content_type != "application/pdf":
            raise ValueError("Please choose a PDF file.")

        if value.size > MAX_FILE_SIZE:
            raise ValueError("Your PDF must be 10MB or smaller.")

        return value
