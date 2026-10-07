/* ===================================
   ConnecFriend - Auth Module
   Shared across all pages (except login)
   =================================== */

// ===== Auth Guard =====
function requireAuth() {
    const userId = getCurrentUserId();
    if (!userId) {
        window.location.href = 'index.html';
        return null;
    }
    const user = getUserById(userId);
    if (!user) {
        clearCurrentUser();
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// ===== Setup Navbar (called on every authenticated page) =====
function setupNavbar(currentUser) {
    // Avatar
    const navAvatar = document.getElementById('navAvatar');
    if (navAvatar) navAvatar.src = currentUser.avatar;

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Update last login and set offline
            const user = getUserById(currentUser.id);
            user.online = false;
            user.lastLogin = new Date().toISOString();
            updateUser(user);
            clearCurrentUser();
            window.location.href = 'index.html';
        });
    }

    // Reset Data
    const resetDataBtn = document.getElementById('resetDataBtn');
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Reset all demo data back to default initial state?')) {
                resetDemoData();
                window.location.reload();
            }
        });
    }

    // Unread message badge
    updateMsgBadge(currentUser.id);

    // Search
    setupSearch(currentUser);
}

// ===== Message Badge =====
function updateMsgBadge(userId) {
    const messages = getMessages();
    const unread = messages.filter(m => m.receiverId === userId && !m.read).length;
    const badge = document.getElementById('msgBadge');
    if (badge) {
        if (unread > 0) {
            badge.textContent = unread > 9 ? '9+' : unread;
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    }
}

// ===== Global Search =====
function setupSearch(currentUser) {
    const searchInput = document.getElementById('userSearch');
    const searchResults = document.getElementById('searchResults');
    if (!searchInput || !searchResults) return;

    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.classList.add('d-none');
                searchResults.innerHTML = '';
                return;
            }

            const users = getUsers().filter(u =>
                u.id !== currentUser.id &&
                (u.fullName.toLowerCase().includes(query) || u.username.toLowerCase().includes(query))
            );

            if (users.length === 0) {
                searchResults.innerHTML = '<div class="p-3 text-center text-muted small">No users found</div>';
            } else {
                searchResults.innerHTML = users.map(u => `
                    <a href="profile.html?user=${u.id}" class="search-result-item">
                        <img src="${u.avatar}" alt="${u.fullName}">
                        <div>
                            <div class="fw-semibold" style="font-size:0.88rem;">${u.fullName}</div>
                            <small class="text-muted">@${u.username}</small>
                        </div>
                    </a>
                `).join('');
            }
            searchResults.classList.remove('d-none');
        }, 250);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('d-none');
        }
    });
}
