// Simple canvas animation example
function initCanvas() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let x = 50;
    let y = 50;
    let dx = 2;
    let dy = 2;
    
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#007acc';
        ctx.fill();
        
        // Update position
        x += dx;
        y += dy;
        
        // Bounce off walls
        if (x + 20 > canvas.width || x - 20 < 0) dx = -dx;
        if (y + 20 > canvas.height || y - 20 < 0) dy = -dy;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCanvas);
