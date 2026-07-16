/**
 * 247pay - Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const revealElements = document.querySelectorAll('.reveal');
    const statValues = document.querySelectorAll('.stat-value');
    const contactForm = document.getElementById('contactForm');

    // ====== Navbar scroll effect ======
    const updateNavbar = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // ====== Mobile menu toggle ======
    const toggleMenu = () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ====== Scroll reveal animations ======
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ====== Stats counter animation ======
    const animateCounter = (el) => {
        const target = parseFloat(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = target * easeOutQuart;

            let displayValue;
            if (target >= 1000) {
                displayValue = Math.floor(current).toLocaleString();
            } else if (target < 1) {
                displayValue = current.toFixed(1);
            } else {
                displayValue = Math.floor(current);
            }

            el.innerHTML = `${prefix}${displayValue}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Final formatted value
                let finalValue;
                if (target >= 1000) {
                    finalValue = target.toLocaleString();
                } else if (target < 1) {
                    finalValue = target.toFixed(1);
                } else {
                    finalValue = target;
                }
                el.innerHTML = `${prefix}${finalValue}${suffix}`;
            }
        };

        requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => statsObserver.observe(stat));

    // ====== Smooth scroll for anchor links ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====== Contact form handling ======
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Simulate form submission
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="spin">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-linecap="round"/>
                </svg>
                提交中...
            `;

            setTimeout(() => {
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10L8 14L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    提交成功
                `;
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 3000);
            }, 1500);
        });
    }
});

// Add spin animation for loading icon
const style = document.createElement('style');
style.textContent = `
    .spin {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
