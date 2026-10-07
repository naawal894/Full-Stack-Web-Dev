/* ===================================
   ConnecFriend - Messages Page Logic
   Private messaging between any members
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = requireAuth();
    if (!currentUser) return;

    setupNavbar(currentUser);
    loadConversations(currentUser);
    setupNewConversation(currentUser);
    setupMessageForm(currentUser);
    setupConversationSearch();

    // Check for direct chat link
    const params = new URLSearchParams(window.location.search);
    const chatWith = params.get('chat');
    if (chatWith) {
        openChat(chatWith, currentUser);
    }

    // Mobile back button
    document.getElementById('backToConvos').addEventListener('click', () => {
        document.getElementById('chatActive').classList.add('d-none');
        document.getElementById('chatEmpty').classList.remove('d-none');
        document.getElementById('conversationsPanel').classList.remove('d-none-mobile');
    });
});

let activeChatUserId = null;

// ===== Load Conversations =====
function loadConversations(currentUser) {
    const container = document.getElementById('conversationList');
    const messages = getMessages();

    // Get unique conversation partners
    const partnerIds = new Set();
    messages.forEach(m => {
        if (m.senderId === currentUser.id) partnerIds.add(m.receiverId);
        if (m.receiverId === currentUser.id) partnerIds.add(m.senderId);
    });

    if (partnerIds.size === 0) {
        container.innerHTML = '<div class="p-3 text-center text-muted small">No conversations yet</div>';
        return;
    }

    // Build conversation list
    const conversations = Array.from(partnerIds).map(partnerId => {
        const partner = getUserById(partnerId);
        if (!partner) return null;

        const convoMessages = messages.filter(m =>
            (m.senderId === currentUser.id && m.receiverId === partnerId) ||
            (m.senderId === partnerId && m.receiverId === currentUser.id)
        ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const lastMsg = convoMessages[0];
        const unreadCount = convoMessages.filter(m => m.receiverId === currentUser.id && !m.read).length;

        return {
            partnerId,
            partner,
            lastMsg,
            unreadCount,
            lastTimestamp: lastMsg ? new Date(lastMsg.timestamp) : new Date(0)
        };
    }).filter(Boolean).sort((a, b) => b.lastTimestamp - a.lastTimestamp);

    container.innerHTML = conversations.map(c => {
        const isActive = activeChatUserId === c.partnerId;
        const preview = c.lastMsg
            ? (c.lastMsg.senderId === currentUser.id ? 'You: ' : '') + truncate(c.lastMsg.content, 30)
            : '';

        return `
            <div class="conversation-item ${isActive ? 'active' : ''}" data-partner-id="${c.partnerId}" onclick="openChat('${c.partnerId}')">
                <img src="${c.partner.avatar}" alt="${c.partner.fullName}">
                <div class="convo-info">
                    <div class="convo-name">${c.partner.fullName}</div>
                    <div class="convo-preview">${escapeHtmlMsg(preview)}</div>
                </div>
                <div class="d-flex flex-column align-items-end gap-1">
                    <span class="convo-time">${c.lastMsg ? timeSince(c.lastMsg.timestamp) : ''}</span>
                    ${c.unreadCount > 0 ? `<span class="unread-dot"></span>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ===== Open Chat =====
function openChat(partnerId, currentUserOverride) {
    const currentUser = currentUserOverride || getUserById(getCurrentUserId());
    const partner = getUserById(partnerId);
    if (!partner) return;

    activeChatUserId = partnerId;

    // Show chat panel
    document.getElementById('chatEmpty').classList.add('d-none');
    document.getElementById('chatActive').classList.remove('d-none');

    // Mobile: hide conversation list
    if (window.innerWidth < 768) {
        document.getElementById('conversationsPanel').classList.add('d-none-mobile');
    }

    // Set header
    document.getElementById('chatAvatar').src = partner.avatar;
    document.getElementById('chatName').textContent = partner.fullName;
    document.getElementById('chatStatus').textContent = partner.online ? 'Online' : 'Last seen ' + timeSince(partner.lastLogin);

    // Mark messages as read
    const messages = getMessages();
    let changed = false;
    messages.forEach(m => {
        if (m.senderId === partnerId && m.receiverId === currentUser.id && !m.read) {
            m.read = true;
            changed = true;
        }
    });
    if (changed) {
        setMessages(messages);
        updateMsgBadge(currentUser.id);
    }

    // Load messages
    loadChatMessages(currentUser, partnerId);

    // Update active conversation in list
    loadConversations(currentUser);

    // Focus input
    document.getElementById('messageInput').focus();
}

// ===== Load Chat Messages =====
function loadChatMessages(currentUser, partnerId) {
    const container = document.getElementById('chatMessages');
    const messages = getMessages().filter(m =>
        (m.senderId === currentUser.id && m.receiverId === partnerId) ||
        (m.senderId === partnerId && m.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (messages.length === 0) {
        container.innerHTML = '<div class="text-center py-5 text-muted small">No messages yet. Start the conversation!</div>';
        return;
    }

    container.innerHTML = messages.map(m => {
        const isSent = m.senderId === currentUser.id;
        return `
            <div class="message-bubble ${isSent ? 'message-sent' : 'message-received'}">
                ${escapeHtmlMsg(m.content)}
                <span class="msg-time">${formatTime(m.timestamp)}</span>
            </div>
        `;
    }).join('');

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// ===== Send Message =====
function setupMessageForm(currentUser) {
    const form = document.getElementById('messageForm');
    const input = document.getElementById('messageInput');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = input.value.trim();
        if (!content || !activeChatUserId) return;

        const newMsg = {
            id: generateId('m'),
            senderId: currentUser.id,
            receiverId: activeChatUserId,
            content: content,
            timestamp: new Date().toISOString(),
            read: false
        };

        const messages = getMessages();
        messages.push(newMsg);
        setMessages(messages);

        input.value = '';
        loadChatMessages(currentUser, activeChatUserId);
        loadConversations(currentUser);
    });
}

// ===== New Conversation Modal =====
function setupNewConversation(currentUser) {
    const btn = document.getElementById('newConversationBtn');
    const searchInput = document.getElementById('newConvoSearch');
    const userList = document.getElementById('newConvoUserList');

    btn.addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('newConvoModal'));
        modal.show();
        loadNewConvoUsers(currentUser, '');
    });

    searchInput.addEventListener('input', () => {
        loadNewConvoUsers(currentUser, searchInput.value.trim().toLowerCase());
    });
}

function loadNewConvoUsers(currentUser, query) {
    const container = document.getElementById('newConvoUserList');
    let users = getUsers().filter(u => u.id !== currentUser.id);

    if (query) {
        users = users.filter(u =>
            u.fullName.toLowerCase().includes(query) || u.username.toLowerCase().includes(query)
        );
    }

    if (users.length === 0) {
        container.innerHTML = '<div class="text-center text-muted small py-3">No users found</div>';
        return;
    }

    container.innerHTML = users.map(u => {
        const isFriend = currentUser.friends.includes(u.id);
        return `
            <div class="user-select-item" onclick="startNewConvo('${u.id}')">
                <img src="${u.avatar}" alt="${u.fullName}">
                <div class="user-info">
                    <h6>${u.fullName}</h6>
                    <small>@${u.username} ${isFriend ? '• Friend' : ''}</small>
                </div>
                <i class="bi bi-chat-dots text-muted"></i>
            </div>
        `;
    }).join('');
}

function startNewConvo(userId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById('newConvoModal'));
    if (modal) modal.hide();
    openChat(userId);
}

// ===== Conversation Search =====
function setupConversationSearch() {
    const input = document.getElementById('conversationSearch');
    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const items = document.querySelectorAll('.conversation-item');
        items.forEach(item => {
            const name = item.querySelector('.convo-name').textContent.toLowerCase();
            item.style.display = name.includes(query) ? '' : 'none';
        });
    });
}

// ===== Utility =====
function truncate(str, len) {
    return str.length > len ? str.substring(0, len) + '...' : str;
}

function escapeHtmlMsg(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global window exposure for inline onclick handlers
window.openChat = openChat;
window.startNewConvo = startNewConvo;

