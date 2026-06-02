let socket = {
  emit() {
    alert(
      "Socket.IO is not initialized. Check your network or open this page through the Node server."
    );
  },
  on() {},
  once() {},
  off() {}
};

let typingTimeout = null;

function initializeSocketClient() {
  if (typeof io === "undefined") {
    addSystem(
      "Socket.IO client not loaded. Please check network connectivity or serve this page from the running Node server."
    );
    return;
  }

  socket = io({
    transports: ["websocket"]
  });
}

function createConversation() {
  const button = document.getElementById("createBtn");
  button.disabled = true;
  button.innerText = "Starting...";

  const user_id = Number(document.getElementById("userId").value);
  const astrologer_id = Number(document.getElementById("astrologerId").value);

  socket.emit(
    "create_conversation",
    {
      user_id,
      astrologer_id
    },
    (response) => {
      console.log(response);
      button.disabled = false;
      button.innerText = "Start Chat";

      if (!response.success) {
        return alert(response.message);
      }

      document.getElementById("conversationId").value = response.conversation.conversation_id;
      document.getElementById("walletStatus").innerHTML = `Wallet : ₹${response.wallet_balance}`;

      addSystem(`Conversation Created : ${response.conversation.conversation_id}`);
      addSystem(`User : ${response.conversation.user_name}`);
      addSystem(`Astrologer : ${response.conversation.astrologer_name}`);
      addSystem(`Charge : ₹${response.conversation.charge_per_min}/min`);

      joinRoom();
    }
  );
}

function joinRoom() {
  const conversation_id = document.getElementById("conversationId").value;
  const sender_type = document.getElementById("senderType").value;

  if (!conversation_id) {
    return alert("Enter conversation id");
  }

  socket.emit("join_room", {
    conversation_id,
    sender_type
  });

  addSystem(`Joined Room : ${conversation_id}`);
}

function leaveRoom() {
  const conversation_id = document.getElementById("conversationId").value;
  const sender_type = document.getElementById("senderType").value;

  socket.emit("leave_room", {
    conversation_id,
    sender_type
  });

  addSystem("Room Left");
  document.getElementById("astroStatus").innerHTML = "⚫ Offline";
}

function sendMessage() {
  const conversation_id = document.getElementById("conversationId").value;
  if (!conversation_id) {
    return alert("Create conversation first");
  }

  const sender_type = document.getElementById("senderType").value;
  const sender_id = sender_type === "user"
    ? Number(document.getElementById("userId").value)
    : Number(document.getElementById("astrologerId").value);

  const message = document.getElementById("msg").value;
  if (!message) {
    return alert("Enter message");
  }

  socket.emit("send_message", {
    conversation_id,
    sender_id,
    sender_type,
    message,
    message_type: "text"
  });

  document.getElementById("msg").value = "";
  socket.emit("stop_typing", { conversation_id });
}

function sendFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) {
    return alert("Select file");
  }

  const sender_type = document.getElementById("senderType").value;
  const conversation_id = document.getElementById("conversationId").value;
  const sender_id = sender_type === "user"
    ? Number(document.getElementById("userId").value)
    : Number(document.getElementById("astrologerId").value);

  const reader = new FileReader();
  reader.onload = function () {
    socket.emit("send_message", {
      conversation_id,
      sender_id,
      sender_type,
      message: file.name,
      message_type: file.type.startsWith("image/") ? "image" : "file",
      file_url: reader.result
    });
  };

  reader.readAsDataURL(file);
}

function handleTypingInput() {
  const sender_type = document.getElementById("senderType").value;
  const conversation_id = document.getElementById("conversationId").value;

  socket.emit("typing", {
    conversation_id,
    sender_type
  });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop_typing", { conversation_id });
  }, 1000);
}

function addSystem(message) {
  const li = document.createElement("li");
  li.className = "system";
  li.innerHTML = message;
  document.getElementById("chat").appendChild(li);
  scrollBottom();
}

function scrollBottom() {
  const chat = document.getElementById("chat");
  chat.scrollTop = chat.scrollHeight;
}

function setupHandlers() {
  document.getElementById("createBtn").addEventListener("click", createConversation);
  document.getElementById("joinBtn").addEventListener("click", joinRoom);
  document.getElementById("leaveBtn").addEventListener("click", leaveRoom);
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("uploadBtn").addEventListener("click", sendFile);
  document.getElementById("msg").addEventListener("input", handleTypingInput);
}

function registerSocketListeners() {
  socket.on("connect", () => {
    addSystem("Connected : " + socket.id);
  });

  socket.on("disconnect", () => {
    addSystem("Socket Disconnected");
  });

  socket.on("typing", (data) => {
    document.getElementById("typing").innerHTML = `${data.sender_type} typing...`;
  });

  socket.on("stop_typing", () => {
    document.getElementById("typing").innerHTML = "";
  });

  socket.on("receive_message", (data) => {
    const li = document.createElement("li");
    li.className = data.sender_type;

    let html = `<b>${data.sender_type}</b><br/><br/>`;

    if (data.message_type === "text") {
      html += `${data.message}`;
    } else if (data.message_type === "image") {
      html += `<img src="${data.file_url}"/>`;
    } else {
      html += `<a href="${data.file_url}" target="_blank">${data.message}</a>`;
    }

    html += `<br/><br/><small>Seen : ${data.is_read ? "YES" : "NO"}</small><br/><small>Time : ${data.sent_at || ""}</small>`;
    li.innerHTML = html;
    document.getElementById("chat").appendChild(li);
    scrollBottom();

    socket.emit("seen_messages", {
      conversation_id: data.conversation_id
    });
  });

  socket.on("messages_seen", () => {
    addSystem("Messages Seen");
  });

  socket.on("wallet_updated", (data) => {
    document.getElementById("walletStatus").innerHTML = `Wallet : ₹${data.remaining_balance}`;
    addSystem(`₹${data.deducted} deducted<br/>Remaining : ₹${data.remaining_balance}`);
  });

  socket.on("low_balance", (data) => {
    addSystem(`⚠ Low Balance : ₹${data.balance}`);
    alert("Low wallet balance");
  });

  socket.on("user_joined", (data) => {
    addSystem(`${data.sender_type} joined room`);
  });

  socket.on("astrologer_status", (data) => {
    const box = document.getElementById("astroStatus");
    if (data.status === "online") {
      box.className = "status-box online";
      box.innerHTML = "🟢 Online";
    } else if (data.status === "busy") {
      box.className = "status-box busy";
      box.innerHTML = "🔴 Busy";
    } else {
      box.className = "status-box offline";
      box.innerHTML = "⚫ Offline";
    }
  });

  socket.on("chat_ended", (data) => {
    addSystem(`Chat Ended<br/><br/>${data.message || ""}<br/><br/>Amount : ₹${data.amount || 0}<br/>Duration : ${data.duration || 0} min`);
    alert(data.message || "Chat ended");
    document.getElementById("conversationId").value = "";
    document.getElementById("astroStatus").innerHTML = "🟢 Online";
  });
}

setupHandlers();
initializeSocketClient();
registerSocketListeners();
