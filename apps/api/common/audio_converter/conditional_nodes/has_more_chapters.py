from typing import Literal
from ..state import AudioBookState


def has_more_chapters(
    state: AudioBookState,
) -> Literal["start_node", "end_node"]:
    """Router (conditional edge) -- this is the 'check' step.
    It doesn't need to be a node because it doesn't change state."""
    book = state["book"]
    if book["current_chapter_index"] < len(book["chapters"]):
        return "start_node"
    return "end_node"
