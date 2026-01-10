// Enhanced Weather chart animation with smooth effects
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('rainfallChart');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;
        
        // Sample data
        const data = [20, 35, 45, 30, 50, 40, 60];
        const maxValue = Math.max(...data);
        const barWidth = width / data.length;
        const barSpacing = 10;
        
        // Animation variables
        let animationProgress = 0;
        const animationDuration = 2000; // 2 seconds
        const startTime = Date.now();
        let bars = [];
        
        // Initialize bar data with individual progress
        data.forEach((value, index) => {
            bars.push({
                value: value,
                progress: 0,
                delay: index * 100 // Staggered animation
            });
        });
        
        function drawChart() {
            ctx.clearRect(0, 0, width, height);
            
            const elapsed = Date.now() - startTime;
            
            // Draw grid lines
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let i = 0; i <= 5; i++) {
                const y = (height / 5) * i;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            
            // Animate each bar individually
            bars.forEach((bar, index) => {
                const delayElapsed = Math.max(0, elapsed - bar.delay);
                bar.progress = Math.min(delayElapsed / (animationDuration - bar.delay), 1);
                
                // Easing function (ease-out cubic)
                const easedProgress = 1 - Math.pow(1 - bar.progress, 3);
                
                const barHeight = (bar.value / maxValue) * height * 0.8 * easedProgress;
                const x = index * barWidth + barSpacing;
                const y = height - barHeight;
                const barW = barWidth - barSpacing * 2;
                
                // Create gradient for each bar
                const gradient = ctx.createLinearGradient(x, y, x, height);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                
                // Draw bar with rounded top
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(x, height);
                ctx.lineTo(x, y + 10);
                ctx.quadraticCurveTo(x, y, x + 5, y);
                ctx.lineTo(x + barW - 5, y);
                ctx.quadraticCurveTo(x + barW, y, x + barW, y + 10);
                ctx.lineTo(x + barW, height);
                ctx.closePath();
                ctx.fill();
                
                // Draw value label with animation
                if (bar.progress > 0.5) {
                    ctx.fillStyle = '#333';
                    ctx.font = 'bold 14px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(
                        Math.round(bar.value * easedProgress),
                        x + barW / 2,
                        y - 8
                    );
                }
            });
            
            // Continue animation if not complete
            if (bars.some(bar => bar.progress < 1)) {
                requestAnimationFrame(drawChart);
            } else {
                // Add final polish - draw connecting line
                drawConnectingLine();
            }
        }
        
        function drawConnectingLine() {
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            bars.forEach((bar, index) => {
                const barHeight = (bar.value / maxValue) * height * 0.8;
                const x = index * barWidth + (barWidth - barSpacing * 2) / 2 + barSpacing;
                const y = height - barHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
        
        // Start animation when chart is visible
        const observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                drawChart();
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        
        observer.observe(canvas);
        
        // Animate weather values on load
        const weatherValues = document.querySelectorAll('.weather-value');
        weatherValues.forEach((value, index) => {
            const finalValue = parseInt(value.textContent);
            value.textContent = '0';
            
            setTimeout(() => {
                animateValue(value, 0, finalValue, 1500, index * 200);
            }, 500);
        });
        
        function animateValue(element, start, end, duration, delay) {
            setTimeout(() => {
                const startTime = Date.now();
                const suffix = element.textContent.includes('°C') ? '°C' : 
                              element.textContent.includes('%') ? '%' : 
                              element.textContent.includes('km/h') ? ' km/h' : '';
                
                function update() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(start + (end - start) * eased);
                    
                    element.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }
                
                update();
            }, delay);
        }
    }
});
