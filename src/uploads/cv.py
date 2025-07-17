import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

def generate_cover_letter():
    print("\n🔹 Enter Job Details for Cover Letter:")
    job_title = input("Job Title: ")
    company_name = input("Company Name: ")
    job_description = input("Job Description: ")

    print("\n🔹 Enter Your Details:")
    full_name = input("Your Full Name: ")
    email = input("Your Email: ")
    phone = input("Your Phone Number: ")
    linkedIn = input("Your LinkedIn Profile (or leave blank): ")
    skills = input("Your Skills (comma-separated): ")

    prompt = f"""
    Write a professional and engaging cover letter tailored for the following job:
    
    Job Title: {job_title}
    Company: {company_name}
    Job Description: {job_description}
    
    Applicant Details:
    Name: {full_name}
    Email: {email}
    Phone: {phone}
    LinkedIn: {linkedIn}
    Skills: {skills}
    
    Generate a well-structured cover letter that includes an introduction, skills alignment, and closing statement.
    """

    print("\n🔹 Generating Cover Letter... Please wait...\n")

    try:
        # Load the locally saved model and tokenizer
        model_name = "./trained_mistral"  # Path to saved model
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).to("cuda")
        output = model.generate(**inputs, max_length=1024, num_return_sequences=1)
        cover_letter = tokenizer.decode(output[0], skip_special_tokens=True)

        print("\n📜 **Generated Cover Letter:**\n")
        print(cover_letter)

    except Exception as e:
        print("\n❌ Error: Failed to generate cover letter.")
        print(str(e))

# Run the function
generate_cover_letter()
