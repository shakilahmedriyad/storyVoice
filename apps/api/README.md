# API structure

The API uses feature modules with a small HTTP composition layer:

- `main.py` creates the FastAPI application and configures middleware.
- `api/router.py` mounts feature routers under `/api`.
- `modules/audio_book/` owns the audio book request schema, route, and application service.
- `common/audio_converter/` contains the audio processing workflow and its nodes.
- `common/chapter_separator/` contains PDF chapter extraction and extraction strategies.

The older `audio_book_converter/`, `server/`, and misspelled `common/chapter_seperator/` paths remain as compatibility imports for existing code. New code should use the `modules/`, `api/`, and correctly spelled `common/chapter_separator/` paths.
