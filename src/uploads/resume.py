import pdfplumber
import spacy
from flashtext import KeywordProcessor
import re
import os

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# Define job-related keywords and criteria
REQUIRED_SKILLS = {"Python", "Machine Learning", "SQL", "Data Science", "AWS"}
MIN_EXPERIENCE_YEARS = 2
RELEVANT_DEGREES = {"Bachelor", "Master", "PhD"}

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Step 1: Extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted_text = page.extract_text()
                if extracted_text:
                    text += extracted_text + "\n"
        print("\n🔹 Extracted Resume Text:\n", text[:500])  # Debug: Print first 500 chars
        return text.strip()
    except Exception as e:
        print(f"❌ Error extracting text from PDF: {e}")
        return ""

# ✅ Step 2: Extract Personal Information
def extract_personal_info(text):
    doc = nlp(text)
    personal_info = {}
    
    email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
    phone_pattern = r"\+?\d{1,3}[-.\s]?\d{10}"
    linkedin_pattern = r"https?://(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+"

    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    linkedin_profiles = re.findall(linkedin_pattern, text)

    personal_info["Full Name"] = None
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            personal_info["Full Name"] = ent.text
            break

    personal_info["Email"] = emails[0] if emails else None
    personal_info["Phone"] = phones[0] if phones else None
    personal_info["LinkedIn"] = linkedin_profiles[0] if linkedin_profiles else None

    print("\n🔹 Extracted Personal Info:", personal_info)  # Debug
    return personal_info

# ✅ Step 3: Extract Skills
def extract_skills(text):
    skills = [# Programming & Software Development
    "Python", "Java", "C", "C++", "JavaScript", "TypeScript", "Go", "Ruby", "Swift", 
    "Kotlin", "Rust", "Dart", "Perl", "Scala", "HTML", "CSS", "SQL", "NoSQL",
    
    # Web Development
    "ReactJS", "Node.js", "Express.js", "Angular", "Vue.js", "Next.js", "Svelte", 
    "Django", "Flask", "Spring Boot", "ASP.NET", "WordPress", "Bootstrap", 
    "Tailwind CSS", "GraphQL", "REST API", "WebSockets",
    
    # Mobile App Development
    "Android Development", "iOS Development", "Flutter", "React Native", "SwiftUI",
    
    # Data Science & AI
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "Data Science", 
    "Data Analysis", "Data Visualization", "Natural Language Processing (NLP)", 
    "Computer Vision", "Reinforcement Learning", "Big Data", "Hadoop", "Spark", 
    "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "Matplotlib", "Seaborn", 
    "Power BI", "Tableau", "Google Data Studio",
    
    # Cloud Computing & DevOps
    "AWS", "Azure", "Google Cloud Platform (GCP)", "Docker", "Kubernetes", "Terraform",
    "Ansible", "Jenkins", "CI/CD", "Serverless Computing", "Cloud Security",
    
    # Cybersecurity
    "Penetration Testing", "Ethical Hacking", "Network Security", "Cryptography", 
    "Firewalls", "Intrusion Detection Systems (IDS)", "Incident Response", "Blockchain Security",
    
    # Blockchain & Web3
    "Blockchain Development", "Ethereum", "Solidity", "Smart Contracts", "NFTs",
    "Hyperledger", "Decentralized Applications (DApps)",
    
    # Internet of Things (IoT)
    "IoT Development", "Embedded Systems", "Arduino", "Raspberry Pi", "Edge Computing",
    
    # Networking & System Administration
    "Linux", "Windows Server", "Networking", "TCP/IP", "DNS", "Load Balancing",
    "Active Directory", "System Administration",
    
    # Database Management
    "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Oracle Database", "Redis", 
    "Elasticsearch", "Cassandra",
    
    # Software Testing
    "Automation Testing", "Selenium", "JUnit", "Postman", "API Testing", "Performance Testing",
    
    # Game Development
    "Unity", "Unreal Engine", "Game Physics", "C# Game Development", "3D Modeling",
    
    # Business & Management
    "Project Management", "Scrum", "Agile Methodologies", "Lean Management", "Business Analysis",
    
    # Soft Skills
    "Leadership", "Communication", "Problem-Solving", "Critical Thinking", "Creativity",
    "Public Speaking", "Teamwork", "Time Management", "Emotional Intelligence",
    "Adaptability", "Conflict Resolution"]
    kp = KeywordProcessor()
    for skill in skills:
        kp.add_keyword(skill)
    extracted_skills = list(set(kp.extract_keywords(text)))

    print("\n🔹 Extracted Skills:", extracted_skills)  # Debug
    return extracted_skills

# ✅ Step 4: Extract Certifications
def extract_certifications(text):
    certification_keywords = ["Certification", "Certified", "Certificate", "Course", "Training", "Diploma", 
    "Accredited", "Professional Certificate", "Credential", "Specialization", 
    "Bootcamp", "Nanodegree", "License", "Exam", "Badge", "Workshop", "Program", 
    "Advanced Certification", "Fundamentals", "Masterclass", "Skill Badge", 
    "Completion Certificate", "Verified Certificate", "Achievement", "Qualification", 
    "Endorsement", "Proficiency", "Assessment"]
    certifications = [line.strip() for line in text.split("\n") if any(keyword in line for keyword in certification_keywords)]

    print("\n🔹 Extracted Certifications:", certifications)  # Debug
    return certifications

# ✅ Step 5: Extract Latest Education
def extract_latest_education(text):
    education_keywords = [
    # Common Degree Titles
    "Bachelor", "Master", "PhD", "Doctorate", "Degree", "Diploma", "Associate", 
    "Undergraduate", "Postgraduate", "Graduate", "Certificate", 
    
    # Engineering & Technology Degrees
    "B.Tech", "M.Tech", "BE", "ME", "BSc", "MSc", "BS", "MS", "BCA", "MCA", 
    "BBA", "MBA", "B.Com", "M.Com", "B.Arch", "M.Arch",
    
    # Medical & Healthcare Degrees
    "MBBS", "BDS", "BPT", "MPT", "B.Pharm", "M.Pharm", "MD", "DO", "DPT",
    
    # Arts, Humanities & Social Sciences
    "BA", "MA", "BFA", "MFA", "BSW", "MSW", 
    
    # Law & Other Professional Degrees
    "LLB", "LLM", "JD", "EdD", "DPhil",
    
    # Vocational & Technical
    "Polytechnic", "Trade Certificate", "Vocational Training", "Apprenticeship", 
    
    # International & Alternative Names
    "High School Diploma", "GED", "HND", "HNC", "IB Diploma"

]
    for line in reversed(text.split("\n")):
        if any(keyword in line for keyword in education_keywords):
            print("\n🔹 Extracted Education:", line.strip())  # Debug
            return line.strip()
    return None

# ✅ Step 6: Extract Latest Job Experience
def extract_latest_experience(text):
    experience_keywords = ["Experience", "Worked at", "Job Title", "Intern at", "Company", "Employment", 
    "Position", "Role", "Professional Experience", "Work History", "Career", 
    "Internship", "Full-time", "Part-time", "Freelance", "Consultant", "Contract", 
    "Organization", "Industry", "Tenure", "Projects", "Responsibilities", "Duties", 
    "Achievements", "Accomplishments", "Job Description", "Workplace", "Previous Role",
    "Years of Experience", "Expertise", "Hands-on Experience", "Work Exposure"]
    for line in reversed(text.split("\n")):
        if any(keyword in line for keyword in experience_keywords):
            print("\n🔹 Extracted Experience:", line.strip())  # Debug
            return line.strip()
    return None

# ✅ Step 7: Extract Project Titles
def extract_project_titles(text):
    project_keywords = [ "Project", "Developed", "Built", "Designed", "Implemented", "Created", "Engineered", 
    "Executed", "Constructed", "Deployed", "Programmed", "Innovated", "Architected", 
    "Initiated", "Prototyped", "Integrated", "Refactored", "Optimized", "Enhanced", 
    "Led", "Managed", "Collaborated", "Researched", "Configured", "Contributed", 
    "Customized", "Spearheaded", "Automated", "Debugged", "Refined", "Launched"]
    projects = [line.strip() for line in text.split("\n") if any(keyword in line for keyword in project_keywords)]

    print("\n🔹 Extracted Projects:", projects[:3])  # Debug
    return projects[:3]  # Limit to 3 most recent projects

# ✅ Step 8: Calculate Resume Score
def calculate_resume_score(resume_data):
    score = 0
    
    # Skills match
    skills = set(resume_data.get("Skills", []))
    skill_match = len(REQUIRED_SKILLS.intersection(skills)) / len(REQUIRED_SKILLS) * 30  # 30% weight
    score += skill_match

    # Experience match
    experience = resume_data.get("Latest Experience", "")
    experience_years = sum(map(int, filter(str.isdigit, experience.split()))) if experience else 0
    experience_score = (experience_years / MIN_EXPERIENCE_YEARS) * 25 if experience_years >= MIN_EXPERIENCE_YEARS else 0
    score += min(experience_score, 25)  # 25% weight

    # Education match
    education = resume_data.get("Latest Education", "")
    education_score = any(degree in education for degree in RELEVANT_DEGREES) * 15  # 15% weight
    score += education_score

    # Certifications match
    certifications = resume_data.get("Certifications", [])
    certification_score = min(len(certifications) * 5, 15)  # 15% weight
    score += certification_score

    # Projects relevance
    projects = resume_data.get("Projects", [])
    project_score = min(len(projects) * 5, 15)  # 15% weight
    score += project_score

    final_score = min(score, 100)
    print("\n🔹 Final Resume Score:", final_score)  # Debug
    return final_score

# ✅ Step 9: Process Resume (Main Function)
def process_resume(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    if not text:
        return {"error": "Could not extract text from PDF"}

    personal_info = extract_personal_info(text)

    resume_data = {
        "Full Name": personal_info.get("Full Name", "N/A"),
        "Email": personal_info.get("Email", "N/A"),
        "Phone": personal_info.get("Phone", "N/A"),
        "LinkedIn": personal_info.get("LinkedIn", "N/A"),
        "Skills": extract_skills(text) or [],  # Ensure it's always a list
        "Certifications": extract_certifications(text) or [],  # Ensure list
        "Latest Education": extract_latest_education(text) or "",  # Ensure string
        "Latest Experience": extract_latest_experience(text) or "",  # Ensure string
        "Projects": extract_project_titles(text) or [],  # Ensure list
    }

    try:
        resume_data["AI Score"] = calculate_resume_score(resume_data)
    except Exception as e:
        print(f"❌ Error calculating resume score: {e}")
        resume_data["AI Score"] = 0  # Default score if error occurs

    print("\n✅ Final Extracted Resume Data:\n", resume_data)  # Debugging output
    return resume_data

