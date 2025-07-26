# app/services/llm_grader.py
import json
import re
from typing import Dict, Any
from groq import Groq
import openai  # or your preferred LLM client
from app.core.config import settings


class LLMGrader:

    @staticmethod
    def _llm_extract(prompt: str) -> Dict[str, Any]:
        client = Groq(api_key=settings.chatgroq_api_key)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
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
            raise Exception(
                f"Failed to parse JSON from LLM output:\nPrompt:\n{prompt}\n\nLLM Output:\n{response.choices[0].message.content}"
            )

    @staticmethod
    async def grade_qa_answer(
        question: str, user_answer: str, context: str , difficulty: str 
    ) -> Dict[str, Any]:
        """
        Grade a Q/A answer using LLM

        Args:
            question: The original question
            user_answer: User's answer to grade
            context: Additional context (resume data, job description)
            difficulty: Question difficulty level

        Returns:
            Dict containing score, feedback, and correctness level
        """

        prompt = f"""
                    You are conducting a live interview and have just asked the candidate a question. Now you need to evaluate their response and provide direct feedback as if you're speaking to them face-to-face.

                    **My Question:** {question}

                    **Your Answer:** {user_answer}

                    **Context:** {context if context else 'No additional context provided'}

                    **Difficulty Level:** {difficulty}

                    As the interviewer, evaluate the candidate's answer based on:
                    1. Accuracy and correctness
                    2. Completeness of the response
                    3. Clarity and communication
                    4. Relevance to the question
                    5. Technical depth (if applicable)

                    Provide your evaluation in the following JSON format, speaking directly to the candidate:
                    {{
                        "score": <integer between 0-100>,
                        "correctness_level": "<excellent|good|average|poor>",
                        "feedback": "<direct feedback as if speaking to the candidate, using 'you' and 'your'>",
                        "strengths": ["<what you did well - direct praise>", "<another strength>", "<third strength>"],
                        "improvements": ["<what you should work on - direct advice>", "<another improvement area>", "<third improvement area>"]
                    }}

                    Examples of feedback tone:
                    - "Your answer demonstrates a solid understanding of..."
                    - "I appreciate how you structured your response..."
                    - "You could improve by providing more specific examples..."
                    - "While your explanation is correct, I'd like to see you dive deeper into..."

                    Make sure your response is valid JSON only, no additional text.
                    """
        try:
            return LLMGrader._llm_extract(prompt)

        except Exception as e:
            # Fallback response if LLM fails
            return {
                "score": 50,
                "correctness_level": "average",
                "feedback": f"Unable to grade automatically. Please review manually. Error: {str(e)}",
                "strengths": [],
                "improvements": ["Answer could not be automatically evaluated"],
            }
