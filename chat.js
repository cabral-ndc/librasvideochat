import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_DOMINIO.firebaseapp.com",
    databaseURL: "https://SEU_DATABASE.firebaseio.com",
    projectId: "SEU_PROJETO_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");
const messages = document.getElementById("messages");

sendMessage.addEventListener("click", () => {
    push(messagesRef, { text: messageInput.value });
    messageInput.value = "";
});

onChildAdded(messagesRef, (snapshot) => {
    const msg = snapshot.val();
    const p = document.createElement("p");
    p.textContent = msg.text;
    messages.appendChild(p);
});
