import os

import time
from langchain_google_genai import ChatGoogleGenerativeAI
from ..state import AudioBookState

llm = ChatGoogleGenerativeAI(model="gemini-3.8-flash")


def llm_naration_node(state: AudioBookState):
    print("sleeping for two seconds")
    book = state["book"]
    pacing = book.get("pace")
    storytelling_style = book.get("storytelling_style")
    chapters = book.get("chapters")
    current_chapter_index = book.get("current_chapter_index")
    current_chapter = chapters[current_chapter_index]
    message = [
        (
            "system",
            "you are an expert story teller now I want from you to re-create the story for me that is provided",
        ),
        ("user", current_chapter.get("content")),
    ]
    # res = llm.invoke(message)
    print(len(current_chapter.get("content")))

    print("### processing ###")
    print(current_chapter.get("title"))
    time.sleep(2)

    return {"book": {**book, "current_chapter_index": current_chapter_index + 1}}
