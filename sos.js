// Enhanced SOS Button functionality with animations
document.addEventListener('DOMContentLoaded', function() {
    const sosButton = document.getElementById('sosButton');
    
    if (sosButton) {
        let clickCount = 0;
        let clickTimeout;
        
        // Add ripple effect on click
        function createRipple(event) {
            const ripple = document.createElement('span');
            const rect = sosButton.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            sosButton.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
        
        sosButton.addEventListener('click', function(e) {
            clickCount++;
            clearTimeout(clickTimeout);
            
            // Create ripple effect
            createRipple(e);
            
            // Visual feedback
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
            
            // Add click animation class
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 400);
            
            // Double-click detection for emergency
            clickTimeout = setTimeout(() => {
                if (clickCount === 1) {
                    // Single click - show confirmation
                    showNotification('SOS signal prepared. Click again to confirm.', 'warning');
                } else if (clickCount >= 2) {
                    // Double click - send emergency
                    sendEmergencySignal();
                }
                clickCount = 0;
            }, 300);
        });
        
        function sendEmergencySignal() {
            // Visual feedback
            sosButton.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
            sosButton.textContent = 'SENT!';
            
            // Show success notification
            showNotification('Emergency SOS signal sent! Help is on the way.', 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                sosButton.style.background = '';
                sosButton.textContent = 'SOS';
            }, 3000);
        }
        
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                background: ${type === 'success' ? '#27ae60' : '#f39c12'};
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInRight 0.5s ease-out;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideInRight 0.5s ease-out reverse';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        }
    }
});
