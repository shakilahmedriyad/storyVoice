from ..state import AudioBookState


def database_save_node(state: AudioBookState):
    book = state.get("book")
    current_chapter_index = book.get("current_chapter_index")
    process_chapter = state.get("processed_chapters")
    return {
        "book": {**book, "current_chapter_index": current_chapter_index + 1},
    }
