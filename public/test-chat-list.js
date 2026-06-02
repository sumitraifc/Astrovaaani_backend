let currentChats = [];

function log(msg) {
    const logs = document.getElementById("logs");
    logs.innerHTML += msg + "<br>";
    logs.scrollTop = logs.scrollHeight;
    console.log(msg);
}

const socket = io({
    transports: ["websocket"]
});

socket.on("connect", () => {
    log("✅ SOCKET CONNECTED");
    log("Socket ID : " + socket.id);
});

socket.on("disconnect", (reason) => {
    log("❌ DISCONNECTED : " + reason);
});

socket.on("connect_error", (err) => {
    log("❌ CONNECT ERROR : " + err.message);
});

socket.on("receive_message", (data) => {
    log("💬 NEW MESSAGE: " + JSON.stringify(data));
});

socket.on("wallet_updated", (data) => {
    log("💰 WALLET UPDATE: " + JSON.stringify(data));
});

socket.on("chat_ended", (data) => {
    log("🚫 CHAT ENDED: " + JSON.stringify(data));
});

socket.on("chat_list_update", (payload) => {
    log("🔄 CHAT LIST UPDATE: " + JSON.stringify(payload));

    if (!payload) {
        return;
    }

    if (payload.type === "update_single" && payload.data) {
        updateChatListEntry(payload.data);
        log("✅ Updated single chat item");
        return;
    }

    if (payload.type === "update_all" && Array.isArray(payload.data)) {
        renderChats(payload.data);
        log("✅ Replaced full chat list");
        return;
    }

    if (Array.isArray(payload)) {
        renderChats(payload);
        log("✅ Replaced full chat list from array payload");
        return;
    }
});

function formatTime(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
}

function renderChats(data) {
    currentChats = Array.isArray(data) ? data.slice() : [];
    const container = document.getElementById("chatList");
    container.innerHTML = "";

    currentChats.forEach(chat => {
        const image = chat.profile_image
            ? chat.profile_image
            : "https://ui-avatars.com/api/?name=" + encodeURIComponent(chat.user_name);

        container.innerHTML += `
            <div class="chat-item" data-conversation-id="${chat.conversation_id}">
                <img src="${image}" />
                <div class="chat-content">
                    <div class="name">${chat.user_name}</div>
                    <div class="last-message">${chat.last_message || "No Message"}</div>
                    <div class="time">${formatTime(chat.message_time)}</div>
                    <div>${chat.is_user_online == 1 ? '<span class="online">🟢 Online</span>' : '<span class="offline">⚫ Offline</span>'}</div>
                    <small>${chat.conversation_id}</small>
                </div>
                ${chat.unread_count > 0 ? `<div class="unread">${chat.unread_count}</div>` : ""}
            </div>
        `;
    });
}

function updateChatListEntry(updatedConversation) {
    const idx = currentChats.findIndex(chat => chat.conversation_id == updatedConversation.conversation_id);
    if (idx === -1) {
        currentChats.unshift(updatedConversation);
    } else {
        currentChats[idx] = Object.assign({}, currentChats[idx], updatedConversation);
    }
    renderChats(currentChats);
}

function loadChats() {
    const astrologer_id = Number(document.getElementById("astrologerId").value);
    log("--------------------------------");
    log("🚀 LOAD CHATS CLICKED");
    log("Astrologer ID : " + astrologer_id);
    log("Socket Connected : " + socket.connected);

    socket.emit(
        "astrologer_chat_list",
        { astrologer_id },
        (response) => {
            log("SERVER RESPONSE RECEIVED");
            if (!response) {
                log("❌ No response from server");
                return;
            }

            if (!response.success) {
                log("❌ ERROR: " + response.message);
                return;
            }

            log("🔥 TOTAL CHATS: " + response.total);
            renderChats(response.data);
        }
    );
}

function setupEvents() {
    document.getElementById("loadChatsBtn").addEventListener("click", loadChats);
}

window.addEventListener("DOMContentLoaded", setupEvents);
