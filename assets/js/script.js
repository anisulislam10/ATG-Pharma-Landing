document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.mobile-close-btn');
    const body = document.body;

    function openMenu() {
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        body.classList.add('menu-open');
    }

    function closeMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    }

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('active');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);

    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonial slider
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentTestimonial = 0;
    let autoRotateInterval;

    function initTestimonialSlider() {
        testimonialCards.forEach((card, index) => {
            if (!card.id) {
                card.id = `testimonial-${index + 1}`;
                card.setAttribute('role', 'tabpanel');
                card.setAttribute('aria-labelledby', `dot-${index + 1}`);
            }
        });
        showTestimonial(currentTestimonial);
        setupAutoRotate();
    }

    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            const isActive = i === index;
            card.classList.toggle('active', isActive);
            card.setAttribute('aria-hidden', !isActive);
        });

        dots.forEach((dot, i) => {
            const isActive = i === index;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive);
            dot.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        currentTestimonial = index;
    }

    function setupAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
        if (testimonialCards.length > 1) {
            autoRotateInterval = setInterval(() => {
                goToNextTestimonial();
            }, 5000);
        }
    }

    function goToNextTestimonial() {
        const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(nextIndex);
    }

    function goToPrevTestimonial() {
        const prevIndex = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(prevIndex);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            setupAutoRotate();
        });
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showTestimonial(index);
                setupAutoRotate();
            }
        });
    });

    prevBtn.addEventListener('click', () => {
        goToPrevTestimonial();
        setupAutoRotate();
    });

    nextBtn.addEventListener('click', () => {
        goToNextTestimonial();
        setupAutoRotate();
    });

    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.testimonial-dots')) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNextTestimonial();
                dots[currentTestimonial].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrevTestimonial();
                dots[currentTestimonial].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                showTestimonial(0);
                dots[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                showTestimonial(testimonialCards.length - 1);
                dots[testimonialCards.length - 1].focus();
            }
        }
    });

    const sliderContainer = document.querySelector('.testimonial-slider');
    sliderContainer.addEventListener('mouseenter', () => {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
    });
    sliderContainer.addEventListener('mouseleave', setupAutoRotate);
    sliderContainer.addEventListener('focusin', () => {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
    });
    sliderContainer.addEventListener('focusout', setupAutoRotate);

    initTestimonialSlider();

    // Animation on scroll
    const animatedElements = document.querySelectorAll('.hero-content, .hero-image, .about-image, .about-content, .product-card, .testimonial-slider, .contact-info, .contact-form');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const animateOnScroll = function() {
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Animate stats counting for about section
    const aboutStats = document.querySelectorAll('.about .stat-number');
    const animateAboutStats = () => {
        aboutStats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.textContent.includes('%') ? '%' : '';
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 16);
        });
    };

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAboutStats();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelector('.about').querySelectorAll('.stat-card').forEach(card => {
        aboutObserver.observe(card);
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });
});