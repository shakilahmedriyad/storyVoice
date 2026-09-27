import json
import os
import edge_tts

import time
from langchain_google_genai import ChatGoogleGenerativeAI
from ..state import AudioBookState

SYSTEM_INSTRUCTION = """\
You are a professional audiobook editor and narration director. You take a \
book chapter that is already written in a specific narration style and pace, \
and prepare it for text-to-speech performance. Your job is ONLY:
1. Translate it into the target language, IF it is not already in that language.
2. Split the (already-styled) text into short spoken segments and return \
edge-tts-ready JSON.
You never summarize, shorten, add, or drop plot content. You never change \
the narration style or pacing -- that is already baked into the text as \
written. You always respond with ONLY the requested output, no preamble, no \
explanations, no markdown fences."""


def _build_user_prompt(
    chapter_title, chapter_content, narration_style, pace, language, voice_catalog
) -> str:

    catalog_json = json.dumps(voice_catalog, ensure_ascii=False)

    return f"""\
if story is in {language} then do not translate else translate to this language first the do the rest.

The chapter's narration style is "{narration_style}" and its pace is "{pace}" \
-- the text already reflects this, so do not rewrite for style or pace. \
Only translate if instructed above, then format for speech.
 
CASTING: Identify every distinct speaker in this chapter (the narrator, plus \
any character who has dialogue). Assign each speaker exactly ONE voice from \
this catalog of REAL available voices -- you must use these exact "voice" \
values, never invent a name:
{catalog_json}
 
Pick voices that fit each character (gender, and personality tags like \
Confident/Warm/Friendly). Use the SAME voice for the SAME speaker every time \
they appear in this chapter. Then use "pitch" and "rate" on top of the \
chosen voice to push the performance further -- e.g. a deep/old character: \
lower pitch (like "-15Hz" to "-25Hz") and slower rate; a young/energetic \
character: higher pitch (like "+10Hz" to "+20Hz") and faster rate. The \
narrator should generally use a neutral pitch/rate matching the "{narration_style}" \
style and "{pace}" pace unless a specific line calls for emphasis.
 
Now split the resulting text into short spoken segments (roughly one \
sentence, or one line of dialogue, per segment) and return ONLY a JSON \
array, no markdown fences, no commentary. Each element must have exactly \
these keys:
  "speaker": short label, e.g. "narrator" or a character's name
  "voice": one of the exact "voice" values from the catalog above
  "text": plain text of the segment, no markdown/symbols, spelled-out \
numbers and abbreviations, entirely in {language}
  "rate": edge-tts rate string between "-50%" and "+50%"
  "volume": edge-tts volume string between "-50%" and "+50%", "+0%" unless \
a moment calls for louder/quieter delivery
  "pitch": edge-tts pitch string between "-50Hz" and "+50Hz"
  "pause_after_ms": integer 0-2000, silence after this segment (larger for \
dramatic beats, paragraph breaks, or chapter-ending lines; 0-150 for \
mid-sentence continuations)

Title: {chapter_title}

{chapter_content}"""


LOCALE_PREFIX_BY_LANGUAGE = {
    "english": "en",
    "bengali": "bn",
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


llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite")


async def llm_naration_node(state: AudioBookState):
    print("sleeping for two seconds")
    book = state["book"]
    pacing = book.get("pace")
    storytelling_style = book.get("storytelling_style")
    language = book.get("language")
    chapters = book.get("chapters")

    current_chapter_index = book.get("current_chapter_index")
    current_chapter = chapters[current_chapter_index]

    voice_catalog = await get_voice_catalog(book.get("language"))

    prompt = _build_user_prompt(
        chapter_title=current_chapter.get("title"),
        language=language,
        narration_style=storytelling_style,
        chapter_content=current_chapter.get("content"),
        voice_catalog=voice_catalog,
        pace=pacing,
    )

    response = await llm.ainvoke(
        [
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user", "content": prompt},
        ]
    )
    time.sleep(2)

    new_chapter = {
        "chapter_title": current_chapter["title"],
        "chapter_content_edge_tts_format": response.text,
    }

    return {
        "book": {**book},
        "processed_chapters": [new_chapter],
    }
