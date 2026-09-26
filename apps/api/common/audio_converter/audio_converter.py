from typing import Literal

from langgraph.graph import StateGraph, START, END

from .state import AudioBookState, ChapterConfig

from .node.end_node import end_node

from .node.database_save_node import database_save_node
from .node.edge_tts_node import edge_tts_node

from .node.llm_naration_node import llm_naration_node




def has_more_chapters(
    state: AudioBookState,
) -> Literal["llm_naration_node", "edge_tts_node"]:
    """Router (conditional edge) -- this is the 'check' step.
    It doesn't need to be a node because it doesn't change state."""
    book = state["book"]
    if book["current_chapter_index"] < len(book["chapters"]):
        return "llm_naration_node"
    return "edge_tts_node"


builder = StateGraph(AudioBookState)

builder.add_node(llm_naration_node)
builder.add_node(edge_tts_node)
builder.add_node(database_save_node)
# graph.add_node(end_node)

builder.add_edge(START, "llm_naration_node")
builder.add_conditional_edges(
    "llm_naration_node",
    has_more_chapters,
    {"llm_naration_node": "llm_naration_node", "edge_tts_node": "edge_tts_node"},
)
builder.add_edge("edge_tts_node", "database_save_node")
builder.add_edge("database_save_node", END)

audio_book_builder = builder.compile()


def start_audio_converter(
    chapters: list[ChapterConfig], language: str, storytelling_style: str, pacing: str
):
    audio_book_builder.invoke(
        AudioBookState(
            {
                "book": {
                    "chapters": chapters,
                    "current_chapter_index": 0,
                    "language": language,
                    "storytelling_style": storytelling_style,
                    "pace": pacing,
                },
                "processed_chapters": [],
            }
        )
    )
