// Smooth scrolling for navigation links (exclude buttons)
document.querySelectorAll('a[href^="#"]:not(.back-to-top):not(.scroll-down-btn)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Don't process if it's the back to top button
        if (this.id === 'backToTop') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        }
    });
});

// Throttle function for better scroll performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Header background on scroll - Optimized
const header = document.querySelector('.header');
const updateHeader = throttle(() => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(232, 221, 211, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(232, 221, 211, 0.95)';
        header.style.boxShadow = 'none';
    }
}, 100);

window.addEventListener('scroll', updateHeader, { passive: true });

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards and other animated elements
document.querySelectorAll('.project-card, .marketing-card, .gallery-item, .testimonial-card, .stat-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! I will get back to you within 24 hours.');
        
        // Reset form
        contactForm.reset();
    });
}

// Add loading animation to images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// Flag to prevent conflicting scrolls
let isScrollingProgrammatically = false;
let scrollTimeout = null;

// Back to top button (optimized)
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
    const toggleBackToTop = throttle(() => {
        if (!isScrollingProgrammatically && window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
            backToTopButton.classList.add('visible');
        } else if (!isScrollingProgrammatically && window.pageYOffset <= 300) {
            backToTopButton.classList.remove('show');
            backToTopButton.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Set flag to prevent other scroll handlers - LONGER DURATION
        isScrollingProgrammatically = true;
        
        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Disable smooth scroll temporarily
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        
        // Scroll to top instantly
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        
        // Re-enable smooth scroll after a delay
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = 'smooth';
            document.body.style.scrollBehavior = 'smooth';
        }, 100);
        
        // Reset flag after a MUCH longer delay to ensure scroll has fully settled
        scrollTimeout = setTimeout(() => {
            isScrollingProgrammatically = false;
        }, 1500);
        
        return false;
    }, true);
}

// Scroll down button
const scrollDownBtn = document.getElementById('scrollDownBtn');
if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Set flag to prevent other scroll handlers
        isScrollingProgrammatically = true;
        
        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Reset flag after scroll completes
        scrollTimeout = setTimeout(() => {
            isScrollingProgrammatically = false;
        }, 1500);
        
        return false;
    }, true);
}

// Side navigation active state for index page (optimized)
if (document.querySelector('.side-nav')) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.side-nav a');

    const updateActiveNav = throttle(() => {
        // Don't update if we're programmatically scrolling
        if (isScrollingProgrammatically) {
            return;
        }
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // Smooth scrolling for side nav ONLY
    document.querySelectorAll('.side-nav a:not(#backToTop)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Extra safety check
            if (this.id === 'backToTop' || this.classList.contains('back-to-top')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            // Set flag for programmatic scrolling
            isScrollingProgrammatically = true;
            
            // Clear any existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Reset flag after scroll completes
            scrollTimeout = setTimeout(() => {
                isScrollingProgrammatically = false;
            }, 1500);
        });
    });
}