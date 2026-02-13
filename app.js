// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initTypewriter();
    initSkillBars();
    initCopyEmail();
    initScrollAnimations();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Calculate the offset position
                    const navbarHeight = navbar ? navbar.offsetHeight : 70;
                    const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    // Update active navigation link on scroll - IMPROVED
    let ticking = false;
    
    function updateActiveNav() {
        const currentScroll = window.pageYOffset;
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        
        // Toggle visual state for scrolled navbar
        if (navbar) {
            navbar.classList.toggle('scrolled', currentScroll > 50);
        }

        // Update active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active states
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        ticking = false;
    }
    
    function requestUpdateNav() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNav);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestUpdateNav);
}

// Typewriter effect for hero section
function initTypewriter() {
    const typewriter = document.getElementById('typewriter');
    if (!typewriter) return;
    
    const texts = [
        'Full Stack Engineer',
        'C# & .NET Core Developer',
        'Python & FastAPI Developer',
        'React & TypeScript Developer',
        'CI/CD & DevOps Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typewriter effect after a short delay
    setTimeout(type, 1000);
}

// Animated skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;

    if (!skillsSection) return;

    // Create intersection observer for skills section
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !skillsAnimated) {
                animateSkillBars();
                skillsAnimated = true;
            }
        });
    }, {
        threshold: 0.3
    });

    skillsObserver.observe(skillsSection);

    function animateSkillBars() {
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            if (width) {
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, index * 200);
            }
        });
    }
}

// Copy email functionality
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email');
    const emailAddress = document.getElementById('email-address');
    
    if (copyBtn && emailAddress) {
        copyBtn.addEventListener('click', async function() {
            const email = emailAddress.textContent.trim();
            
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }
                
                // Visual feedback
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = '#7ee787';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '';
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy email:', err);
                
                // Still show feedback even if copy failed
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-exclamation"></i> Try again';
                copyBtn.style.background = '#ff6b6b';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            }
        });
    }
}

// Scroll animations for various elements
function initScrollAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Trigger animation slightly before the element enters view.
    const observerOptions = {
        threshold: 0.03,
        rootMargin: '0px 0px 120px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll(`
        .about-text,
        .about-stats,
        .skill-category,
        .timeline-item,
        .project-card,
        .publication-card,
        .education-card,
        .contact-item
    `);

    // Set initial state and observe elements
    animatedElements.forEach((element, index) => {
        if (element) {
            if (prefersReducedMotion) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                return;
            }

            // Small repeated stagger keeps the UI lively without slowing lower sections.
            const staggerDelay = (index % 4) * 0.05;
            element.style.opacity = '0';
            element.style.transform = 'translateY(18px)';
            element.style.transition = `opacity 0.42s ease ${staggerDelay}s, transform 0.42s ease ${staggerDelay}s`;
            observer.observe(element);
        }
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.about-stats');
    let statsAnimated = false;

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    function animateStats() {
        stats.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isPlusSign = target.includes('+');
            let numericTarget = parseInt(target.replace(/[^\d]/g, ''));
            
            if (isNaN(numericTarget)) return;
            
            let current = 0;
            const increment = numericTarget / 50; // Animate over ~50 frames
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericTarget) {
                    current = numericTarget;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (isPercentage) {
                    displayValue += '%';
                }
                if (isPlusSign) {
                    displayValue += '+';
                }
                
                stat.textContent = displayValue;
            }, 30);
        });
    }
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.classList.add('scroll-to-top');
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', scrollToTop);
    
    let scrollTicking = false;
    function handleScrollToTopVisibility() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
        scrollTicking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(handleScrollToTopVisibility);
            scrollTicking = true;
        }
    });
}

// Initialize scroll to top button
initScrollToTop();

// Parallax effect for hero section (subtle)
function initParallax() {
    const hero = document.querySelector('.hero');
    const profileCard = document.querySelector('.profile-card');
    
    if (!hero || !profileCard) return;
    
    let parallaxTicking = false;
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3; // Reduced for subtler effect
        
        if (scrolled < hero.offsetHeight) {
            profileCard.style.transform = `translateY(${rate}px)`;
        }
        parallaxTicking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(handleParallax);
            parallaxTicking = true;
        }
    });
}

// Initialize parallax effect
initParallax();

// Loading animation (fade in page content)
function initPageLoad() {
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    });
}

// Initialize page load animation
initPageLoad();

// Enhanced project card interactions
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const firstLink = this.querySelector('a');
                if (firstLink) {
                    firstLink.click();
                }
            }
        });
    });
}

// Initialize project card enhancements
initProjectCards();

// Keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            if (navMenu && navMenu.classList.contains('active')) {
                if (hamburger) hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
        
        // Enter key on navigation links
        if (e.key === 'Enter' && e.target.classList.contains('nav-link')) {
            e.target.click();
        }
    });
}

// Initialize keyboard navigation
initKeyboardNavigation();

// Optional: Add visual feedback for external links
function initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        // Add external link icon if not present
        if (!link.querySelector('.fas, .fab') && !link.classList.contains('project-link')) {
            link.innerHTML += ' <i class="fas fa-external-link-alt" style="font-size: 0.8em; margin-left: 0.3em;"></i>';
        }
        
        link.addEventListener('click', function() {
            // Add a subtle visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize external links feedback
initExternalLinks();

// Enhanced skill icon loading with fallback
function initSkillIcons() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    
    skillIcons.forEach(icon => {
        icon.addEventListener('error', function() {
            // If image fails to load, hide it and rely on skill name
            this.style.display = 'none';
        });
        
        icon.addEventListener('load', function() {
            // Add a subtle animation when image loads
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });
}

// Initialize skill icons
initSkillIcons();

// Performance optimization: Debounce function
function debounce(func, wait) {
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

// Intersection Observer for performance optimization
function initPerformanceOptimizations() {
    // Lazy load images that might be below the fold
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Add loading animation
                img.style.transition = 'opacity 0.3s ease';
                img.style.opacity = '0.7';
                
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize performance optimizations
initPerformanceOptimizations();

// Console easter egg for developers who inspect the code
console.log(`
🚀 Welcome to Devi Prakash Kandikonda's Portfolio!

✨ Recent Updates:
   • Added AI-Powered API Assistant project
   • Added SpecDrift Agent for OpenAPI drift reconciliation
   • Added multi-language open-source SDK automation work
   • Enhanced professional summary and skills
   • Updated experience at Ingram Micro

👨‍💻 Interested in the code? Check out the repository:
   GitHub: https://github.com/dprakash2101

💼 Want to connect? Find me on:
   LinkedIn: https://www.linkedin.com/in/devi-prakash-kandikonda/
   Email: deviprakash9321@gmail.com

⭐ Built with vanilla JavaScript, CSS Grid, and lots of ☕

🔧 Navigation optimized for smooth scrolling and accessibility!
`);

// Enhanced error handling for any uncaught errors
window.addEventListener('error', function(e) {
    console.log('An error occurred:', e.error);
    // In production, you could send this to an analytics service
});

// Ensure all sections have proper IDs for navigation
function validateSectionIds() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const missingSections = [];
    
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (!targetSection) {
            missingSections.push(targetId);
        }
    });
    
    if (missingSections.length > 0) {
        console.warn('Missing sections for navigation:', missingSections);
    }
}

// Run validation
validateSectionIds();

// Add a subtle animation to the featured highlight in projects
function initFeaturedHighlight() {
    const featuredHighlight = document.querySelector('.highlight.featured');
    
    if (featuredHighlight) {
        // Add a subtle pulsing effect
        featuredHighlight.style.animation = 'pulse 2s ease-in-out infinite';
        
        // Add the pulse animation to CSS dynamically if it doesn't exist
        if (!document.querySelector('#pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(126, 231, 135, 0.4);
                    }
                    50% {
                        transform: scale(1.02);
                        box-shadow: 0 0 0 10px rgba(126, 231, 135, 0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize featured highlight animation
initFeaturedHighlight();

// Add smooth transitions to skill icons on hover
function initSkillIconHovers() {
    const skillHeaders = document.querySelectorAll('.skill-header');
    
    skillHeaders.forEach(header => {
        header.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon, .skill-icon-font');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        header.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon, .skill-icon-font');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Initialize skill icon hovers
initSkillIconHovers();
