import json
import time
from ..state import AudioBookState


def edge_tts_node(state: AudioBookState):
    book = state.get("book")
    current_index = book["current_chapter_index"]
    process_chapters = state.get("processed_chapters")
    chapter = process_chapters[current_index]
    content = json.loads(chapter["chapter_content_edge_tts_format"])
    print(content)
    time.sleep(4)
    return {}
