from langgraph.graph import StateGraph, MessagesState, START, END


def end_node(state: MessagesState):
    return END
