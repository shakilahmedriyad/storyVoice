import json

import edge_tts

import time
from langchain_google_genai import ChatGoogleGenerativeAI

from .prompt.system_instruction import SYSTEM_INSTRUCTION
from .models.tts_segment_model import TTSSegmentModel
from .prompt.build_prompt import build_user_prompt
from ..state import AudioBookState

LOCALE_PREFIX_BY_LANGUAGE = {
    "english": "en",
    "bangla": "bn",
    "hindi": "hi",
    "spanish": "es",
    "french": "fr",
    "arabic": "ar",
}


async def get_voice_catalog(language: str) -> list[dict]:
    """Fetch the real, current list of edge-tts voices for this language.
    We NEVER let the LLM invent a voice name -- it must pick from this list,
    because edge-tts only understands its own fixed voice catalog."""
    locale_prefix = LOCALE_PREFIX_BY_LANGUAGE.get(language.strip().lower(), "en")
    all_voices = await edge_tts.list_voices()

    catalog = []
    for v in all_voices:
        if not v["Locale"].lower().startswith(locale_prefix):
            continue
        tag = v.get("VoiceTag", {})
        catalog.append(
            {
                "voice": v["ShortName"],
                "gender": v["Gender"],
                "personalities": tag.get("VoicePersonalities", []),
                "categories": tag.get("ContentCategories", []),
            }
        )
    return catalog


llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")

structured_output = llm.with_structured_output(TTSSegmentModel)


async def llm_naration_node(state: AudioBookState):
    book = state["book"]
    pacing = book.get("pace")
    storytelling_style = book.get("storytelling_style")
    chapters = book.get("chapters")

    current_chapter_index = book.get("current_chapter_index")
    current_chapter = chapters[current_chapter_index]

    voice_catalog = await get_voice_catalog(book.get("language"))
    prompt = build_user_prompt(
        chapter_title=current_chapter.get("title"),
        narration_style=storytelling_style,
        chapter_content=current_chapter.get("content"),
        voice_catalog=voice_catalog,
        pace=pacing,
    )
    # we will later stream this as well .
    print(f"started narating {current_chapter["title"]}")

    response = await structured_output.ainvoke(
        [
            {
                "role": "system",
                "content": SYSTEM_INSTRUCTION,
            },
            {"role": "user", "content": prompt},
        ]
    )

    json_data = json.dumps(
        [segment.model_dump() for segment in response.segments], ensure_ascii=False
    )

    time.sleep(2)

    new_chapter = {
        "chapter_title": current_chapter["title"],
        "chapter_content_edge_tts_format": json_data,
    }

    return {
        "book": {**book},
        "processed_chapters": [new_chapter],
    }
