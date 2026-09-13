// script.js

class SwissCanvasTextZoomEffect {
    constructor() {
        this.canvas = document.getElementById('hollowTextCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.content = document.getElementById('canvasContent');
        this.contentWrapper = document.querySelector('.behind-content-wrapper');
        this.section = document.getElementById('hollowTextSection');
        
        this.text = 'UNIPICK';
        this.baseFontSize = 150;
        this.currentScale = 5;
        this.maxScale = 50;
        this.minScale = 1;
        
        this.animationFrame = null;
        this.lastScrollY = 0;
        this.isAnimating = false;
        
        // Scroll lock properties
        this.isLocked = false;
        this.zoomComplete = false;
        this.accumulatedScroll = 0;
        this.scrollThreshold = 1500; // Total scroll needed to complete zoom
        this.lastWheelDelta = 0;
        
        this.colors = {
            background: '#000000',
            text: '#FFFFFF',
            outline: '#0055FF'
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.draw();
        this.update();
    }
    
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('scroll', (e) => this.handleScroll(e), { passive: false });
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
    }
    
    handleResize() {
        this.setupCanvas();
        this.draw();
    }
    
    handleWheel(e) {
        const sectionRect = this.section.getBoundingClientRect();
        const inSection = sectionRect.top <= 0 && sectionRect.bottom > window.innerHeight;
        
        // Detect scroll direction
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        
        // Lock during zoom down OR zoom up (reverse)
        if (inSection) {
            // Scrolling down - zoom in
            if (scrollingDown && !this.zoomComplete) {
                e.preventDefault();
                this.accumulatedScroll += Math.abs(e.deltaY);
                
                let progress = Math.min(this.accumulatedScroll / this.scrollThreshold, 1);
                progress = Math.pow(progress, 0.85);
                
                this.currentScale = this.minScale + (progress * (this.maxScale - this.minScale));
                this.content.style.opacity = Math.min(1, progress * 3);
                
                const translateY = 30 - (progress * 30);
                if (this.contentWrapper) {
                    this.contentWrapper.style.transform = `translateY(${translateY}px)`;
                }
                
                this.draw();
                
                if (progress >= 1) {
                    this.zoomComplete = true;
                }
            }
            // Scrolling up - zoom out (reverse)
            else if (scrollingUp && this.accumulatedScroll > 0) {
                e.preventDefault();
                this.accumulatedScroll -= Math.abs(e.deltaY);
                this.accumulatedScroll = Math.max(0, this.accumulatedScroll);
                
                let progress = Math.min(this.accumulatedScroll / this.scrollThreshold, 1);
                progress = Math.pow(progress, 0.85);
                
                this.currentScale = this.minScale + (progress * (this.maxScale - this.minScale));
                this.content.style.opacity = Math.min(1, progress * 3);
                
                const translateY = 30 - (progress * 30);
                if (this.contentWrapper) {
                    this.contentWrapper.style.transform = `translateY(${translateY}px)`;
                }
                
                this.draw();
                
                // Reset zoom complete flag when scrolling back
                if (progress < 1) {
                    this.zoomComplete = false;
                }
            }
        }
    }
    
    handleScroll(e) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animationFrame = requestAnimationFrame(() => {
            this.update();
            this.isAnimating = false;
        });
    }
    
    update() {
        const sectionRect = this.section.getBoundingClientRect();
        
        // Complete reset when far from section
        if (sectionRect.top > 100) {
            this.accumulatedScroll = 0;
            this.zoomComplete = false;
            this.isLocked = false;
            this.currentScale = this.minScale;
            this.draw();
            this.content.style.opacity = 0;
            return;
        }
        
        this.draw();
    }
    
    draw() {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, width, height);
        
        const fontSize = this.baseFontSize * this.currentScale;
        
        this.ctx.font = `900 ${fontSize}px 'Inter', 'Helvetica Neue', Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.save();
        this.ctx.strokeStyle = this.colors.outline;
        this.ctx.lineWidth = 4;
        this.ctx.strokeText(this.text, width / 2, height / 2);
        
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillText(this.text, width / 2, height / 2);
        this.ctx.restore();
        
        if (this.currentScale > 3) {
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 85, 255, 0.5)';
            this.ctx.shadowOffsetX = 8;
            this.ctx.shadowOffsetY = 8;
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = 'transparent';
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.fillText(this.text, width / 2, height / 2);
            this.ctx.restore();
        }
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('wheel', this.handleWheel);
    }
}

class HeroCarousel {
    constructor() {
        this.carouselTrack = document.querySelector('.carousel-track');
        this.carouselDots = document.querySelectorAll('.carousel .dot');
        this.carouselPrevBtn = document.querySelector('.carousel-prev');
        this.carouselNextBtn = document.querySelector('.carousel-next');
        this.heroSection = document.querySelector('.hero');
        this.carouselSlides = document.querySelectorAll('.carousel-slide');
        
        this.currentSlide = 0;
        this.totalSlides = this.carouselSlides.length;
        this.carouselInterval = null;
        
        if (this.carouselTrack) this.init();
    }
    
    init() {
        this.bindEvents();
        this.moveToSlide(0);
        this.startAutoPlay();
    }
    
    bindEvents() {
        this.carouselDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.moveToSlide(index);
                this.resetAutoPlay();
            });
        });

        if (this.carouselPrevBtn) {
            this.carouselPrevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoPlay();
            });
        }

        if (this.carouselNextBtn) {
            this.carouselNextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
        }

        // Swipe / drag support (touch + mouse)
        let isDragging = false;
        let startX = 0;
        let prevTranslate = 0;

        const getPosition = (e) => (e.type.includes('mouse') ? e.pageX : e.touches[0].clientX);

        const touchStart = (e) => {
            isDragging = true;
            startX = getPosition(e);
            const containerWidth = this.heroSection.offsetWidth;
            prevTranslate = -this.currentSlide * containerWidth;
            this.carouselTrack.style.transition = ''; // disable transition while dragging
            clearInterval(this.carouselInterval);
        };

        const touchMove = (e) => {
            if(!isDragging) return;
            const currentPosition = getPosition(e);
            const diff = currentPosition - startX;
            const translatePx = prevTranslate + diff;
            this.carouselTrack.style.transform = `translateX(${translatePx}px)`;
        };

        const touchEnd = (e) => {
            if(!isDragging) return;
            isDragging = false;
            const containerWidth = this.heroSection.offsetWidth;
            const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : (e.pageX || startX);
            const movedBy = endX - startX;

            if (movedBy < -60 && this.currentSlide < this.totalSlides - 1) {
                this.nextSlide();
            } else if (movedBy > 60 && this.currentSlide > 0) {
                this.prevSlide();
            } else {
                this.moveToSlide(this.currentSlide);
            }

            this.resetAutoPlay();
        };

        // Touch events
        this.carouselTrack.addEventListener('touchstart', touchStart, {passive:true});
        this.carouselTrack.addEventListener('touchmove', touchMove, {passive:true});
        this.carouselTrack.addEventListener('touchend', touchEnd);

        // Mouse events
        this.carouselTrack.addEventListener('mousedown', touchStart);
        this.carouselTrack.addEventListener('mousemove', touchMove);
        this.carouselTrack.addEventListener('mouseup', touchEnd);
        this.carouselTrack.addEventListener('mouseleave', () => { if (isDragging) touchEnd(); });

        this.heroSection.addEventListener('mouseenter', () => {
            clearInterval(this.carouselInterval);
        });

        this.heroSection.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
    
    moveToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        const percentPerSlide = 100 / this.totalSlides;
        const translateX = -slideIndex * percentPerSlide;
        this.carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        this.carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });
        
        const slideContent = this.carouselSlides[slideIndex].querySelector('.carousel-content');
        if (slideContent) {
            slideContent.style.animation = 'none';
            setTimeout(() => {
                slideContent.style.animation = 'swissSlideIn 1s ease-out';
            }, 10);
        }
    }
    
    prevSlide() {
        let prevSlide = this.currentSlide - 1;
        if (prevSlide < 0) {
            prevSlide = this.totalSlides - 1;
        }
        this.moveToSlide(prevSlide);
    }
    
    nextSlide() {
        let nextSlide = this.currentSlide + 1;
        if (nextSlide >= this.totalSlides) {
            nextSlide = 0;
        }
        this.moveToSlide(nextSlide);
    }
    
    startAutoPlay() {
        this.carouselInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    resetAutoPlay() {
        clearInterval(this.carouselInterval);
        this.startAutoPlay();
    }
}

class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.statsSection = document.querySelector('.stats-section');
        this.counterAnimated = false;
        
        if (this.counters.length > 0 && this.statsSection) {
            this.init();
        }
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.counterAnimated) {
                    this.animateCounters();
                    this.counterAnimated = true;
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.statsSection);
    }
    
    animateCounters() {
        const speed = 200;
        
        this.counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / speed;
            
            const updateCount = () => {
                const count = +counter.innerText;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCount();
        });
    }
}

class TestimonialsCarousel {
    constructor() {
        this.carousel = document.getElementById('testimonialsCarousel');
        this.prevButton = document.getElementById('testimonialPrevBtn');
        this.nextButton = document.getElementById('testimonialNextBtn');
        this.storyCards = document.querySelectorAll('.story-card');
        this.currentIndex = 0;
        
        if (this.carousel) this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        this.prevButton.addEventListener('click', () => {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.scrollToCard(this.currentIndex);
            }
        });
        
        this.nextButton.addEventListener('click', () => {
            if (this.currentIndex < this.storyCards.length - 1) {
                this.currentIndex++;
                this.scrollToCard(this.currentIndex);
            }
        });
    }
    
    scrollToCard(index) {
        const cardWidth = this.storyCards[0].offsetWidth;
        const gap = 40;
        const scrollAmount = (cardWidth + gap) * index;
        this.carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
}

class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        
        if (this.faqItems.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                this.faqItems.forEach(faq => faq.classList.remove('active'));
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
}

class ButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-quiz-cta');
        
        if (this.buttons.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translate(-2px, -2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translate(2px, 2px)';
                button.style.boxShadow = 'none';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translate(-2px, -2px)';
                if (button.classList.contains('btn-primary')) {
                    button.style.boxShadow = 'var(--shadow-primary)';
                } else if (button.classList.contains('btn-secondary')) {
                    button.style.boxShadow = 'var(--shadow-secondary)';
                } else {
                    button.style.boxShadow = 'var(--shadow-accent)';
                }
            });
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Swiss Design Components...');
    
    // Initialize all components
    const swissCanvasEffect = new SwissCanvasTextZoomEffect();
    const heroCarousel = new HeroCarousel();
    const statsCounter = new StatsCounter();
    const testimonialsCarousel = new TestimonialsCarousel();
    const faqAccordion = new FAQAccordion();
    const buttonEffects = new ButtonEffects();
    
    console.log('Swiss Design Components initialized successfully ✅');
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (swissCanvasEffect) {
            swissCanvasEffect.destroy();
        }
    });
});