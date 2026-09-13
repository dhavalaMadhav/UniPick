const University = require('../models/University');
const Lead = require('../models/Lead');

// Recommendation Algorithm
const calculateRecommendations = async (stream, answers, scores) => {
    try {
        // Get all universities for the stream
        const universities = await University.find({ 
            streams: stream 
        });

        const recommendations = [];

        for (const university of universities) {
            let matchScore = 0;
            let maxPossibleScore = 0;

            // Calculate match based on university weights and user scores
            const weights = university.weights;

            // Stream match (most important - 40% weight)
            if (weights[stream]) {
                matchScore += weights[stream] * 0.4 * (scores[stream] || 50);
                maxPossibleScore += weights[stream] * 0.4 * 100;
            }

            // Budget match (20% weight)
            if (scores.budget) {
                const budgetMatch = weights.budget === scores.budget ? 100 : 50;
                matchScore += budgetMatch * 0.2;
                maxPossibleScore += 100 * 0.2;
            }

            // Research orientation (20% weight)
            if (scores.research !== undefined && weights.research) {
                matchScore += weights.research * 0.2 * scores.research;
                maxPossibleScore += weights.research * 0.2 * 100;
            }

            // Practical orientation (20% weight)
            if (scores.practical !== undefined && weights.practical) {
                matchScore += weights.practical * 0.2 * scores.practical;
                maxPossibleScore += weights.practical * 0.2 * 100;
            }

            // Calculate final percentage
            const matchPercentage = maxPossibleScore > 0 
                ? Math.round((matchScore / maxPossibleScore) * 100) 
                : 0;

            recommendations.push({
                university: university,
                matchPercentage: Math.min(matchPercentage, 100)
            });
        }

        // Sort by match percentage
        recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);

        // Return top 3
        return recommendations.slice(0, 3);
    } catch (error) {
        console.error('Error calculating recommendations:', error);
        return [];
    }
};

// Process quiz results
const processQuizResults = async (req, res) => {
  try {
    const { answers, studentId, stream, email, name } = req.body;
    
    // Validate required fields
    if (!stream) {
      return res.status(400).json({ 
        error: 'Stream is required' 
      });
    }
    
    // Calculate quiz score safely
    let quizScore = 0;
    const totalQuestions = answers.length;
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;
    
    // Ensure score is a valid number
    if (totalQuestions > 0) {
      quizScore = Math.round((correctAnswers / totalQuestions) * 100);
    }
    
    // Debug logging
    console.log('Quiz Score Calculation:', {
      correctAnswers,
      totalQuestions,
      calculatedScore: quizScore,
      isNaN: isNaN(quizScore)
    });
    
    // Create lead with proper validation
    const leadData = {
      studentId: studentId || generateStudentId(),
      name: name || 'Unknown',
      email: email || '',
      stream: stream, // This was missing
      quizScore: quizScore,
      // ... other fields
    };
    
    // Validate before saving
    const lead = new Lead(leadData);
    await lead.validate(); // This will throw error if validation fails
    
    // Save the lead
    await lead.save();
    
    // Rest of your code...
    
  } catch (error) {
    console.error('Error processing quiz:', error);
    return res.status(400).json({ 
      error: error.message,
      details: 'Please provide all required fields' 
    });
  }
};

module.exports = {
    processQuizResults,
    calculateRecommendations
};
