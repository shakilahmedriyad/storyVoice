import os
import time
import tempfile
import json
import edge_tts

from pydub import AudioSegment


from ..state import AudioBookState


async def edge_tts_node(state: AudioBookState):
    try:
        book = state.get("book")
        current_index = book["current_chapter_index"]
        process_chapters = state.get("processed_chapters")
        chapter = process_chapters[current_index]
        scripts = json.loads(chapter["chapter_content_edge_tts_format"])
        title = chapter["chapter_title"]
        print(f"Generating chapter {title}")
        chapter_audio = AudioSegment.silent(duration=0)
        with tempfile.TemporaryDirectory() as tmp:
            for i, script in enumerate(scripts):
                seg_path = os.path.join(tmp, f"seg_{i}.mp3")
                try:
                    communicate = edge_tts.Communicate(
                        text=script["text"],
                        voice=script["voice"],
                        pitch=script["pitch"],
                        volume=script["volume"],
                        rate=script["rate"],
                    )

                    await communicate.save(seg_path)
                    chapter_audio += AudioSegment.from_mp3(seg_path)
                    if script["pause_after_ms"]:
                        chapter_audio += AudioSegment.silent(
                            duration=script["pause_after_ms"]
                        )
                except Exception:
                    print(
                        f"Failed to convert segment {i} in chapter '{title}':\n"
                        f"{script}"
                    )
                    raise

            local_path = os.path.join(f"{title}.mp3")
            chapter_audio.export(local_path, format="mp3")

        print("done converting to audio")

        time.sleep(4)
        return {}
    except Exception as e:
        print(e)
