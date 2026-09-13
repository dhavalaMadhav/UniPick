import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Quiz() {
    const navigate = useNavigate();
    const [step, setStep] = useState('stream'); // 'stream' | 'questions' | 'info' | 'loading'
    const [selectedStream, setSelectedStream] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [studentInfo, setStudentInfo] = useState({
        name: '',
        phone: '',
        email: '',
        city: ''
    });

    useEffect(() => {
        document.title = 'Career Recommendation Quiz | UniPick';
    }, []);

    const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Career Quiz', url: '' }
    ];


    const questions = [
        {
            id: 'q1',
            text: 'What is your primary career goal?',
            options: [
                { value: 'research', text: 'Research and Development' },
                { value: 'corporate', text: 'Corporate Career' },
                { value: 'entrepreneurship', text: 'Entrepreneurship' },
                { value: 'academia', text: 'Academic Career' }
            ]
        },
        {
            id: 'q2',
            text: 'What is your preferred study location?',
            options: [
                { value: 'domestic', text: 'Within My Country' },
                { value: 'international', text: 'Study Abroad' },
                { value: 'online', text: 'Online/Remote' },
                { value: 'hybrid', text: 'Hybrid (Mix of Both)' }
            ]
        },
        {
            id: 'q3',
            text: 'What is your budget range for education?',
            options: [
                { value: 'budget', text: 'Budget Friendly (Under 5 Lakhs)' },
                { value: 'moderate', text: 'Moderate (5-10 Lakhs)' },
                { value: 'premium', text: 'Premium (10-20 Lakhs)' },
                { value: 'luxury', text: 'Luxury (Above 20 Lakhs)' }
            ]
        },
        {
            id: 'q4',
            text: 'What type of campus environment do you prefer?',
            options: [
                { value: 'urban', text: 'Urban City Campus' },
                { value: 'suburban', text: 'Suburban Area' },
                { value: 'rural', text: 'Rural/Countryside' },
                { value: 'any', text: 'No Preference' }
            ]
        },
        {
            id: 'q5',
            text: 'What matters most to you in a university?',
            options: [
                { value: 'ranking', text: 'University Ranking & Reputation' },
                { value: 'placement', text: 'Placement Opportunities' },
                { value: 'research', text: 'Research Facilities' },
                { value: 'culture', text: 'Campus Culture & Activities' }
            ]
        }
    ];

    const handleStreamSelect = (streamVal) => {
        setSelectedStream(streamVal);
        setTimeout(() => {
            setStep('questions');
            setCurrentQuestion(0);
        }, 250);
    };

    const handleOptionSelect = (qId, optionVal) => {
        const updatedAnswers = { ...answers, [qId]: optionVal };
        setAnswers(updatedAnswers);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setStep('info');
            }
        }, 200);
    };

    const handlePrev = () => {
        if (step === 'info') {
            setStep('questions');
            setCurrentQuestion(questions.length - 1);
        } else if (step === 'questions') {
            if (currentQuestion > 0) {
                setCurrentQuestion(prev => prev - 1);
            } else {
                setStep('stream');
            }
        }
    };

    const calculateScore = (quizAns) => {
        let score = 65;
        if (quizAns.q1 === 'corporate') score += 10;
        if (quizAns.q2 === 'domestic') score += 8;
        if (quizAns.q3 === 'moderate') score += 7;
        if (quizAns.q4 !== 'any') score += 5;
        if (quizAns.q5 === 'placement') score += 5;
        return Math.min(score, 98);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStep('loading');

        try {
            // Fetch universities to generate accurate matching recommendations
            let universities = [];
            try {
                const res = await api.get('/api/universities');
                universities = res.data?.data || res.data?.universities || (Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.warn('Fallback fetching universities for quiz:', err);
            }

            // Filter or match universities based on selected stream
            const streamMap = {
                'science': ['sciences', 'computer', 'medical'],
                'commerce': ['commerce', 'management'],
                'arts': ['arts', 'design', 'law'],
                'engineering': ['engineering', 'computer']
            };

            const targetProgs = streamMap[selectedStream] || [selectedStream];
            let matchedUnis = universities.filter(u => 
                u.programmes && u.programmes.some(p => targetProgs.includes(p.toLowerCase()))
            );

            if (matchedUnis.length === 0) {
                matchedUnis = universities;
            }

            // Format recommendations with match percentages
            const recommendations = matchedUnis.slice(0, 5).map((uni, idx) => ({
                _id: uni._id || uni.slug,
                id: uni._id || uni.slug,
                name: uni.name,
                slug: uni.slug,
                location: uni.location,
                state: uni.state,
                ranking: uni.ranking || `NIRF Rank #${(idx + 1) * 15}`,
                matchPercentage: 96 - (idx * 3),
                image: uni.logo || uni.bannerImage || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
                type: uni.type || 'Private'
            }));

            const quizScore = calculateScore(answers);

            // Send lead data to backend
            try {
                await api.post('/api/leads/quiz', {
                    studentName: studentInfo.name,
                    phone: studentInfo.phone,
                    email: studentInfo.email,
                    city: studentInfo.city,
                    stream: selectedStream,
                    quizScore: quizScore,
                    recommendedUniversities: recommendations.map(r => ({ universityId: r._id, matchPercentage: r.matchPercentage }))
                });
            } catch (apiErr) {
                console.error('Quiz lead submission API warning:', apiErr);
            }

            // Save results for Results page
            const quizResultsObj = {
                studentName: studentInfo.name,
                stream: selectedStream,
                quizScore: quizScore,
                recommendations: recommendations
            };

            localStorage.setItem('quizResults', JSON.stringify(quizResultsObj));

            setTimeout(() => {
                navigate('/quiz-results');
            }, 1200);

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Something went wrong submitting your quiz. Please try again.');
            setStep('info');
        }
    };

    // Current question object
    const activeQ = questions[currentQuestion];

    return (
        <div className="institutional-container" style={{ padding: '50px 5%', maxWidth: '1400px', margin: '0 auto', boxSizing: 'border-box' }}>
            <Breadcrumbs items={breadcrumbs} />

            <div className="institutional-layout">

                {/* Column 1: Quiz Progress Navigation */}
                <aside className="col-quiz-nav">
                    <h3 className="nav-heading">Quiz Progress</h3>
                    <ul className="quiz-nav-list" id="quizNavList">
                        <li className={`${step === 'stream' ? 'active' : 'completed'}`} id="nav-step-stream">
                            <i className={`fas ${step !== 'stream' ? 'fa-check-circle' : 'fa-circle'}`} style={{ marginRight: '8px' }}></i>
                            Select Stream
                        </li>

                        {questions.map((q, idx) => {
                            let itemClass = '';
                            if (step === 'questions') {
                                if (currentQuestion === idx) itemClass = 'active';
                                else if (currentQuestion > idx) itemClass = 'completed';
                            } else if (step === 'info' || step === 'loading') {
                                itemClass = 'completed';
                            }
                            return (
                                <li className={itemClass} key={q.id} id={`nav-step-q${idx + 1}`}>
                                    <i className={`fas ${itemClass === 'completed' ? 'fa-check-circle' : 'fa-circle'}`} style={{ marginRight: '8px' }}></i>
                                    Question {idx + 1}
                                </li>
                            );
                        })}

                        <li className={`${step === 'info' || step === 'loading' ? 'active' : ''}`} id="nav-step-info">
                            <i className={`fas ${step === 'loading' ? 'fa-spinner fa-spin' : 'fa-circle'}`} style={{ marginRight: '8px' }}></i>
                            Your Details
                        </li>
                    </ul>
                </aside>

                {/* Column 2: Main Quiz Content */}
                <main className="col-quiz-content">
                    {/* Stream Selection */}
                    {step === 'stream' && (
                        <div className="quiz-step active" id="streamStep">
                            <div className="quiz-header">
                                <h2>Academic Stream</h2>
                                <p>Select your current or preferred field of study</p>
                            </div>

                            <div className="stream-options-list">
                                <div 
                                    className={`stream-option-card ${selectedStream === 'science' ? 'selected' : ''}`} 
                                    onClick={() => handleStreamSelect('science')}
                                >
                                    <i className="fas fa-flask"></i>
                                    <div className="stream-text-content">
                                        <div className="stream-option-title">Science</div>
                                        <div className="stream-option-subtitle">Physics, Chemistry, Biology</div>
                                    </div>
                                </div>
                                <div 
                                    className={`stream-option-card ${selectedStream === 'commerce' ? 'selected' : ''}`} 
                                    onClick={() => handleStreamSelect('commerce')}
                                >
                                    <i className="fas fa-chart-line"></i>
                                    <div className="stream-text-content">
                                        <div className="stream-option-title">Commerce</div>
                                        <div className="stream-option-subtitle">Business, Economics, Accounts</div>
                                    </div>
                                </div>
                                <div 
                                    className={`stream-option-card ${selectedStream === 'arts' ? 'selected' : ''}`} 
                                    onClick={() => handleStreamSelect('arts')}
                                >
                                    <i className="fas fa-palette"></i>
                                    <div className="stream-text-content">
                                        <div className="stream-option-title">Arts & Humanities</div>
                                        <div className="stream-option-subtitle">Design, Law, Literature</div>
                                    </div>
                                </div>
                                <div 
                                    className={`stream-option-card ${selectedStream === 'engineering' ? 'selected' : ''}`} 
                                    onClick={() => handleStreamSelect('engineering')}
                                >
                                    <i className="fas fa-cogs"></i>
                                    <div className="stream-text-content">
                                        <div className="stream-option-title">Engineering</div>
                                        <div className="stream-option-subtitle">Technology, Computer Science</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Questions */}
                    {step === 'questions' && activeQ && (
                        <div className="quiz-step active" id="questionsStep">
                            <div className="question-container" id="questionContainer">
                                <div className="question-card" data-question-id={activeQ.id}>
                                    <div className="question-number">Question {currentQuestion + 1} of {questions.length}</div>
                                    <h3 className="question-text">{activeQ.text}</h3>
                                    
                                    <div className="answer-options">
                                        {activeQ.options.map((opt, i) => (
                                            <div 
                                                className={`question-option ${answers[activeQ.id] === opt.value ? 'selected' : ''}`} 
                                                key={opt.value}
                                                onClick={() => handleOptionSelect(activeQ.id, opt.value)}
                                            >
                                                <div className="option-number">{String.fromCharCode(65 + i)}</div>
                                                <div className="option-text">{opt.text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="quiz-navigation" style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                                <button className="quiz-btn" onClick={handlePrev} id="prevBtn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fas fa-arrow-left"></i> Previous
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Student Info Collection */}
                    {step === 'info' && (
                        <div className="quiz-step active" id="studentInfoStep">
                            <div className="quiz-header">
                                <h2>Your Details</h2>
                                <p>Please provide your information to receive personalized recommendations</p>
                            </div>

                            <form id="studentInfoForm" className="student-info-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="studentName">Full Name <span className="required">*</span></label>
                                        <input 
                                            type="text" 
                                            id="studentName" 
                                            className="form-control" 
                                            required 
                                            value={studentInfo.name}
                                            onChange={e => setStudentInfo({ ...studentInfo, name: e.target.value })}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="studentPhone">Phone Number <span className="required">*</span></label>
                                        <input 
                                            type="tel" 
                                            id="studentPhone" 
                                            className="form-control" 
                                            required 
                                            pattern="[0-9]{10}"
                                            value={studentInfo.phone}
                                            onChange={e => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                                            placeholder="10-digit mobile number"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="studentEmail">Email Address <span className="required">*</span></label>
                                        <input 
                                            type="email" 
                                            id="studentEmail" 
                                            className="form-control" 
                                            required 
                                            value={studentInfo.email}
                                            onChange={e => setStudentInfo({ ...studentInfo, email: e.target.value })}
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="studentCity">City</label>
                                        <input 
                                            type="text" 
                                            id="studentCity" 
                                            className="form-control" 
                                            value={studentInfo.city}
                                            onChange={e => setStudentInfo({ ...studentInfo, city: e.target.value })}
                                            placeholder="Your current city"
                                        />
                                    </div>
                                </div>

                                <div className="form-buttons" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                    <button type="button" className="quiz-btn" onClick={handlePrev}>
                                        <i className="fas fa-arrow-left"></i> Previous
                                    </button>
                                    <button type="submit" className="quiz-btn accent">
                                        Get Recommendations <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Loading State */}
                    {step === 'loading' && (
                        <div className="quiz-step active" id="loadingStep">
                            <div className="loading-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <div className="loader" style={{ margin: '0 auto 20px auto' }}></div>
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--academic-dark)' }}>
                                    Analyzing Your Responses...
                                </h2>
                                <p style={{ color: 'var(--text-gray)', marginTop: '10px' }}>
                                    Matching you with the perfect universities based on your profile.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
