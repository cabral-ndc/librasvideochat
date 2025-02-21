
const socket = io();

// Configuração do WebRTC
const peer = new SimplePeer({
    initiator: location.hash === '#host',
    trickle: false
});

peer.on('signal', (data) => {
    socket.emit('signal', data);
});

socket.on('signal', (data) => {
    peer.signal(data);
});

peer.on('stream', (stream) => {
    const video = document.getElementById('remote-video');
    video.srcObject = stream;
    video.play();
});

// Acessando câmera e microfone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        const localVideo = document.getElementById('local-video');
        localVideo.srcObject = stream;
        localVideo.play();
        peer.addStream(stream);
    })
    .catch((err) => console.error("Erro ao acessar câmera e microfone:", err));

// Envio de mensagens no chat
document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    if (message.trim() !== '') {
        socket.emit('chatMessage', message);
        document.getElementById('message-input').value = '';
    }
});

// Recebendo mensagens do chat
socket.on('chatMessage', (message) => {
    const chatBox = document.getElementById('chat-box');
    const msgElement = document.createElement('div');
    msgElement.classList.add('message');
    msgElement.innerText = message;
    chatBox.appendChild(msgElement);
});

// Botões de ativar/desativar áudio e vídeo
document.getElementById('toggle-audio').addEventListener('click', () => {
    const stream = document.getElementById('local-video').srcObject;
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
});

document.getElementById('toggle-video').addEventListener('click', () => {
    const stream = document.getElementById('local-video').srcObject;
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
});

// Conectar usuário ao chat e vídeo chamada
document.getElementById('join-call').addEventListener('click', () => {
    socket.emit('joinCall');
});

// Notificar sobre novos usuários na chamada
socket.on('userConnected', (userId) => {
    console.log(`Usuário conectado: ${userId}`);
});

// Melhorar experiência com animações
document.getElementById('message-input').addEventListener('focus', () => {
    document.getElementById('chat-box').classList.add('active');
});

document.getElementById('message-input').addEventListener('blur', () => {
    document.getElementById('chat-box').classList.remove('active');
});
