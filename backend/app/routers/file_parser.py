# app/routers/file_parser.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.file_processor import FileProcessor

router = APIRouter()

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text = FileProcessor.extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        text = FileProcessor.extract_text_from_docx(content)
    elif filename.endswith(".txt"):
        text = FileProcessor.extract_text_from_txt(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    return FileProcessor.parse_resume_with_llm(text)

@router.post("/parse-job-description")
async def parse_job_description(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        text = FileProcessor.extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        text = FileProcessor.extract_text_from_docx(content)
    elif filename.endswith(".txt"):
        text = FileProcessor.extract_text_from_txt(content)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    return FileProcessor.parse_job_description_with_llm(text)
