import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Universities from './pages/Universities';
import UniversityDetail from './pages/UniversityDetail';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';

function App() {
  return (
        <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:category" element={<Courses />} />
        <Route path="/courses/:category/:slug" element={<CourseDetail />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/university/:slug" element={<UniversityDetail />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz-results" element={<QuizResults />} />
      </Routes>
      <Footer />
    </Router>
          </>
    );
}

export default App;
