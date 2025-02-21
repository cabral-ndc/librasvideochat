const startCallBtn = document.getElementById('start-call-btn');
const endCallBtn = document.getElementById('end-call-btn');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const statusMessage = document.getElementById('status-message');

let localStream;
let remoteStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }; // STUN Server

startCallBtn.addEventListener('click', startCall);
endCallBtn.addEventListener('click', endCall);

async function startCall() {
    try {
        statusMessage.textContent = 'Conectando...';
        startCallBtn.disabled = true;
        


        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        
        peerConnection = new RTCPeerConnection(config);




        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        
        peerConnection.ontrack = event => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };



        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        
        // enviarOferta(offer);

        statusMessage.textContent = 'Chamada em andamento...';
        startCallBtn.style.display = 'none';
        endCallBtn.style.display = 'inline-block';
        endCallBtn.disabled = false;
    } catch (error) {
        console.error('Erro ao iniciar a chamada:', error);
        statusMessage.textContent = 'Erro ao iniciar a chamada. Tente novamente.';
        startCallBtn.disabled = false;
    }
}

function endCall() {
    statusMessage.textContent = 'Chamada encerrada.';
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    startCallBtn.style.display = 'inline-block';
    endCallBtn.style.display = 'none';
    endCallBtn.disabled = true;
}
