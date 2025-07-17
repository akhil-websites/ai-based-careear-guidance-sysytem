# server.py
import traceback
import os
import shutil

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chatbot  # Import chatbot logic
import quiz  # Import quiz logic
import careearcomparison  # Import the logic from careearcomparison.py
import careearroadmap  # Import AI-based roadmap generator
from resume import process_resume  # Importing the resume processing function




app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend URLs for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class ChatRequest(BaseModel):
    message: str

class QuizRequest(BaseModel):
    category: str

class SubmitQuizRequest(BaseModel):
    category: str
    answers: dict

class CareerComparisonRequest(BaseModel):
    career1: str
    career2: str
    industry: str
    experience: str

# Request model for roadmap generation
class RoadmapRequest(BaseModel):
    career: str
    skills: str
    industry: str
    education: str
    learning_style: str


@app.post("/chat")
async def chat(request: ChatRequest):
    response_text = chatbot.get_chat_response(request.message)
    return {"response": response_text}

@app.get("/get_quiz")
async def get_quiz(category: str):
    questions = quiz.get_quiz_questions(category)
    return {"questions": questions}

@app.post("/submit_quiz")
async def submit_quiz(request: SubmitQuizRequest):
    result = quiz.evaluate_quiz(request.category, request.answers)
    return result

@app.post("/compare_careers")
async def compare_careers(request: CareerComparisonRequest):
    try:
        # Call the function from careearcomparison.py
        comparison_result = careearcomparison.compare_careers(
            request.career1, request.career2, request.industry, request.experience
        )
        return {"comparison": comparison_result}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.post("/generate_roadmap")
async def generate_roadmap(request: RoadmapRequest):
    try:
        roadmap = careearroadmap.get_roadmap_from_excel(request.career)
        if roadmap:
            return {"roadmap": roadmap}
        
        roadmap = careearroadmap.generate_ai_roadmap(
            request.career, request.skills, request.industry, request.education, request.learning_style
        )
        return {"roadmap": roadmap}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Handles resume upload, saves it temporarily, and processes it."""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the resume
        resume_data = process_resume(file_path)

        os.remove(file_path)  # Clean up after processing
        
        return resume_data
    except Exception as e:
        print("❌ Error processing resume:", str(e))
        print(traceback.format_exc())  # Print full error traceback
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
