// Quiz Questions by Stream
const quizQuestions = {
    science: [
        {
            question: "What motivates you most in your studies?",
            options: [
                { text: "Solving complex problems", weights: { science: 3, research: 80, practical: 60 } },
                { text: "Discovering new knowledge", weights: { science: 3, research: 90, practical: 40 } },
                { text: "Helping people directly", weights: { medical: 3, research: 50, practical: 90 } },
                { text: "Creating innovative solutions", weights: { science: 3, research: 70, practical: 80 } }
            ]
        },
        {
            question: "Which subject interests you most?",
            options: [
                { text: "Mathematics & Physics", weights: { science: 3, engineering: 2, research: 80 } },
                { text: "Biology & Chemistry", weights: { medical: 3, research: 70, practical: 70 } },
                { text: "Computer Science", weights: { engineering: 3, science: 2, practical: 80 } },
                { text: "Environmental Science", weights: { science: 2, research: 80, practical: 60 } }
            ]
        },
        {
            question: "What's your ideal career path?",
            options: [
                { text: "Technology Industry", weights: { engineering: 3, science: 2, practical: 90 } },
                { text: "Healthcare Sector", weights: { medical: 3, practical: 90 } },
                { text: "Research & Development", weights: { science: 3, research: 95 } },
                { text: "Teaching & Academia", weights: { science: 2, research: 70 } }
            ]
        },
        {
            question: "How do you prefer to work?",
            options: [
                { text: "In a laboratory", weights: { science: 3, medical: 2, research: 85 } },
                { text: "At a computer", weights: { engineering: 3, practical: 80 } },
                { text: "With patients/people", weights: { medical: 3, practical: 95 } },
                { text: "In the field", weights: { science: 2, research: 70, practical: 75 } }
            ]
        },
        {
            question: "What's your budget preference for education?",
            options: [
                { text: "Budget-friendly (Under ₹5 LPA)", weights: { budget: 'low' } },
                { text: "Moderate (₹5-10 LPA)", weights: { budget: 'medium' } },
                { text: "Premium (Above ₹10 LPA)", weights: { budget: 'high' } },
                { text: "Flexible based on quality", weights: { budget: 'medium' } }
            ]
        },
        {
            question: "What achievement would make you proudest?",
            options: [
                { text: "Developing breakthrough technology", weights: { engineering: 3, research: 90 } },
                { text: "Saving lives", weights: { medical: 3, practical: 95 } },
                { text: "Publishing groundbreaking research", weights: { science: 3, research: 95 } },
                { text: "Teaching future generations", weights: { science: 2, research: 60 } }
            ]
        },
        {
            question: "How important is hands-on practical work to you?",
            options: [
                { text: "Extremely important - I learn by doing", weights: { practical: 95, research: 50 } },
                { text: "Important but theory matters too", weights: { practical: 75, research: 70 } },
                { text: "I prefer theoretical understanding", weights: { practical: 40, research: 90 } },
                { text: "Balanced approach works best", weights: { practical: 70, research: 70 } }
            ]
        }
    ],
    commerce: [
        {
            question: "What aspect of business excites you most?",
            options: [
                { text: "Financial management", weights: { commerce: 3, research: 60, practical: 80 } },
                { text: "Marketing strategies", weights: { commerce: 3, practical: 85 } },
                { text: "Entrepreneurship", weights: { commerce: 3, practical: 95 } },
                { text: "Corporate law", weights: { law: 3, research: 70 } }
            ]
        },
        {
            question: "Which skill do you want to develop?",
            options: [
                { text: "Financial analysis", weights: { commerce: 3, research: 75 } },
                { text: "Leadership & management", weights: { commerce: 3, practical: 90 } },
                { text: "Negotiation & advocacy", weights: { law: 2, commerce: 2, practical: 85 } },
                { text: "Legal reasoning", weights: { law: 3, research: 80 } }
            ]
        },
        {
            question: "What's your career goal?",
            options: [
                { text: "Corporate executive", weights: { commerce: 3, practical: 90 } },
                { text: "Entrepreneur", weights: { commerce: 3, practical: 95 } },
                { text: "Lawyer/Legal professional", weights: { law: 3, research: 75 } },
                { text: "Business consultant", weights: { commerce: 3, research: 70, practical: 80 } }
            ]
        },
        {
            question: "Which subject interests you more?",
            options: [
                { text: "Economics & Finance", weights: { commerce: 3, research: 70 } },
                { text: "Accounting & Taxation", weights: { commerce: 3, practical: 80 } },
                { text: "Law & Regulations", weights: { law: 3, research: 75 } },
                { text: "Business Studies", weights: { commerce: 3, practical: 85 } }
            ]
        },
        {
            question: "What's your budget preference for education?",
            options: [
                { text: "Budget-friendly (Under ₹5 LPA)", weights: { budget: 'low' } },
                { text: "Moderate (₹5-10 LPA)", weights: { budget: 'medium' } },
                { text: "Premium (Above ₹10 LPA)", weights: { budget: 'high' } },
                { text: "Flexible based on quality", weights: { budget: 'medium' } }
            ]
        },
        {
            question: "How do you make decisions?",
            options: [
                { text: "Data-driven analysis", weights: { commerce: 3, research: 85 } },
                { text: "Intuition and experience", weights: { commerce: 2, practical: 85 } },
                { text: "Legal frameworks & precedents", weights: { law: 3, research: 80 } },
                { text: "Risk-reward assessment", weights: { commerce: 3, practical: 80 } }
            ]
        },
        {
            question: "What work environment appeals to you?",
            options: [
                { text: "Corporate office setting", weights: { commerce: 3, practical: 85 } },
                { text: "Courtroom & legal chambers", weights: { law: 3, practical: 90 } },
                { text: "Startup & dynamic environment", weights: { commerce: 3, practical: 95 } },
                { text: "Research & think tanks", weights: { commerce: 2, research: 85 } }
            ]
        }
    ],
    arts: [
        {
            question: "What form of expression appeals to you?",
            options: [
                { text: "Visual arts & design", weights: { design: 3, practical: 90 } },
                { text: "Writing & literature", weights: { arts: 2, research: 75 } },
                { text: "Performance & multimedia", weights: { design: 2, practical: 85 } },
                { text: "Critical analysis & debate", weights: { law: 3, research: 80 } }
            ]
        },
        {
            question: "Which career path interests you?",
            options: [
                { text: "Designer (Fashion/Interior/Graphic)", weights: { design: 3, practical: 95 } },
                { text: "Legal professional", weights: { law: 3, research: 75 } },
                { text: "Artist or Creative director", weights: { design: 3, practical: 90 } },
                { text: "Writer or Content creator", weights: { arts: 3, practical: 80 } }
            ]
        },
        {
            question: "What's your strength?",
            options: [
                { text: "Creativity & innovation", weights: { design: 3, practical: 90 } },
                { text: "Analytical thinking", weights: { law: 3, research: 85 } },
                { text: "Communication & presentation", weights: { design: 2, law: 2, practical: 85 } },
                { text: "Problem-solving", weights: { law: 3, research: 80 } }
            ]
        },
        {
            question: "Which subject do you enjoy most?",
            options: [
                { text: "Art & Design", weights: { design: 3, practical: 90 } },
                { text: "History, Politics & Law", weights: { law: 3, research: 75 } },
                { text: "Literature & Languages", weights: { arts: 3, research: 70 } },
                { text: "Philosophy & Ethics", weights: { law: 2, research: 80 } }
            ]
        },
        {
            question: "What's your budget preference for education?",
            options: [
                { text: "Budget-friendly (Under ₹5 LPA)", weights: { budget: 'low' } },
                { text: "Moderate (₹5-10 LPA)", weights: { budget: 'medium' } },
                { text: "Premium (Above ₹10 LPA)", weights: { budget: 'high' } },
                { text: "Flexible based on quality", weights: { budget: 'medium' } }
            ]
        },
        {
            question: "How do you want to impact society?",
            options: [
                { text: "Through creative work & design", weights: { design: 3, practical: 90 } },
                { text: "Through justice & legal system", weights: { law: 3, research: 80, practical: 85 } },
                { text: "Through cultural influence", weights: { design: 2, practical: 85 } },
                { text: "Through advocacy & awareness", weights: { law: 2, practical: 80 } }
            ]
        },
        {
            question: "What work environment suits you best?",
            options: [
                { text: "Creative studio & workshops", weights: { design: 3, practical: 95 } },
                { text: "Legal firms & courtrooms", weights: { law: 3, practical: 90 } },
                { text: "Freelance & independent", weights: { design: 2, practical: 85 } },
                { text: "Academic & research institutions", weights: { arts: 2, research: 85 } }
            ]
        }
    ],
    engineering: [
        {
            question: "What type of problems do you enjoy solving?",
            options: [
                { text: "Technical challenges & debugging", weights: { engineering: 3, practical: 90 } },
                { text: "Design & architecture problems", weights: { engineering: 3, practical: 85, research: 70 } },
                { text: "System optimization", weights: { engineering: 3, research: 80 } },
                { text: "Innovation & new technology", weights: { engineering: 3, research: 85, practical: 85 } }
            ]
        },
        {
            question: "Which engineering field interests you?",
            options: [
                { text: "Software/Computer Science", weights: { engineering: 3, practical: 90 } },
                { text: "Mechanical/Civil/Core", weights: { engineering: 2, practical: 85 } },
                { text: "Electronics & Communication", weights: { engineering: 2, practical: 80 } },
                { text: "AI/ML/Data Science", weights: { engineering: 3, research: 85 } }
            ]
        },
        {
            question: "What's your learning style?",
            options: [
                { text: "Hands-on projects & coding", weights: { engineering: 3, practical: 95 } },
                { text: "Theoretical concepts first", weights: { engineering: 2, research: 85 } },
                { text: "Team collaborations", weights: { engineering: 3, practical: 85 } },
                { text: "Independent research", weights: { engineering: 2, research: 90 } }
            ]
        },
        {
            question: "Where do you see yourself working?",
            options: [
                { text: "Tech companies (Google, Microsoft)", weights: { engineering: 3, practical: 90 } },
                { text: "Manufacturing & core industries", weights: { engineering: 2, practical: 85 } },
                { text: "Startups & product companies", weights: { engineering: 3, practical: 95 } },
                { text: "Research labs & academia", weights: { engineering: 2, research: 90 } }
            ]
        },
        {
            question: "What's your budget preference for education?",
            options: [
                { text: "Budget-friendly (Under ₹5 LPA)", weights: { budget: 'low' } },
                { text: "Moderate (₹5-10 LPA)", weights: { budget: 'medium' } },
                { text: "Premium (Above ₹10 LPA)", weights: { budget: 'high' } },
                { text: "Flexible based on quality", weights: { budget: 'medium' } }
            ]
        },
        {
            question: "What drives your interest in engineering?",
            options: [
                { text: "Building innovative solutions", weights: { engineering: 3, practical: 95 } },
                { text: "Understanding how things work", weights: { engineering: 2, research: 85 } },
                { text: "Creating real-world impact", weights: { engineering: 3, practical: 90 } },
                { text: "Career opportunities & growth", weights: { engineering: 3, practical: 85 } }
            ]
        },
        {
            question: "How important is cutting-edge research to you?",
            options: [
                { text: "Very important - I want to innovate", weights: { engineering: 3, research: 95 } },
                { text: "Somewhat important", weights: { engineering: 2, research: 70 } },
                { text: "Not very - I prefer application", weights: { engineering: 3, practical: 95 } },
                { text: "Balanced approach", weights: { engineering: 3, research: 75, practical: 75 } }
            ]
        }
    ]
};

// Quiz State
let currentStream = '';
let currentQuestionIndex = 0;
let answers = [];
let scores = {};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    resetQuiz();
});

function resetQuiz() {
    currentStream = '';
    currentQuestionIndex = 0;
    answers = [];
    scores = {};
    document.getElementById('streamStep').classList.add('active');
    document.getElementById('questionsStep').classList.remove('active');
    document.getElementById('studentInfoStep').classList.remove('active');
    document.getElementById('progressBar').style.width = '0%';
}

function selectStream(stream) {
    currentStream = stream;
    document.getElementById('streamStep').classList.remove('active');
    document.getElementById('questionsStep').classList.add('active');
    loadQuestion();
    updateProgress();
}

function loadQuestion() {
    const questions = quizQuestions[currentStream];
    const question = questions[currentQuestionIndex];
    
    const container = document.getElementById('questionContainer');
    container.innerHTML = `
        <div class="question-title">Question ${currentQuestionIndex + 1} of ${questions.length}</div>
        <div class="question-title" style="font-size: 24px; margin-top: 20px; font-weight: 600;">${question.question}</div>
        <div class="options-grid" style="margin-top: 40px;">
            ${question.options.map((option, index) => `
                <div class="option-card" onclick="selectAnswer(${index})">
                    ${option.text}
                </div>
            `).join('')}
        </div>
    `;
    
    // Update navigation buttons
    document.getElementById('prevBtn').style.display = currentQuestionIndex > 0 ? 'block' : 'none';
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    document.getElementById('nextBtn').textContent = isLastQuestion ? 'Continue' : 'Next';
    document.getElementById('nextBtn').innerHTML = isLastQuestion ? 
        'Continue <i class="fas fa-arrow-right"></i>' : 
        'Next <i class="fas fa-arrow-right"></i>';
    document.getElementById('nextBtn').disabled = true;
    
    // Restore previous selection
    if (answers[currentQuestionIndex] !== undefined) {
        setTimeout(() => {
            const cards = document.querySelectorAll('.option-card');
            if (cards[answers[currentQuestionIndex]]) {
                cards[answers[currentQuestionIndex]].classList.add('selected');
                document.getElementById('nextBtn').disabled = false;
            }
        }, 50);
    }
}

function selectAnswer(optionIndex) {
    document.querySelectorAll('.option-card').forEach((card, index) => {
        if (index === optionIndex) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    answers[currentQuestionIndex] = optionIndex;
    document.getElementById('nextBtn').disabled = false;
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
        updateProgress();
    }
}

function nextQuestion() {
    const questions = quizQuestions[currentStream];
    
    // Save answer weights
    const selectedOption = questions[currentQuestionIndex].options[answers[currentQuestionIndex]];
    
    // Accumulate weights
    for (const [key, value] of Object.entries(selectedOption.weights)) {
        if (!scores[key]) scores[key] = 0;
        if (typeof value === 'number') {
            scores[key] += value;
        } else {
            scores[key] = value; // For budget
        }
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        updateProgress();
    } else {
        // Show student info form
        document.getElementById('questionsStep').classList.remove('active');
        document.getElementById('studentInfoStep').classList.add('active');
        updateProgress();
    }
}

function updateProgress() {
    const questions = quizQuestions[currentStream];
    const totalSteps = questions.length + 2; // questions + stream + info
    const currentStep = currentQuestionIndex + 2; // +1 for stream, +1 for current
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Handle student info form submission
document.getElementById('studentInfoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentInfo = {
        name: document.getElementById('studentName').value,
        phone: document.getElementById('studentPhone').value,
        email: document.getElementById('studentEmail').value,
        city: document.getElementById('studentCity').value
    };
    
    // Show loading
    document.getElementById('studentInfoStep').classList.remove('active');
    document.getElementById('loadingStep').classList.add('active');
    
    // Prepare quiz data
    const quizData = {
        stream: currentStream,
        answers: answers.map((answerIndex, questionIndex) => ({
            question: quizQuestions[currentStream][questionIndex].question,
            answer: quizQuestions[currentStream][questionIndex].options[answerIndex].text,
            weights: quizQuestions[currentStream][questionIndex].options[answerIndex].weights,
            score: 3 // Each answer gets 3 points
        })),
        studentInfo: studentInfo
    };
    
    try {
        // Submit quiz to backend
        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Save results to localStorage
            localStorage.setItem('quizResults', JSON.stringify({
                quizScore: result.quizScore,
                recommendations: result.recommendations,
                studentInfo: studentInfo,
                stream: currentStream
            }));
            
            // Create lead with recommendations
            if (result.recommendations.length > 0) {
                await fetch('/api/leads/quiz', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentName: studentInfo.name,
                        email: studentInfo.email,
                        phone: studentInfo.phone,
                        city: studentInfo.city,
                        stream: currentStream,
                        quizScore: result.quizScore,
                        recommendedUniversities: result.recommendations.map(r => ({
                            universityId: r.id,
                            matchPercentage: r.matchPercentage
                        }))
                    })
                });
            }
            
            // Redirect to results page
            window.location.href = '/quiz-results';
        } else {
            alert('Error processing quiz results. Please try again.');
            document.getElementById('loadingStep').classList.remove('active');
            document.getElementById('studentInfoStep').classList.add('active');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting quiz. Please try again.');
        document.getElementById('loadingStep').classList.remove('active');
        document.getElementById('studentInfoStep').classList.add('active');
    }
});
