// Page transition handling with enhanced animations
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class on page load
    document.body.classList.add('page-fade-in');
    
    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all cards
    document.querySelectorAll('.card, .weather-card, .risk-card, .contact-card').forEach(card => {
        observer.observe(card);
    });
    
    // Enhanced navigation link animations
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        // Add hover ripple effect
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal navigation
            if (href && href.endsWith('.html')) {
                e.preventDefault();
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Add fade-out class
                document.body.classList.add('page-fade-out');
                
                // Navigate after fade-out
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });
    
    // Logo click animation
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Animate alert banner when it comes into view
    const alertBanner = document.querySelector('.alert-banner');
    if (alertBanner) {
        observer.observe(alertBanner);
    }
});
