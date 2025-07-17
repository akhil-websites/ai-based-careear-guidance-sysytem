
# quiz.py
import random

quiz_data = {
    "Python": [
        {"id": 1, "question": "What is the output of print(2 ** 3)?", "options": ["6", "8", "9", "4"], "answer": "8", "explanation": "2 raised to the power of 3 equals 8."},
        {"id": 2, "question": "Which keyword is used to create a function in Python?", "options": ["fun", "define", "def", "function"], "answer": "def", "explanation": "In Python, 'def' is used to define a function."},
        {"id": 3, "question": "What data type is returned by the input() function?", "options": ["int", "float", "string", "bool"], "answer": "string", "explanation": "The input() function always returns a string."},
         {"id": 4, "question": "Which of these is an immutable data type?", "options": ["list", "dictionary", "set", "tuple"], "answer": "tuple", "explanation": "Tuples are immutable, meaning they cannot be modified after creation."},
        {"id": 5, "question": "What does the 'len()' function return?", "options": ["The number of elements", "The last element", "The data type", "The sum of elements"], "answer": "The number of elements", "explanation": "len() returns the count of elements in an iterable."},
        {"id": 6, "question": "How do you start a comment in Python?", "options": ["//", "/*", "#", "--"], "answer": "#", "explanation": "Python uses '#' for single-line comments."},
        {"id": 7, "question": "Which module is used for working with regular expressions in Python?", "options": ["regex", "re", "regexp", "match"], "answer": "re", "explanation": "The 're' module in Python provides support for regular expressions."},
        {"id": 8, "question": "What does the 'break' statement do in a loop?", "options": ["Skips an iteration", "Exits the loop", "Repeats the loop", "Does nothing"], "answer": "Exits the loop", "explanation": "'break' is used to terminate a loop prematurely."},
        {"id": 9, "question": "What is the correct syntax for a list comprehension?", "options": ["[x for x in range(5)]", "{x for x in range(5)}", "(x for x in range(5))", "<x for x in range(5)>"], "answer": "[x for x in range(5)]", "explanation": "List comprehensions use square brackets."},
        {"id": 10, "question": "Which of these is a valid variable name?", "options": ["2var", "_var", "var-name", "var name"], "answer": "_var", "explanation": "Variable names cannot start with a number or contain spaces or hyphens."},
        {"id": 11, "question": "Which function is used to open a file in Python?", "options": ["open()", "file()", "read()", "write()"], "answer": "open()", "explanation": "The open() function is used to open files in Python."}
    ],
    "Data Science": [
        {"id": 1, "question": "What does 'NaN' stand for?", "options": ["New Age Number", "Not a Number", "Next Another Number", "No Algorithm Needed"], "answer": "Not a Number", "explanation": "NaN stands for 'Not a Number' and is commonly used in data processing."},
        {"id": 2, "question": "Which library is commonly used for data manipulation?", "options": ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"], "answer": "Pandas", "explanation": "Pandas is a popular library for data manipulation in Python."},
         {"id": 3, "question": "What is the main purpose of NumPy?", "options": ["Data visualization", "Array computing", "Web development", "Database management"], "answer": "Array computing", "explanation": "NumPy is primarily used for numerical computations on arrays."},
        {"id": 4, "question": "Which of these is a supervised learning algorithm?", "options": ["K-Means", "PCA", "Decision Tree", "Apriori"], "answer": "Decision Tree", "explanation": "Decision Trees are supervised learning algorithms used for classification and regression."},
        {"id": 5, "question": "Which Python library is used for data visualization?", "options": ["TensorFlow", "Matplotlib", "Scikit-learn", "BeautifulSoup"], "answer": "Matplotlib", "explanation": "Matplotlib is a widely used library for plotting graphs in Python."},
        {"id": 6, "question": "What is the purpose of feature scaling?", "options": ["Increase accuracy", "Normalize data", "Reduce overfitting", "Improve speed"], "answer": "Normalize data", "explanation": "Feature scaling is used to standardize data for better performance in machine learning models."},
        {"id": 7, "question": "Which of the following is an unsupervised learning technique?", "options": ["Linear Regression", "K-Means Clustering", "Decision Tree", "Random Forest"], "answer": "K-Means Clustering", "explanation": "K-Means is used for clustering, which is an unsupervised learning technique."},
        {"id": 8, "question": "Which Python library is used for deep learning?", "options": ["Pandas", "Scikit-learn", "TensorFlow", "Matplotlib"], "answer": "TensorFlow", "explanation": "TensorFlow is widely used for deep learning applications."},
        {"id": 9, "question": "What does 'overfitting' mean in machine learning?", "options": ["Model is too simple", "Model is too complex and memorizes training data", "Model generalizes well", "Model does not train"], "answer": "Model is too complex and memorizes training data", "explanation": "Overfitting occurs when a model learns noise in the training data instead of generalizing well."},
        {"id": 10, "question": "Which metric is commonly used for evaluating classification models?", "options": ["Mean Squared Error", "Accuracy", "R-Squared", "Silhouette Score"], "answer": "Accuracy", "explanation": "Accuracy is one of the most common evaluation metrics for classification models."},
        {"id": 11, "question": "Which library is used for natural language processing in Python?", "options": ["Pandas", "NLTK", "Seaborn", "OpenCV"], "answer": "NLTK", "explanation": "NLTK is a popular library for natural language processing (NLP)."}
    ]
}

def get_quiz_questions(category):
    return random.sample(quiz_data.get(category, []), min(len(quiz_data.get(category, [])), 10))

def evaluate_quiz(category, user_answers):
    questions = quiz_data.get(category, [])
    score = 0
    results = []
    
    for q in questions:
        is_correct = str(user_answers.get(str(q["id"]))) == q["answer"]
        if is_correct:
            score += 1
        results.append({
            "question": q["question"],
            "correct_answer": q["answer"],
            "user_answer": user_answers.get(str(q["id"]), ""),
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })
    
    return {"score": score, "total": len(questions), "results": results}
