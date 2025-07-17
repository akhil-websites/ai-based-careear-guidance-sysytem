
# chatbot.py
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import pdfplumber
import docx
import json

# Set device to GPU if available
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load model with GPU support
MODEL_PATH = "./trained_mistral_full"
model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH, 
    torch_dtype=torch.float16,  
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

def get_chat_response(message: str) -> str:
    inputs = tokenizer(message, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_new_tokens=100)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Function to extract text from resume
def extract_text(file_path: str) -> str:
    text = ""
    try:
        if file_path.lower().endswith(".pdf"):
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    extracted_text = page.extract_text()
                    if extracted_text:
                        text += extracted_text + "\n"
        elif file_path.lower().endswith(".docx"):
            doc = docx.Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
        elif file_path.lower().endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as file:
                text = file.read()
        else:
            raise ValueError("Unsupported file format. Please use PDF, DOCX, or TXT.")
    except Exception as e:
        print(f"Error extracting text: {e}")
    return text.strip()

# Function to analyze resume using local AI model
def analyze_resume(resume_text: str, job_description: str) -> dict:
    if len(resume_text) < 100:
        return {"error": "Resume text is too short for proper analysis."}
    
    prompt = f"""
    Analyze the following resume and provide suggestions for improvement:
    
    Resume:
    {resume_text[:1500]}
    
    Job Description:
    {job_description}
    
    Provide:
    1. Keyword Match Score
    2. Missing Sections
    3. Grammar & Readability Analysis
    4. Suggested Resume Improvements
    """
    
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_new_tokens=300)
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"response": response_text}

# Function to save results to a JSON file
def save_results(analysis: dict, output_file: str = "resume_analysis.json"):
    try:
        with open(output_file, "w", encoding="utf-8") as file:
            json.dump(analysis, file, indent=4)
        print(f"Analysis saved to {output_file}")
    except Exception as e:
        print(f"Error saving results: {e}")
