import torch
import pandas as pd
from transformers import AutoModelForCausalLM, AutoTokenizer

def load_model():
    """Load the locally stored pretrained Mistral model."""
    MODEL_PATH = "./trained_mistral_full"
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, trust_remote_code=True)
    
    if tokenizer.pad_token is None:
        tokenizer.add_special_tokens({'pad_token': '[PAD]'})
    
    model = AutoModelForCausalLM.from_pretrained(MODEL_PATH, trust_remote_code=True, torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32).to(device)
    model.eval()  # Set model to evaluation mode
    return tokenizer, model, device

def get_roadmap_from_excel(career):
    """Check if career roadmap exists in an Excel file."""
    try:
        df = pd.read_excel("CAREEARR_ROADMAPS.xlsx")
        roadmap = df[df['Career'].str.lower() == career.lower()]['Roadmap'].values
        return roadmap[0] if len(roadmap) > 0 else None
    except Exception:
        return None

def generate_ai_roadmap(career, skills, industry, education, learning_style):
    """Generates a career roadmap using a local AI model."""
    try:
        tokenizer, model, device = load_model()
        input_text = (
            f"Generate a career roadmap for a '{career.strip().title()}' in the '{industry.strip().title()}' industry.\n"
            f"Consider current skills: {skills}. Education: {education}. Preferred learning style: {learning_style}.\n"
            f"Provide structured steps including skills to learn, certifications, job roles, and networking tips."
        )
        inputs = tokenizer(input_text, return_tensors="pt", truncation=True, padding=True, max_length=512).to(device)
        with torch.no_grad():
            output_ids = model.generate(**inputs, max_new_tokens=500, do_sample=True, temperature=0.7, top_p=0.9)
        roadmap_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
        return roadmap_text
    except Exception as e:
        return f"Error generating roadmap: {str(e)}"

def main():
    career = input("Enter your career goal (e.g., Data Scientist, Web Developer): ").strip()
    skills = input("Enter skills you have (comma-separated): ").strip()
    industry = input("Preferred industry (e.g., Tech, Finance): ").strip()
    education = input("Your education level & certifications: ").strip()
    learning_style = input("Preferred learning style (Videos, Books, Hands-on, Online Courses): ").strip()
    
    roadmap = get_roadmap_from_excel(career)
    if roadmap:
        print("Career roadmap found in database:")
    else:
        print("Generating roadmap using AI model...")
        roadmap = generate_ai_roadmap(career, skills, industry, education, learning_style)
    
    print("\n📍 Your Personalized Career Roadmap:\n")
    print(roadmap)

if __name__ == "__main__":
    main()
