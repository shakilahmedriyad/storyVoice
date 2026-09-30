from langdetect import detect

from typing import Literal
from ..state import AudioBookState

LOCALE_PREFIX_BY_LANGUAGE = {
    "en": "english",
    "bn": "bangla",
    "hi": "hindi",
    "es": "spanish",
    "fr": "french",
    "ar": "arabic",
}


def require_translation(
    state: AudioBookState,
) -> Literal["translation_node", "llm_naration_node"]:
    current_index = state["book"]["current_chapter_index"]
    chapter_content = state["book"]["chapters"][current_index]["content"]
    target_language = state["book"]["language"]

    ln = detect(chapter_content)

    local_lan = LOCALE_PREFIX_BY_LANGUAGE[ln]

    if local_lan.lower() == target_language.lower():
        return "llm_naration_node"

    return "translation_node"
