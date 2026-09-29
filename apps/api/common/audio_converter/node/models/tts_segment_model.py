import re
from typing import Literal
from pydantic import BaseModel, Field, create_model, field_validator


class segmentModel(BaseModel):
    speaker: str = Field(description='"narrator" or the character\'s name')
    voice: str = Field(description="Exact voice name from the provided catalog")
    text: str = Field(description="Plain spoken text, no markdown or symbols")
    rate: str = Field("+0%", description='Speed, "-50%" to "+50%"')
    volume: str = Field("+0%", description='Loudness, "-50%" to "+50%"')
    pitch: str = Field("+0Hz", description='Pitch, "-50Hz" to "+50Hz"')
    pause_after_ms: int = Field(
        200, ge=0, le=2000, description="Silence after this segment"
    )

    pause_after_ms: int = Field(
        default=150,
        ge=0,
        le=2000,
    )


class TTSSegmentModel(BaseModel):
    segments: list[segmentModel] = Field(min_length=2)
