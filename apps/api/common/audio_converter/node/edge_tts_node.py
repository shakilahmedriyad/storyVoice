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
        # later we will streaming this event to front-end
        print(f"Generating chapter {title}")
        chapter_audio = AudioSegment.silent(duration=0)
        with tempfile.TemporaryDirectory() as tmp:
            for i, script in enumerate(scripts):
                seg_path = os.path.join(tmp, f"seg_{i}.mp3")
                for attempt in range(1, 4):
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

                        # breaking the attempting loop
                        break
                    except Exception:
                        if attempt < 4:
                            print(f"[Attempt {attempt}/3] Failed:")
                            print(
                                f"Failed to convert segment {i} in chapter '{title}':\n"
                                f"{script}"
                            )
                            print(f"Retrying {attempt+1}/3")
                            time.sleep(1)
                            continue
                        else:
                            raise

            local_path = os.path.join(f"{title}.mp3")
            chapter_audio.export(local_path, format="mp3")
        time.sleep(4)
        return {}
    except Exception as e:
        print(e)
