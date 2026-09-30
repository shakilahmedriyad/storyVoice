from langgraph.graph import StateGraph, START, END

from .node.start_node import start_node

from .conditional_nodes.require_translation import require_translation

from .node.translation_node import translation_node

from .conditional_nodes.has_more_chapters import has_more_chapters

from .state import AudioBookState, ChapterConfig


from .node.database_save_node import database_save_node
from .node.edge_tts_node import edge_tts_node

from .node.llm_naration_node import llm_naration_node
from langgraph.types import RetryPolicy

builder = StateGraph(AudioBookState)
builder.add_node(start_node)
builder.add_node(require_translation)
builder.add_node(translation_node)
builder.add_node(
    llm_naration_node, retry_policy=RetryPolicy(initial_interval=30, max_attempts=3)
)
builder.add_node(edge_tts_node)
builder.add_node(database_save_node)
# graph.add_node(end_node)

builder.add_edge(START, "start_node")

builder.add_conditional_edges(
    "start_node",
    require_translation,
    {"translation_node": "translation_node", "llm_naration_node": "llm_naration_node"},
)
builder.add_edge("translation_node", "llm_naration_node")
builder.add_edge("llm_naration_node", "edge_tts_node")
builder.add_edge("edge_tts_node", "database_save_node")
builder.add_conditional_edges(
    "database_save_node",
    has_more_chapters,
    {"start_node": "start_node", "end_node": END},
)

audio_book_builder = builder.compile()


async def start_audio_converter(
    chapters: list[ChapterConfig], language: str, storytelling_style: str, pacing: str
):
    await audio_book_builder.ainvoke(
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
