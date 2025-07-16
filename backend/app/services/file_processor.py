# app/services/file_processor.py
import docx
import PyPDF2
from io import BytesIO
from typing import Dict, Any, Optional
from groq import Groq
import json
import re
import unicodedata
from app.core.config import settings

class JobDescriptionNormalizer:
    @staticmethod
    def normalize_job_description(text: str) -> str:
        """
        Clean and normalize job description text into a single line:
        - Remove/replace smart quotes and Unicode characters
        - Remove control characters and non-printable characters
        - Convert all line breaks to spaces
        - Remove excessive special characters
        - Collapse multiple spaces
        - Ensure clean single-line output for LLM processing
        """
        if not text or not isinstance(text, str):
            return ""
        
        # Step 1: Replace smart quotes and curly apostrophes with standard ones
        text = text.replace('"', '"').replace('"', '"')
        text = text.replace(''', "'").replace(''', "'")
        text = text.replace('–', '-').replace('—', '-')
        
        # Step 2: Remove zero-width characters and other invisible Unicode
        text = re.sub(r'[\u200b-\u200f\u2028-\u202f\u205f\u3000\ufeff]', '', text)
        
        # Step 3: Remove control characters (except basic ones we'll handle)
        text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
        
        # Step 4: Replace common bullet points and special characters with standard equivalents
        bullet_replacements = {
            '•': '* ',
            '◆': '* ',
            '■': '* ',
            '●': '* ',
            '►': '* ',
            '▪': '* ',
            '➤': '* ',
            '✔': '* ',
            '★': '* ',
            '▶': '* ',
            '→': '* ',
            '◦': '* ',
            '‣': '* ',
            '⁃': '* '
        }
        
        for bullet, replacement in bullet_replacements.items():
            text = text.replace(bullet, replacement)
        
        # Step 5: Normalize Unicode characters (convert accented chars to ASCII equivalents)
        text = unicodedata.normalize('NFKD', text)
        text = ''.join(c for c in text if not unicodedata.combining(c))
        
        # Step 6: Remove or replace problematic characters that can break JSON
        # Replace tabs with spaces
        text = text.replace('\t', ' ')
        
        # Replace carriage returns with spaces
        text = text.replace('\r', ' ')
        
        # Step 7: Handle line breaks strategically
        # First, identify section breaks (multiple newlines) and mark them
        text = re.sub(r'\n\s*\n+', ' | ', text)  # Replace paragraph breaks with |
        
        # Then convert remaining single newlines to spaces
        text = text.replace('\n', ' ')
        
        # Step 8: Clean up excessive punctuation and special characters
        # Remove multiple consecutive punctuation marks (except periods for ellipsis)
        text = re.sub(r'([!?;:,])\1+', r'\1', text)
        
        # Remove standalone special characters that don't add meaning
        text = re.sub(r'\s+[^\w\s.,!?;:()\-\'\"\/]+\s+', ' ', text)
        
        # Step 9: Handle common formatting issues
        # Remove excessive dashes and underscores
        text = re.sub(r'[-_]{3,}', ' ', text)
        
        # Clean up spacing around punctuation
        text = re.sub(r'\s+([.,:;!?])', r'\1', text)
        text = re.sub(r'([.,:;!?])\s+', r'\1 ', text)
        
        # Step 10: Collapse multiple spaces and clean up
        text = re.sub(r'\s{2,}', ' ', text)
        
        # Step 11: Clean up pipe separators (our paragraph markers)
        text = re.sub(r'\s*\|\s*', ' | ', text)
        text = re.sub(r'\|{2,}', '|', text)
        
        # Step 12: Final cleanup
        text = text.strip()
        
        # Remove leading/trailing pipes
        text = re.sub(r'^[\s|]+|[\s|]+$', '', text)
        
        # Ensure no double spaces remain
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
    
    @staticmethod
    def validate_normalized_text(text: str) -> bool:
        """
        Validate that the normalized text is safe for JSON processing
        """
        if not text:
            return False
        
        # Check for problematic characters that could break JSON
        problematic_chars = ['\n', '\r', '\t', '\x00', '\x08', '\x0c']
        for char in problematic_chars:
            if char in text:
                return False
        
        # Check for excessive length (optional safeguard)
        if len(text) > 50000:  # Adjust based on your needs
            return False
        
        return True
    
    @staticmethod
    def normalize_with_validation(text: str) -> str:
        """
        Normalize text and validate the result
        """
        normalized = JobDescriptionNormalizer.normalize_job_description(text)
        
        if not JobDescriptionNormalizer.validate_normalized_text(normalized):
            raise ValueError("Text normalization failed validation")
        
        return normalized

class FileProcessor:
    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
    
    @staticmethod
    def extract_text_from_docx(file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(BytesIO(file_content))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")
    
    @staticmethod
    def extract_text_from_txt(file_content: bytes) -> str:
        """Extract text from TXT file"""
        try:
            return file_content.decode('utf-8').strip()
        except UnicodeDecodeError:
            try:
                return file_content.decode('latin-1').strip()
            except Exception as e:
                raise Exception(f"Error reading TXT: {str(e)}")
    
    @staticmethod
    def _llm_extract(prompt: str) -> Dict[str, Any]:
        client = Groq(api_key=settings.chatgroq_api_key)

        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.6,
            max_tokens=2000,
        )

        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            # Fallback: Extract JSON substring using regex
            match = re.search(r"\{.*\}", response.choices[0].message.content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass
            raise Exception(f"Failed to parse JSON from LLM output:\nPrompt:\n{prompt}\n\nLLM Output:\n{response.choices[0].message.content}")

    @staticmethod
    def parse_resume_with_llm(content: str) -> Dict[str, Any]:
        prompt = (
            "You are a helpful assistant that extracts structured information from resumes.\n"
            "Given the following resume text, return a JSON object with these fields:\n"
            "- contact_info: { email, phone, name (if available) }\n"
            "- summary: (brief summary or objective if available)\n"
            "- education: (list of education entries if available)\n"
            "- projects: (list of projects entries if available)\n"
            "- experience: (list of job experiences if available)\n"
            "- skills: (list of technical and soft skills)\n"
            "- certifications: (list if available)\n"
            "- raw_text: (include original text)\n\n"
            "Respond ONLY with valid JSON and no extra text."
            f"Resume:\n{content}\n\n"
            "Extracted JSON:"
        )
        return FileProcessor._llm_extract(prompt)

    @staticmethod
    def normalize_job_description(text: str) -> str:
        """
        Clean and normalize job description text into a single line
        """
        return JobDescriptionNormalizer.normalize_with_validation(text)

    @staticmethod
    def parse_job_description_with_llm(content: str) -> Dict[str, Any]:

        normalized_content = JobDescriptionNormalizer.normalize_job_description(content)

        prompt = (
            "You are a helpful assistant that extracts structured information from job descriptions.\n"
            "Given the following job description text, return a JSON object with these fields:\n"
            "- title: position/role of the job\n"
            "- company_info\n"
            "- responsibilities (list)\n"
            "- requirements (list)\n"
            "- qualifications (list)\n"
            "- skills: (list of technical and soft skills)\n"
                "languages: [...], \n"
                "data_science: [...]\n"
                "full_stack: [...]\n"
                "databases: [...]\n"
                "technologies: [...]\n"
            "- raw_text: (include original text)\n\n"
            "Respond ONLY with valid JSON and no extra text."
            f"Job Description:\n{normalized_content}\n\n"
            "Extracted JSON:"
        )
        return FileProcessor._llm_extract(prompt)
    
    @staticmethod
    async def generate_mcq_questions(content: str, difficulty: str , num_questions: int = 5) -> Dict[str, Any]:
        """
        Generate MCQ-style mock interview questions from given text content using LLM.
        """
        normalized_content = JobDescriptionNormalizer.normalize_job_description(content)
        
        prompt = (
            f"You are an AI that creates mock interview questions based only on the relevant professional details of a resume.\n"
            f"Use ONLY the following sections to generate questions: 'skills', 'projects', 'education', 'certifications' and 'experience'.\n"
            f"Ignore other parts like summary, contact info, or raw text.\n\n"
            f"Generate {num_questions} multiple choice questions (MCQs) from the provided content.\n"
            f"Ensure the difficulty level is '{difficulty}'. Each question must be a JSON object with:\n"
            f"- question: the question text\n"
            f"- options: list of 4 options\n"
            f"- answer: the correct option text\n"
            f"- explanation: short explanation of correct answer\n\n"
            f"Respond ONLY with a valid JSON list. Do not include extra commentary or text.\n"
            f"Format: [{{\"question\": \"...\", \"options\": [...], \"answer\": \"...\", \"explanation\": \"...\"}}, ...]\n\n"
            f"Resume sections:\n{normalized_content}\n\n"
            f"Questions:"
        )

        return FileProcessor._llm_extract(prompt)
    
    @staticmethod
    def get_file_size_string(size_bytes: int) -> str:
        """Convert bytes to human readable format"""
        if size_bytes == 0:
            return "0B"
        size_names = ["B", "KB", "MB", "GB"]
        i = 0
        while size_bytes >= 1024 and i < len(size_names)-1:
            size_bytes /= 1024.0
            i += 1
        return f"{size_bytes:.1f}{size_names[i]}"
    
