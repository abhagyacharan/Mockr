# app/services/llm_service.py
import openai
import json
import asyncio
from typing import List, Dict, Any
from app.core.config import settings

class LLMService:
    def __init__(self):
        openai.api_key = settings.openai_api_key
    
    async def generate_questions(
        self,
        content: str,
        source_type: str,
        difficulty: str = "medium",
        num_questions: int = 10
    ) -> List[Dict[str, Any]]:
        """Generate interview questions based on content"""
        
        if not settings.openai_api_key:
            # Return mock questions if no API key
            return self._generate_mock_questions(source_type, difficulty, num_questions)
        
        try:
            prompt = self._build_prompt(content, source_type, difficulty, num_questions)
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert interviewer who creates relevant interview questions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            questions = self._parse_llm_response(response.choices[0].message.content)
            return questions
            
        except Exception as e:
            print(f"Error generating questions with LLM: {e}")
            # Fallback to mock questions
            return self._generate_mock_questions(source_type, difficulty, num_questions)
    
    def _build_prompt(self, content: str, source_type: str, difficulty: str, num_questions: int) -> str:
        """Build prompt for LLM"""
        
        if source_type == "resume":
            return f"""
            Based on the following resume, generate {num_questions} interview questions that would be relevant for this candidate.
            
            Resume Content:
            {content}
            
            Generate questions with the following distribution:
            - 40% Technical questions related to skills and experience mentioned
            - 30% Behavioral questions about past experiences
            - 30% Situational questions about hypothetical scenarios
            
            Difficulty level: {difficulty}
            
            Return the response as a JSON array with the following format:
            [
                {{
                    "id": 1,
                    "type": "technical",
                    "question": "Question text here",
                    "difficulty": "{difficulty}",
                    "category": "specific category like 'programming', 'leadership', etc."
                }},
                ...
            ]
            
            Make sure the questions are:
            1. Relevant to the candidate's background
            2. Appropriate for the difficulty level
            3. Varied in type and focus
            4. Professional and clear
            """
        
        else:  # job_description
            return f"""
            Based on the following job description, generate {num_questions} interview questions that would be asked for this role.
            
            Job Description:
            {content}
            
            Generate questions with the following distribution:
            - 40% Role-specific technical questions
            - 30% Behavioral questions
            - 30% Situational questions
            
            Difficulty level: {difficulty}
            
            Return the response as a JSON array with the following format:
            [
                {{
                    "id": 1,
                    "type": "technical",
                    "question": "Question text here",
                    "difficulty": "{difficulty}",
                    "category": "specific category like 'programming', 'leadership', etc."
                }},
                ...
            ]
            
            Make sure the questions are:
            1. Relevant to the job requirements
            2. Appropriate for the difficulty level
            3. Varied in type and focus
            4. Professional and clear
            """
    
    def _parse_llm_response(self, response_text: str) -> List[Dict[str, Any]]:
        """Parse LLM response and extract questions"""
        try:
            # Try to find JSON in the response
            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                questions = json.loads(json_str)
                
                # Validate and clean questions
                valid_questions = []
                for i, q in enumerate(questions):
                    if isinstance(q, dict) and 'question' in q:
                        valid_questions.append({
                            "id": i + 1,
                            "type": q.get("type", "general"),
                            "question": q["question"],
                            "difficulty": q.get("difficulty", "medium"),
                            "category": q.get("category", "general")
                        })
                
                return valid_questions
            
        except json.JSONDecodeError:
            pass
        
        # Fallback: parse as plain text
        lines = response_text.split('\n')
        questions = []
        question_id = 1
        
        for line in lines:
            line = line.strip()
            if line and ('?' in line or line.startswith(('1.', '2.', '3.'))):
                # Clean up the line
                line = line.lstrip('0123456789. ')
                if line:
                    questions.append({
                        "id": question_id,
                        "type": "general",
                        "question": line,
                        "difficulty": "medium",
                        "category": "general"
                    })
                    question_id += 1
        
        return questions
    
    def _generate_mock_questions(self, source_type: str, difficulty: str, num_questions: int) -> List[Dict[str, Any]]:
        """Generate mock questions when LLM is not available"""
        
        if source_type == "resume":
            mock_questions = [
                {"type": "technical", "question": "Tell me about your experience with the technologies mentioned in your resume.", "category": "technical"},
                {"type": "behavioral", "question": "Describe a challenging project you worked on and how you overcame obstacles.", "category": "problem-solving"},
                {"type": "technical", "question": "How do you stay updated with the latest trends in your field?", "category": "learning"},
                {"type": "situational", "question": "If you had to learn a new technology for a project, how would you approach it?", "category": "adaptability"},
                {"type": "behavioral", "question": "Tell me about a time when you had to work with a difficult team member.", "category": "teamwork"},
                {"type": "technical", "question": "Explain a complex technical concept to someone without a technical background.", "category": "communication"},
                {"type": "situational", "question": "How would you handle a situation where you disagree with your manager's technical decision?", "category": "conflict-resolution"},
                {"type": "behavioral", "question": "Describe your most significant professional achievement.", "category": "achievements"},
                {"type": "technical", "question": "What is your approach to debugging and troubleshooting?", "category": "problem-solving"},
                {"type": "situational", "question": "How do you prioritize tasks when working on multiple projects?", "category": "time-management"}
            ]
        else:  # job_description
            mock_questions = [
                {"type": "technical", "question": "How does your experience align with the requirements of this role?", "category": "role-fit"},
                {"type": "behavioral", "question": "Why are you interested in this position?", "category": "motivation"},
                {"type": "technical", "question": "What relevant skills do you bring to this role?", "category": "skills"},
                {"type": "situational", "question": "How would you approach your first 90 days in this role?", "category": "planning"},
                {"type": "behavioral", "question": "Tell me about a time you exceeded expectations.", "category": "performance"},
                {"type": "technical", "question": "What questions do you have about this role or company?", "category": "engagement"},
                {"type": "situational", "question": "How do you handle tight deadlines and pressure?", "category": "stress-management"},
                {"type": "behavioral", "question": "Describe a situation where you had to learn something new quickly.", "category": "learning"},
                {"type": "technical", "question": "What interests you most about working in this industry?", "category": "industry-knowledge"}
            ]