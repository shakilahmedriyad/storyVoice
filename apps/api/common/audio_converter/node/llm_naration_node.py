import time
from ..state import AudioBookState


def llm_naration_node(state: AudioBookState):
    print("sleeping for two seconds")
    time.sleep(2)
    return {"book": [{"current_chapter": 0, "content": "just a demo for now"}]}
