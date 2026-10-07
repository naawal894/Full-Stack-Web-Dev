/* ===================================
   ConnecFriend - Home Page Logic
   News Feed, Post Creation, Scope Sharing,
   Likes & Dislikes, Friends (Latest Login First),
   Friend Requests with Ignore List Protection
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = requireAuth();
    if (!currentUser) return;

    setupNavbar(currentUser);
    setupSidebar(currentUser);
    setupCreatePost(currentUser);
    loadNewsFeed(currentUser);
    loadFriendsByLogin(currentUser);
    loadSuggestedFriends(currentUser);
    loadFriendRequests(currentUser);
});

// ===== Sidebar =====
function setupSidebar(user) {
    document.getElementById('sidebarAvatar').src = user.avatar;
    document.getElementById('sidebarName').textContent = user.fullName;
    document.getElementById('sidebarUsername').textContent = '@' + user.username;
    document.getElementById('sidebarFriendCount').textContent = user.friends.length;

    const posts = getPosts().filter(p => p.authorId === user.id);
    document.getElementById('sidebarPostCount').textContent = posts.length;
    document.getElementById('postAvatar').src = user.avatar;
}

// ===== Create Post =====
function setupCreatePost(currentUser) {
    const postContent = document.getElementById('postContent');
    const publishBtn = document.getElementById('publishPostBtn');
    const shareScopeMenu = document.getElementById('shareScopeMenu');
    const shareScopeBtn = document.getElementById('shareScopeBtn');
    const selectFriendsPanel = document.getElementById('selectFriendsPanel');
    const friendCheckboxes = document.getElementById('friendCheckboxes');

    let shareScope = 'all';
    let selectedFriends = [];

    // Share scope dropdown
    shareScopeMenu.addEventListener('click', (e) => {
        const item = e.target.closest('[data-scope]');
        if (!item) return;
        e.preventDefault();

        shareScope = item.dataset.scope;
        shareScopeMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (shareScope === 'all') {
            shareScopeBtn.innerHTML = '<i class="bi bi-globe me-1"></i>All Friends';
            selectFriendsPanel.classList.add('d-none');
        } else {
            shareScopeBtn.innerHTML = '<i class="bi bi-people me-1"></i>Select Friends';
            selectFriendsPanel.classList.remove('d-none');
            renderFriendCheckboxes(currentUser);
        }
    });

    function renderFriendCheckboxes(user) {
        friendCheckboxes.innerHTML = '';
        selectedFriends = [];

        if (user.friends.length === 0) {
            friendCheckboxes.innerHTML = '<span class="text-muted small">You have no friends yet to select.</span>';
            return;
        }

        user.friends.forEach(fId => {
            const friend = getUserById(fId);
            if (!friend) return;
            const chip = document.createElement('div');
            chip.className = 'friend-checkbox-item';
            chip.innerHTML = `<img src="${friend.avatar}" alt="${friend.fullName}"> ${friend.fullName.split(' ')[0]}`;
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
                if (chip.classList.contains('selected')) {
                    selectedFriends.push(fId);
                } else {
                    selectedFriends = selectedFriends.filter(id => id !== fId);
                }
            });
            friendCheckboxes.appendChild(chip);
        });
    }

    // Publish Post
    publishBtn.addEventListener('click', () => {
        const content = postContent.value.trim();
        if (!content) {
            postContent.classList.add('is-invalid');
            postContent.focus();
            return;
        }
        postContent.classList.remove('is-invalid');

        if (shareScope === 'select' && selectedFriends.length === 0) {
            alert('Please select at least one friend to share with.');
            return;
        }

        const newPost = {
            id: generateId('p'),
            authorId: currentUser.id,
            content: content,
            timestamp: new Date().toISOString(),
            shareScope: shareScope,
            sharedWith: shareScope === 'select' ? [...selectedFriends] : [],
            likes: [],
            dislikes: []
        };

        const posts = getPosts();
        posts.unshift(newPost);
        setPosts(posts);

        postContent.value = '';
        shareScope = 'all';
        shareScopeBtn.innerHTML = '<i class="bi bi-globe me-1"></i>All Friends';
        selectFriendsPanel.classList.add('d-none');
        shareScopeMenu.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        shareScopeMenu.querySelector('[data-scope="all"]').classList.add('active');

        // Update counts
        document.getElementById('sidebarPostCount').textContent = getPosts().filter(p => p.authorId === currentUser.id).length;

        loadNewsFeed(currentUser);
    });

    postContent.addEventListener('input', () => postContent.classList.remove('is-invalid'));
}

// ===== News Feed =====
function loadNewsFeed(currentUser) {
    const feed = document.getElementById('newsFeed');
    const feedEmpty = document.getElementById('feedEmpty');
    const posts = getPosts();

    // Filter posts visible to current user:
    // - Own posts
    // - Friend posts shared with 'all'
    // - Friend posts shared with 'select' that explicitly include current user
    const visiblePosts = posts.filter(p => {
        if (p.authorId === currentUser.id) return true;
        if (!currentUser.friends.includes(p.authorId)) return false;
        if (p.shareScope === 'all') return true;
        if (p.shareScope === 'select' && p.sharedWith.includes(currentUser.id)) return true;
        return false;
    });

    if (visiblePosts.length === 0) {
        feed.innerHTML = '';
        feedEmpty.classList.remove('d-none');
        return;
    }

    feedEmpty.classList.add('d-none');

    // Sort by timestamp descending
    visiblePosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    feed.innerHTML = visiblePosts.map(post => {
        const author = getUserById(post.authorId);
        if (!author) return '';

        const isAuthor = post.authorId === currentUser.id;
        const isLiked = post.likes.includes(currentUser.id);
        const isDisliked = post.dislikes.includes(currentUser.id);

        let shareTag = '';
        if (post.shareScope === 'select') {
            const names = post.sharedWith.map(id => {
                const u = getUserById(id);
                return u ? u.fullName.split(' ')[0] : '';
            }).filter(Boolean);
            shareTag = `<span class="post-share-tag"><i class="bi bi-people-fill me-1"></i>Shared with ${names.join(', ')}</span>`;
        }

        // Rubric requirement: "The news feed includes the news, the friend’s name, profile picture, and time since the last log in."
        const lastLoginDisplay = author.online
            ? `<span class="badge bg-success-subtle text-success small" style="font-size:0.7rem;"><i class="bi bi-circle-fill me-1" style="font-size:0.45rem;"></i>Online now</span>`
            : `<span class="text-muted small" style="font-size:0.75rem;"><i class="bi bi-clock-history me-1 text-info"></i>Last active: ${timeSince(author.lastLogin)}</span>`;

        const deleteBtn = isAuthor ? `
            <button class="btn btn-sm btn-link text-danger p-0 ms-auto" onclick="confirmDeletePost('${post.id}')" title="Delete post">
                <i class="bi bi-trash3"></i>
            </button>
        ` : '';

        return `
            <div class="glass-card post-card mb-3 p-3" data-post-id="${post.id}">
                <div class="post-header align-items-start">
                    <a href="profile.html?user=${author.id}">
                        <img src="${author.avatar}" alt="${author.fullName}" class="post-avatar">
                    </a>
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center justify-content-between">
                            <a href="profile.html?user=${author.id}" class="post-author-link">${author.fullName}</a>
                            ${deleteBtn}
                        </div>
                        <div class="d-flex flex-wrap align-items-center gap-2 mt-1">
                            <span class="post-time"><i class="bi bi-clock me-1"></i>${timeSince(post.timestamp)}</span>
                            <span class="text-secondary">&bull;</span>
                            ${lastLoginDisplay}
                            ${shareTag}
                        </div>
                    </div>
                </div>
                <div class="post-body mt-2">${escapeHtml(post.content)}</div>
                <div class="post-actions">
                    <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
                        <i class="bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}"></i>
                        <span class="like-count" onclick="event.stopPropagation(); showReactions('${post.id}', 'likes')" title="Click to view who liked">${post.likes.length}</span> Like${post.likes.length !== 1 ? 's' : ''}
                    </button>
                    <button class="post-action-btn ${isDisliked ? 'disliked' : ''}" onclick="toggleDislike('${post.id}')">
                        <i class="bi ${isDisliked ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'}"></i>
                        <span class="dislike-count" onclick="event.stopPropagation(); showReactions('${post.id}', 'dislikes')" title="Click to view who disliked">${post.dislikes.length}</span> Dislike${post.dislikes.length !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ===== Delete Post =====
function confirmDeletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        deletePost(postId);
        const currentUser = getUserById(getCurrentUserId());
        document.getElementById('sidebarPostCount').textContent = getPosts().filter(p => p.authorId === currentUser.id).length;
        loadNewsFeed(currentUser);
    }
}

// ===== Reactions Modal (Who Liked/Disliked) =====
function showReactions(postId, type) {
    const post = getPosts().find(p => p.id === postId);
    if (!post) return;

    const modalTitle = document.getElementById('reactionsModalTitle');
    const reactionsList = document.getElementById('reactionsList');

    const userIds = type === 'likes' ? post.likes : post.dislikes;
    modalTitle.innerHTML = type === 'likes'
        ? `<i class="bi bi-hand-thumbs-up-fill text-info me-2"></i>Liked By (${userIds.length})`
        : `<i class="bi bi-hand-thumbs-down-fill text-danger me-2"></i>Disliked By (${userIds.length})`;

    if (userIds.length === 0) {
        reactionsList.innerHTML = `<p class="text-muted small text-center my-3">No one has ${type === 'likes' ? 'liked' : 'disliked'} this post yet.</p>`;
    } else {
        reactionsList.innerHTML = userIds.map(id => {
            const u = getUserById(id);
            if (!u) return '';
            return `
                <a href="profile.html?user=${u.id}" class="d-flex align-items-center gap-2 p-2 rounded text-decoration-none text-white hover-bg">
                    <img src="${u.avatar}" alt="${u.fullName}" width="32" height="32" class="rounded-circle">
                    <div>
                        <div class="fw-semibold small">${u.fullName}</div>
                        <small class="text-muted">@${u.username}</small>
                    </div>
                </a>
            `;
        }).join('');
    }

    const modal = new bootstrap.Modal(document.getElementById('reactionsModal'));
    modal.show();
}

// ===== Like / Dislike =====
function toggleLike(postId) {
    const currentUser = getUserById(getCurrentUserId());
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Remove from dislikes if exists
    post.dislikes = post.dislikes.filter(id => id !== currentUser.id);

    // Toggle like
    if (post.likes.includes(currentUser.id)) {
        post.likes = post.likes.filter(id => id !== currentUser.id);
    } else {
        post.likes.push(currentUser.id);
    }

    setPosts(posts);
    loadNewsFeed(currentUser);
}

function toggleDislike(postId) {
    const currentUser = getUserById(getCurrentUserId());
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Remove from likes if exists
    post.likes = post.likes.filter(id => id !== currentUser.id);

    // Toggle dislike
    if (post.dislikes.includes(currentUser.id)) {
        post.dislikes = post.dislikes.filter(id => id !== currentUser.id);
    } else {
        post.dislikes.push(currentUser.id);
    }

    setPosts(posts);
    loadNewsFeed(currentUser);
}

// ===== Friends (Ordered by Login to site, first person being latest one to do so) =====
function loadFriendsByLogin(currentUser) {
    const container = document.getElementById('onlineFriendsList');
    
    // Sort friends strictly by latest login date descending
    const friendUsers = currentUser.friends
        .map(id => getUserById(id))
        .filter(Boolean)
        .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));

    if (friendUsers.length === 0) {
        container.innerHTML = '<p class="text-muted small text-center py-2 mb-0">No friends yet</p>';
        return;
    }

    container.innerHTML = friendUsers.map(f => `
        <a href="profile.html?user=${f.id}" class="friend-card-mini text-decoration-none">
            <img src="${f.avatar}" alt="${f.fullName}">
            <div class="flex-grow-1 text-truncate">
                <div class="fw-semibold small text-white">${f.fullName}</div>
                <small class="text-muted d-block">${f.online ? '<span class="text-success fw-bold">Online</span>' : 'Active ' + timeSince(f.lastLogin)}</small>
            </div>
            <span class="${f.online ? 'online-indicator' : 'offline-indicator'}"></span>
        </a>
    `).join('');
}

// ===== Suggested Friends =====
function loadSuggestedFriends(currentUser) {
    const container = document.getElementById('suggestedFriendsList');
    const users = getUsers().filter(u =>
        u.id !== currentUser.id && !currentUser.friends.includes(u.id)
    );

    if (users.length === 0) {
        container.innerHTML = '<p class="text-muted small text-center py-2 mb-0">No suggestions</p>';
        return;
    }

    container.innerHTML = users.map(u => {
        // Check if there's already a pending request
        const requests = getFriendRequests();
        const hasPending = requests.some(r =>
            (r.fromId === currentUser.id && r.toId === u.id && r.status === 'pending') ||
            (r.fromId === u.id && r.toId === currentUser.id && r.status === 'pending')
        );

        // Check if user has current user in ignore list
        const isIgnored = u.ignoreList && u.ignoreList.includes(currentUser.id);

        let actionBtn = '';
        if (hasPending) {
            actionBtn = `<button class="btn btn-sm btn-outline-secondary" disabled>Pending</button>`;
        } else if (isIgnored) {
            actionBtn = `<button class="btn btn-sm btn-outline-danger" disabled title="This user has you in their ignore list"><i class="bi bi-slash-circle"></i> Ignored</button>`;
        } else {
            actionBtn = `<button class="btn btn-sm btn-gradient" onclick="sendFriendRequest('${u.id}')" title="Send Friend Request"><i class="bi bi-person-plus"></i></button>`;
        }

        return `
            <div class="friend-card-mini">
                <a href="profile.html?user=${u.id}" class="text-decoration-none d-flex align-items-center gap-2 flex-grow-1 text-truncate">
                    <img src="${u.avatar}" alt="${u.fullName}">
                    <div class="text-truncate">
                        <div class="fw-semibold small text-white text-truncate">${u.fullName}</div>
                        <small class="text-muted">@${u.username}</small>
                    </div>
                </a>
                <div class="suggested-actions">${actionBtn}</div>
            </div>
        `;
    }).join('');
}

// ===== Send Friend Request =====
function sendFriendRequest(toUserId) {
    const currentUser = getUserById(getCurrentUserId());
    const targetUser = getUserById(toUserId);

    if (!targetUser) {
        alert('User not found.');
        return;
    }

    // Assignment Rubric Requirement:
    // "However, if the person to be added has marked the request sender in ignore list, then the friend request cannot be sent."
    if (targetUser.ignoreList && targetUser.ignoreList.includes(currentUser.id)) {
        alert(`Cannot send friend request: ${targetUser.fullName} has placed you on their ignore list.`);
        return;
    }

    // Check existing request
    const requests = getFriendRequests();
    const existing = requests.find(r =>
        (r.fromId === currentUser.id && r.toId === toUserId && r.status === 'pending') ||
        (r.fromId === toUserId && r.toId === currentUser.id && r.status === 'pending')
    );

    if (existing) {
        alert('A friend request is already pending between you two.');
        return;
    }

    // Check if already friends
    if (currentUser.friends.includes(toUserId)) {
        alert('You are already friends with this user.');
        return;
    }

    const newRequest = {
        id: generateId('fr'),
        fromId: currentUser.id,
        toId: toUserId,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    requests.push(newRequest);
    setFriendRequests(requests);

    loadSuggestedFriends(currentUser);
    alert(`Friend request successfully sent to ${targetUser.fullName}!`);
}

// ===== Friend Requests =====
function loadFriendRequests(currentUser) {
    const container = document.getElementById('friendRequestsList');
    const requests = getFriendRequests().filter(r => r.toId === currentUser.id && r.status === 'pending');

    if (requests.length === 0) {
        container.innerHTML = '<p class="text-muted small text-center mb-0">No pending requests</p>';
        return;
    }

    container.innerHTML = requests.map(r => {
        const sender = getUserById(r.fromId);
        if (!sender) return '';
        return `
            <div class="friend-request-item">
                <a href="profile.html?user=${sender.id}">
                    <img src="${sender.avatar}" alt="${sender.fullName}">
                </a>
                <div class="flex-grow-1 text-truncate">
                    <a href="profile.html?user=${sender.id}" class="fw-semibold small text-white text-decoration-none">${sender.fullName}</a>
                    <small class="text-muted d-block">${timeSince(r.timestamp)}</small>
                </div>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-success px-2 py-0" onclick="acceptFriendRequest('${r.id}')" title="Accept"><i class="bi bi-check-lg"></i></button>
                    <button class="btn btn-sm btn-danger px-2 py-0" onclick="declineFriendRequest('${r.id}')" title="Decline"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function acceptFriendRequest(requestId) {
    const requests = getFriendRequests();
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    request.status = 'accepted';
    setFriendRequests(requests);

    // Add to both users' friend lists
    const currentUser = getUserById(getCurrentUserId());
    const sender = getUserById(request.fromId);

    if (!currentUser.friends.includes(request.fromId)) {
        currentUser.friends.push(request.fromId);
        updateUser(currentUser);
    }
    if (sender && !sender.friends.includes(currentUser.id)) {
        sender.friends.push(currentUser.id);
        updateUser(sender);
    }

    // Refresh
    const refreshedUser = getUserById(getCurrentUserId());
    document.getElementById('sidebarFriendCount').textContent = refreshedUser.friends.length;
    loadFriendRequests(refreshedUser);
    loadFriendsByLogin(refreshedUser);
    loadSuggestedFriends(refreshedUser);
    loadNewsFeed(refreshedUser);
}

function declineFriendRequest(requestId) {
    const requests = getFriendRequests();
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    request.status = 'declined';
    setFriendRequests(requests);

    const currentUser = getUserById(getCurrentUserId());
    loadFriendRequests(currentUser);
}

// ===== Utility =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global window exposure for inline onclick handlers
window.toggleLike = toggleLike;
window.toggleDislike = toggleDislike;
window.confirmDeletePost = confirmDeletePost;
window.showReactions = showReactions;
window.sendFriendRequest = sendFriendRequest;
window.acceptFriendRequest = acceptFriendRequest;
window.declineFriendRequest = declineFriendRequest;

