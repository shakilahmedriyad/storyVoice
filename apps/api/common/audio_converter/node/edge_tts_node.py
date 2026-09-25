import time
from ..state import AudioBookState


def edge_tts_node(state: AudioBookState):
    print("sleeping for 4 seconds")
    time.sleep(4)
    return {"book": [{"chapters": 0, "audio_generated": True}]}
