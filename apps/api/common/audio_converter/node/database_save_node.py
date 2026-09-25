from ..state import AudioBookState


def database_save_node(state: AudioBookState):
    print(state)
    return {"book": [{"chapters": 0, "audio_generated": True, "database_save": True}]}
