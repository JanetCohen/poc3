onmessage = function(e) {
    if (e.data.cmd === 'start') {
        const offscreenCanvas = e.data.canvas;
        const ctx = offscreenCanvas.getContext('2d');
        
        // Memicu rendering kompleks (yang memakan waktu) di thread Worker
        function drawLoop() {
             ctx.fillStyle = `rgb(255, 0, 0)`; 
             ctx.fillRect(0, 0, 100, 100);
             ctx.font = '30px Arial';
             ctx.fillText('Attacking...', 10, 50);
             
             // Ulangi terus, berharap Thread Utama melakukan TERMINATE di tengah loop ini
             setTimeout(drawLoop, 1); 
        }

        // Mulai loop rendering yang intensif
        drawLoop();
    }
};
