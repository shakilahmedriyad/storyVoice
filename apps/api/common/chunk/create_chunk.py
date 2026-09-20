from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.document_loaders import Blob
from langchain_community.document_loaders.parsers import PyPDFParser

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,
    chunk_overlap=30,
    length_function=len,
    is_separator_regex=False,
)


def creat_chunk(pdf_bytes):
    blob = Blob.from_data(pdf_bytes, mime_type="application/pdf")
    parser = PyPDFParser()
    docs = list(parser.lazy_parse(blob))
    text = text_splitter.split_documents(docs)
    print("first chunk ever => ", text[0])
