from langchain_google_genai import ChatGoogleGenerativeAI

from ..state import AudioBookState

TRANSLATION_SYSTEM_PROMPT = """
You are a professional literary translator.

Translate the provided chapter , user will send you the content and language they want to translate it into.

Rules:
- Translate the COMPLETE content. Never summarize, shorten, omit, or skip anything.
- Preserve the exact meaning, events, facts, characters, dialogue, descriptions, and narrative order.
- Preserve the author's tone, style, mood, voice, emotion, and literary qualities.
- Translate meaning naturally rather than mechanically word-for-word.
- Do not add information, explanations, interpretations, or content that is not in the source.
- Preserve dialogue, quotations, names, headings, and important formatting.
- Do not modernize, simplify, or rewrite the author's style unless explicitly requested.
- The result must contain the full content of the original chapter in the target language.

Return ONLY the translated chapter. No notes, explanations, summaries, or commentary.
"""


llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite")


async def translation_node(state: AudioBookState):
    book = state["book"]
    current_chapter_index = book["current_chapter_index"]
    chapters = book["chapters"]
    language = book["language"]
    chapter_content = chapters[current_chapter_index]

    print(f"translating chapter: {chapters[current_chapter_index]['title']}")

    prompt = f"""
                Translate the following chapter to {language}.

                Chapter:
                {chapter_content}
                """

    translated_content = await llm.ainvoke(
        [
            {
                "role": "system",
                "content": TRANSLATION_SYSTEM_PROMPT,
            },
            {"role": "user", "content": prompt},
        ]
    )

    chapters[current_chapter_index]["content"] = translated_content.text

    return {"book": {**book, "chapters": chapters}}
