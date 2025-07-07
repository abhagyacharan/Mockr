# app/services/file_processor.py
import docx
import PyPDF2
from io import BytesIO
from typing import Dict, Any, Optional
import re

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
    def parse_resume_content(content: str) -> Dict[str, Any]:
        """Parse resume content into structured data"""
        sections = {
            "contact_info": {},
            "experience": [],
            "education": [],
            "skills": [],
            "summary": "",
            "raw_text": content
        }
        
        lines = content.split('\n')
        current_section = None
        current_content = []
        
        # Email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, content)
        if emails:
            sections["contact_info"]["email"] = emails[0]
        
        # Phone extraction
        phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, content)
        if phones:
            sections["contact_info"]["phone"] = phones[0]
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_section and current_content:
                    sections[current_section].append(' '.join(current_content))
                    current_content = []
                continue
            
            # Detect sections
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in ['experience', 'work history', 'employment', 'professional experience']):
                current_section = 'experience'
                current_content = []
            elif any(keyword in line_lower for keyword in ['education', 'academic', 'qualification']):
                current_section = 'education'
                current_content = []
            elif any(keyword in line_lower for keyword in ['skills', 'technical skills', 'competencies']):
                current_section = 'skills'
                current_content = []
            elif any(keyword in line_lower for keyword in ['summary', 'objective', 'profile']):
                current_section = 'summary'
                current_content = []
            elif current_section:
                current_content.append(line)
        
        # Add any remaining content
        if current_section and current_content:
            if current_section == 'summary':
                sections[current_section] = ' '.join(current_content)
            else:
                sections[current_section].append(' '.join(current_content))
        
        return sections
    
    @staticmethod
    def parse_job_description(content: str) -> Dict[str, Any]:
        """Parse job description content into structured data"""
        sections = {
            "requirements": [],
            "responsibilities": [],
            "skills": [],
            "qualifications": [],
            "company_info": "",
            "raw_text": content
        }
        
        lines = content.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            line = line.strip()
            if not line:
                if current_section and current_content:
                    sections[current_section].append(' '.join(current_content))
                    current_content = []
                continue
            
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in ['requirements', 'required', 'must have']):
                current_section = 'requirements'
                current_content = []
            elif any(keyword in line_lower for keyword in ['responsibilities', 'duties', 'role']):
                current_section = 'responsibilities'
                current_content = []
            elif any(keyword in line_lower for keyword in ['skills', 'technical skills', 'technologies']):
                current_section = 'skills'
                current_content = []
            elif any(keyword in line_lower for keyword in ['qualifications', 'education', 'degree']):
                current_section = 'qualifications'
                current_content = []
            elif current_section:
                current_content.append(line)
        
        # Add any remaining content
        if current_section and current_content:
            sections[current_section].append(' '.join(current_content))
        
        return sections
    
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