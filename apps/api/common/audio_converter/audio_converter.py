from langgraph.graph import StateGraph, MessagesState, START, END

from .state import AudioBookState

from .node.end_node import end_node

from .node.database_save_node import database_save_node
from .node.edge_tts_node import edge_tts_node

from .node.llm_naration_node import llm_naration_node

graph = StateGraph(AudioBookState)

graph.add_node(llm_naration_node)
graph.add_node(edge_tts_node)
graph.add_node(database_save_node)
# graph.add_node(end_node)

graph.add_edge(START, "llm_naration_node")
graph.add_edge("llm_naration_node", "edge_tts_node")
graph.add_edge("edge_tts_node", "database_save_node")
graph.add_edge("database_save_node", END)

book_graph = graph.compile()
