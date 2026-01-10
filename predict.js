// Enhanced Prediction form functionality with animations
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.prediction-form');
    const formInputs = document.querySelectorAll('.form-input');
    const submitButton = document.querySelector('.submit-button');
    const riskCards = document.querySelectorAll('.risk-card');
    
    // Add input focus animations
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Add typing animation
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.borderColor = '#27ae60';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    });
    
    // Enhanced submit button animation
    if (submitButton) {
        submitButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        submitButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Calculating...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
                submitButton.style.cursor = 'not-allowed';
            }
            
            // Animate risk cards
            riskCards.forEach((card, index) => {
                setTimeout(() => {
                    // Reset card animation
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = '';
                    }, 10);
                    
                    // Add pulse effect
                    card.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 300);
                    
                    // Update risk level with animation
                    const riskLevel = card.querySelector('.risk-level');
                    if (riskLevel) {
                        animateRiskLevel(riskLevel, card, index);
                    }
                }, index * 200);
            });
            
            // Reset button after animation
            setTimeout(() => {
                if (submitButton) {
                    submitButton.textContent = 'Predict Risk';
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                }
            }, 2000);
        });
    }
    
    function animateRiskLevel(element, card, index) {
        const riskLevels = ['Low', 'Medium', 'High'];
        const colors = {
            Low: '#27ae60',
            Medium: '#f39c12',
            High: '#e74c3c'
        };
        
        // Randomly select new risk level (for demo)
        const newLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        const oldLevel = element.textContent;
        
        // Animate text change
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            element.textContent = newLevel;
            element.style.color = colors[newLevel];
            
            // Update card class
            card.className = 'risk-card ' + newLevel.toLowerCase() + '-risk';
            
            // Animate in
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'all 0.4s ease';
        }, 200);
        
        // Update border color
        card.style.borderLeftColor = colors[newLevel];
    }
    
    // Add hover effects to risk cards
    riskCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const riskLevel = this.querySelector('.risk-level');
            if (riskLevel) {
                riskLevel.style.transform = 'scale(1.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const riskLevel = this.querySelector('.risk-level');
            if (riskLevel) {
                riskLevel.style.transform = 'scale(1)';
            }
        });
    });
    
    // Form validation with visual feedback
    formInputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.style.borderColor = '#e74c3c';
            this.style.animation = 'shakeInput 0.5s ease';
            
            // Show error message
            showFieldError(this);
        });
        
        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.style.borderColor = '#27ae60';
                hideFieldError(this);
            }
        });
    });
    
    function showFieldError(input) {
        let errorMsg = input.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.cssText = `
                color: #e74c3c;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
                animation: fadeInUp 0.3s ease;
            `;
            errorMsg.textContent = 'Please fill in this field';
            input.parentElement.appendChild(errorMsg);
        }
    }
    
    function hideFieldError(input) {
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }
});
