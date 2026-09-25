from fastapi import UploadFile
from .separators.toc import toc_separator


async def separate_chapter_from_book(file: UploadFile):
    try:
        chapters = await toc_separator(file)
        if chapters != None:
            return chapters

        #### other separator will come here shortly
    except Exception as e:
        print(e)
