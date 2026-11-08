import time
from ..state import AudioBookState


def database_save_node(state: AudioBookState):
    book = state.get("book")
    print("saving but not saving")
    current_chapter_index = book.get("current_chapter_index")
    current_chapter = book.get("chapters")[current_chapter_index]

    print(f"current_chapter_index: {current_chapter['title']}")

    # later we will make it more efficient
    print("waiting for 10 seconds to avoid rate limit")
    time.sleep(10)
    return {
        "book": {**book, "current_chapter_index": current_chapter_index + 1},
    }
