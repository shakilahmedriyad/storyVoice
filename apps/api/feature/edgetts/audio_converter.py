import edge_tts

# 1. Cast configuration optimized for audiobooks (Slightly slower rates for clear listening)
CAST = {
    "Narrator": {
        "voice": "bn-BD-NabanitaNeural",
        "rate": "-7%",  # Slower pace for immersive narration
        "pitch": "+0Hz",
    },
    "Grandfather (দাদু)": {
        "voice": "bn-BD-PradeepNeural",
        "rate": "-12%",  # Deliberate, slow speech for an elderly person
        "pitch": "-4Hz",  # Deeper, older tone
    },
    "Little Boy (অপু)": {
        "voice": "bn-IN-BashkarNeural",
        "rate": "+2%",  # Energetic, slightly faster child pace
        "pitch": "+5Hz",  # Higher pitch to sound like a young child
    },
    "Mother (মা)": {
        "voice": "bn-IN-TanishaaNeural",
        "rate": "-5%",  # Soft, warm cadence
        "pitch": "+1Hz",
    },
    "Villager (গ্রামবাসী)": {
        "voice": "bn-BD-PradeepNeural",
        "rate": "-5%",  # Normal adult speed
        "pitch": "+1Hz",
    },
    "Fairytale Fairy (পরী)": {
        "voice": "bn-BD-NabanitaNeural",
        "rate": "-8%",
        "pitch": "+6Hz",  # Magical, lighter tone
    },
}

# 2. Your Bengali Story Structure
# Tip for listener friendliness: Use punctuation like ellipses (...) or commas (,) to force the AI to pause naturally.
story_script = [
    (
        "Narrator",
        "বহু বছর আগের কথা... সবুজ গাছপালায় ঘেরা এক শান্ত গ্রামে ছোট্ট একটি ছেলে থাকত, তার নাম অপু।",
    ),
    ("Little Boy (অপু)", "দাদু! দাদু! আজ আমাকে সেই জাদুর বনের গল্পটা শোনাও না?"),
    (
        "Grandfather (দাদু)",
        "হা হা হা... আচ্ছা দাদু ভাই বোসো। তাহলে শোনো... সেই বনের গভীরে এক দয়ালু পরী থাকত।",
    ),
    ("Narrator", "ঠিক তখনই ঘরের দরজা খুলে অপুর মা ভেতরে এলেন।"),
    (
        "Mother (মা)",
        "অপু, গল্প শোনা শেষ হলে কিন্তু তাড়াতাড়ি ঘুমিয়ে পড়তে হবে, কাল সকাল সকাল স্কুল আছে।",
    ),
    ("Little Boy (অপু)", "আচ্ছা মা, আমি লক্ষ্মী ছেলে হয়ে ঘুমিয়ে পড়ব!"),
    (
        "Narrator",
        "হঠাৎ জানালার বাইরে এক অদ্ভুত আলো জ্বলে উঠল। আর এক মিষ্টি কণ্ঠস্বর ভেসে এলো বাতাস থেকে...",
    ),
    ("Fairytale Fairy (পরী)", "ভয় পেয়ো না অপু, আমি তোমাদের বনের সেই পরী..."),
]


async def generate_story():
    print("Generating your listener-friendly Bengali story... Please wait...")

    with open("bangla_audiobook.mp3", "wb") as f:
        for character, text in story_script:
            # Get the unique audio properties for the current character
            config = CAST[character]

            communicate = edge_tts.Communicate(
                text=text,
                voice=config["voice"],
                rate=config["rate"],
                pitch=config["pitch"],
            )

            # Append each line's audio seamlessly into the final file
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    data = chunk.get("data")
                    if data is not None:
                        f.write(data)
