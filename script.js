const socket = io();
let localStream;
let remoteStream;
let peer;

// Captura vídeo e áudio
async function getMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById('local-video').srcObject = localStream;
    } catch (error) {
        console.error('Erro ao acessar câmera/microfone:', error);
    }
}

// Iniciar chamada
document.getElementById('join-call').addEventListener('click', () => {
    getMedia();
    socket.emit('join-call');
});

// WebRTC
socket.on('user-connected', (userId) => {
    peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: localStream
    });

    peer.on('signal', (data) => {
        socket.emit('signal', { userId, signal: data });
    });

    peer.on('stream', (stream) => {
        document.getElementById('remote-video').srcObject = stream;
    });
});

socket.on('signal', ({ signal }) => {
    peer.signal(signal);
});

// Ativar/Desativar vídeo
document.getElementById('toggle-video').addEventListener('click', () => {
    let videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
});

// Ativar/Desativar áudio
document.getElementById('toggle-audio').addEventListener('click', () => {
    let audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
});

// Chat
document.getElementById('send-message').addEventListener('click', () => {
    let message = document.getElementById('message-input').value;
    socket.emit('chat-message', message);
    addMessage('Você', message);
    document.getElementById('message-input').value = '';
});

socket.on('chat-message', (data) => {
    addMessage('Outro usuário', data);
});

function addMessage(user, message) {
    let chatBox = document.getElementById('chat-box');
    let messageElement = document.createElement('p');
    messageElement.textContent = `${user}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
