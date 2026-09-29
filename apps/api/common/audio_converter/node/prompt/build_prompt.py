import json


def build_user_prompt(
    chapter_title, chapter_content, narration_style, pace, voice_catalog
) -> str:

    catalog_json = json.dumps(voice_catalog, ensure_ascii=False)

    return f"""\
Prepare the following chapter for audiobook production.

Narration style:
{narration_style}

Pace:
{pace}

Available voice catalog:
{catalog_json}

Chapter title:
{chapter_title}

Chapter content:
{chapter_content}

Follow all audiobook, translation, casting, segmentation, and output rules from the system instructions.

Return ONLY the JSON array."""
