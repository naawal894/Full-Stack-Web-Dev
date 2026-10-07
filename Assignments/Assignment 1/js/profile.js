/* ===================================
   ConnecFriend - Profile Page Logic
   View own / other user's profile,
   Friends list, Ratings, Edit Profile,
   Ignore List management, Profile Posts
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = requireAuth();
    if (!currentUser) return;

    setupNavbar(currentUser);

    // Determine which profile to show
    const params = new URLSearchParams(window.location.search);
    const viewUserId = params.get('user') || currentUser.id;
    const viewUser = getUserById(viewUserId);

    if (!viewUser) {
        document.querySelector('.main-content').innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-person-x display-1 text-muted"></i>
                <h4 class="text-muted mt-3">User not found</h4>
                <a href="home.html" class="btn btn-gradient mt-3">Go Home</a>
            </div>
        `;
        return;
    }

    const isOwnProfile = viewUser.id === currentUser.id;

    loadProfileHeader(viewUser, currentUser, isOwnProfile);
    loadProfileInfo(viewUser);
    loadProfileFriends(viewUser, currentUser);
    loadProfilePosts(viewUser, currentUser);
    setupRatingModal(viewUser, currentUser);
    setupEditProfile(currentUser);
    setupIgnoreList(currentUser);
});

// ===== Profile Header =====
function loadProfileHeader(viewUser, currentUser, isOwnProfile) {
    document.getElementById('profileAvatar').src = viewUser.avatar;
    document.getElementById('profileFullName').textContent = viewUser.fullName;
    document.getElementById('profileUsernameDisplay').textContent = '@' + viewUser.username;
    document.getElementById('profileBio').textContent = viewUser.bio || 'No bio yet.';
    document.title = `ConnecFriend • ${viewUser.fullName}`;

    // Online dot
    const onlineDot = document.getElementById('profileOnlineDot');
    if (viewUser.online) {
        onlineDot.style.background = 'var(--cf-success)';
        onlineDot.title = 'Online';
    } else {
        onlineDot.style.background = 'var(--cf-text-muted)';
        onlineDot.title = 'Offline (Last seen: ' + timeSince(viewUser.lastLogin) + ')';
    }

    // Action Buttons
    const actionsDiv = document.getElementById('profileActions');
    actionsDiv.innerHTML = '';

    if (isOwnProfile) {
        actionsDiv.innerHTML = `
            <button class="btn btn-gradient" data-bs-toggle="modal" data-bs-target="#editProfileModal">
                <i class="bi bi-pencil-square me-1"></i>Edit Profile
            </button>
            <button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#ignoreListModal" title="Manage blocked users">
                <i class="bi bi-slash-circle me-1"></i>Ignore List (${currentUser.ignoreList ? currentUser.ignoreList.length : 0})
            </button>
        `;
        return;
    }

    const isFriend = currentUser.friends.includes(viewUser.id);
    const iHaveIgnoredThem = currentUser.ignoreList && currentUser.ignoreList.includes(viewUser.id);
    const theyHaveIgnoredMe = viewUser.ignoreList && viewUser.ignoreList.includes(currentUser.id);

    const blockBtn = iHaveIgnoredThem
        ? `<button class="btn btn-outline-warning" onclick="handleToggleIgnore('${viewUser.id}')"><i class="bi bi-check-circle me-1"></i>Unblock</button>`
        : `<button class="btn btn-outline-danger" onclick="handleToggleIgnore('${viewUser.id}')"><i class="bi bi-slash-circle me-1"></i>Block</button>`;

    if (isFriend) {
        // Find existing rating
        const rating = getRatings().find(r => r.fromId === currentUser.id && r.toId === viewUser.id);
        let ratingBadge = '';
        if (rating) {
            ratingBadge = `<span class="rating-badge rating-${rating.rating} ms-2 align-self-center">${getRatingIcon(rating.rating)} ${getRatingLabel(rating.rating)}</span>`;
        }

        actionsDiv.innerHTML = `
            <button class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#rateFriendModal">
                <i class="bi bi-star-fill me-1 text-warning"></i>Rate Friend
            </button>
            <a href="messages.html?chat=${viewUser.id}" class="btn btn-gradient">
                <i class="bi bi-chat-dots-fill me-1"></i>Message
            </a>
            <button class="btn btn-outline-secondary" onclick="handleUnfriend('${viewUser.id}')" title="Remove from friends">
                <i class="bi bi-person-dash me-1"></i>Unfriend
            </button>
            ${blockBtn}
            ${ratingBadge}
        `;
    } else {
        // Non-friend state
        const requests = getFriendRequests();
        const hasPending = requests.some(r =>
            ((r.fromId === currentUser.id && r.toId === viewUser.id) ||
             (r.fromId === viewUser.id && r.toId === currentUser.id)) &&
            r.status === 'pending'
        );

        let addFriendBtn = '';
        if (hasPending) {
            addFriendBtn = `<button class="btn btn-outline-secondary" disabled><i class="bi bi-clock me-1"></i>Request Pending</button>`;
        } else if (theyHaveIgnoredMe) {
            addFriendBtn = `<button class="btn btn-outline-danger" disabled title="You cannot add this user because you are on their ignore list"><i class="bi bi-slash-circle me-1"></i>In Ignore List</button>`;
        } else {
            addFriendBtn = `
                <button class="btn btn-gradient" onclick="sendRequestFromProfile('${viewUser.id}')">
                    <i class="bi bi-person-plus-fill me-1"></i>Add Friend
                </button>
            `;
        }

        actionsDiv.innerHTML = `
            ${addFriendBtn}
            <a href="messages.html?chat=${viewUser.id}" class="btn btn-outline-light">
                <i class="bi bi-chat-dots-fill me-1"></i>Message
            </a>
            ${blockBtn}
        `;
    }
}

// ===== Toggle Ignore / Block User =====
function handleToggleIgnore(targetUserId) {
    const currentUser = getUserById(getCurrentUserId());
    const target = getUserById(targetUserId);
    if (!target) return;

    const isNowIgnored = toggleIgnoreUser(currentUser.id, targetUserId);
    const updatedCurrent = getUserById(currentUser.id);

    alert(isNowIgnored
        ? `${target.fullName} has been added to your Ignore List. They can no longer send you friend requests.`
        : `${target.fullName} has been removed from your Ignore List.`
    );

    loadProfileHeader(target, updatedCurrent, false);
}

// ===== Unfriend User =====
function handleUnfriend(targetUserId) {
    const target = getUserById(targetUserId);
    if (!confirm(`Are you sure you want to remove ${target.fullName} from your friends?`)) return;

    removeFriend(getCurrentUserId(), targetUserId);
    const updatedCurrent = getUserById(getCurrentUserId());

    alert(`Removed ${target.fullName} from your friends.`);
    loadProfileHeader(target, updatedCurrent, false);
    loadProfileFriends(target, updatedCurrent);
}

// ===== Profile Info =====
function loadProfileInfo(viewUser) {
    document.getElementById('profileLocation').textContent = viewUser.location || 'Not specified';
    document.getElementById('profileWork').textContent = viewUser.work || 'Not specified';
    document.getElementById('profileEducation').textContent = viewUser.education || 'Not specified';
    document.getElementById('profileJoined').textContent = new Date(viewUser.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ===== Profile Friends =====
function loadProfileFriends(viewUser, currentUser) {
    const container = document.getElementById('profileFriendsList');
    const countBadge = document.getElementById('profileFriendCount');
    countBadge.textContent = viewUser.friends.length;

    if (viewUser.friends.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted small text-center my-3">No friends yet</p></div>';
        return;
    }

    container.innerHTML = viewUser.friends.map(fId => {
        const friend = getUserById(fId);
        if (!friend) return '';

        // Show rating badge if the viewed user has rated this friend
        const rating = getRatings().find(r => r.fromId === viewUser.id && r.toId === fId);
        let ratingBadge = '';
        if (rating) {
            ratingBadge = `<span class="rating-badge rating-${rating.rating} mt-1">${getRatingIcon(rating.rating)}</span>`;
        }

        return `
            <div class="col-4">
                <a href="profile.html?user=${friend.id}" class="profile-friend-tile">
                    <img src="${friend.avatar}" alt="${friend.fullName}">
                    <span class="text-truncate w-100 text-center">${friend.fullName.split(' ')[0]}</span>
                    ${ratingBadge}
                </a>
            </div>
        `;
    }).join('');
}

// ===== Profile Posts =====
function loadProfilePosts(viewUser, currentUser) {
    const container = document.getElementById('profilePosts');
    const emptyState = document.getElementById('profilePostsEmpty');
    const posts = getPosts().filter(p => p.authorId === viewUser.id);

    // Filter visibility
    const visiblePosts = posts.filter(p => {
        if (viewUser.id === currentUser.id) return true;
        if (p.shareScope === 'all') return true;
        if (p.shareScope === 'select' && p.sharedWith.includes(currentUser.id)) return true;
        return false;
    });

    if (visiblePosts.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }

    emptyState.classList.add('d-none');
    visiblePosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = visiblePosts.map(post => {
        const isLiked = post.likes.includes(currentUser.id);
        const isDisliked = post.dislikes.includes(currentUser.id);
        const isAuthor = post.authorId === currentUser.id;

        let shareTag = '';
        if (post.shareScope === 'select') {
            const names = post.sharedWith.map(id => {
                const u = getUserById(id);
                return u ? u.fullName.split(' ')[0] : '';
            }).filter(Boolean);
            shareTag = `<span class="post-share-tag"><i class="bi bi-people-fill me-1"></i>Shared with ${names.join(', ')}</span>`;
        }

        const deleteBtn = isAuthor ? `
            <button class="btn btn-sm btn-link text-danger p-0 ms-auto" onclick="deleteProfilePost('${post.id}')" title="Delete post">
                <i class="bi bi-trash3"></i>
            </button>
        ` : '';

        return `
            <div class="glass-card post-card mb-3 p-3" data-post-id="${post.id}">
                <div class="post-header align-items-start">
                    <img src="${viewUser.avatar}" alt="${viewUser.fullName}" class="post-avatar">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center justify-content-between">
                            <span class="fw-bold">${viewUser.fullName}</span>
                            ${deleteBtn}
                        </div>
                        <div class="d-flex flex-wrap align-items-center gap-2 mt-1">
                            <span class="post-time"><i class="bi bi-clock me-1"></i>${timeSince(post.timestamp)}</span>
                            <span class="text-secondary">&bull;</span>
                            <span class="text-muted small"><i class="bi bi-clock-history me-1 text-info"></i>Last active: ${viewUser.online ? 'Online now' : timeSince(viewUser.lastLogin)}</span>
                            ${shareTag}
                        </div>
                    </div>
                </div>
                <div class="post-body mt-2">${escapeHtml(post.content)}</div>
                <div class="post-actions">
                    <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeProfile('${post.id}')">
                        <i class="bi ${isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}"></i>
                        <span class="like-count">${post.likes.length}</span> Like${post.likes.length !== 1 ? 's' : ''}
                    </button>
                    <button class="post-action-btn ${isDisliked ? 'disliked' : ''}" onclick="toggleDislikeProfile('${post.id}')">
                        <i class="bi ${isDisliked ? 'bi-hand-thumbs-down-fill' : 'bi-hand-thumbs-down'}"></i>
                        <span class="dislike-count">${post.dislikes.length}</span> Dislike${post.dislikes.length !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteProfilePost(postId) {
    if (confirm('Delete this post?')) {
        deletePost(postId);
        const currentUser = getUserById(getCurrentUserId());
        const params = new URLSearchParams(window.location.search);
        const viewUserId = params.get('user') || currentUser.id;
        const viewUser = getUserById(viewUserId);
        loadProfilePosts(viewUser, currentUser);
    }
}

// ===== Like / Dislike on Profile Page =====
function toggleLikeProfile(postId) {
    const currentUser = getUserById(getCurrentUserId());
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.dislikes = post.dislikes.filter(id => id !== currentUser.id);
    if (post.likes.includes(currentUser.id)) {
        post.likes = post.likes.filter(id => id !== currentUser.id);
    } else {
        post.likes.push(currentUser.id);
    }

    setPosts(posts);

    const params = new URLSearchParams(window.location.search);
    const viewUserId = params.get('user') || currentUser.id;
    const viewUser = getUserById(viewUserId);
    loadProfilePosts(viewUser, currentUser);
}

function toggleDislikeProfile(postId) {
    const currentUser = getUserById(getCurrentUserId());
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    post.likes = post.likes.filter(id => id !== currentUser.id);
    if (post.dislikes.includes(currentUser.id)) {
        post.dislikes = post.dislikes.filter(id => id !== currentUser.id);
    } else {
        post.dislikes.push(currentUser.id);
    }

    setPosts(posts);

    const params = new URLSearchParams(window.location.search);
    const viewUserId = params.get('user') || currentUser.id;
    const viewUser = getUserById(viewUserId);
    loadProfilePosts(viewUser, currentUser);
}

// ===== Rating Modal =====
function setupRatingModal(viewUser, currentUser) {
    document.getElementById('rateFriendName').textContent = viewUser.fullName;

    // Highlight existing rating
    const existingRating = getRatings().find(r => r.fromId === currentUser.id && r.toId === viewUser.id);
    const ratingBtns = document.querySelectorAll('.rating-btn');

    ratingBtns.forEach(btn => {
        const rVal = parseInt(btn.dataset.rating);
        if (existingRating && existingRating.rating === rVal) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', () => {
            saveRating(currentUser.id, viewUser.id, rVal);

            // Update UI
            ratingBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('rateFriendModal'));
                if (modal) modal.hide();
                loadProfileHeader(viewUser, currentUser, false);
                loadProfileFriends(viewUser, currentUser);
            }, 300);
        });
    });
}

// ===== Edit Profile Modal =====
function setupEditProfile(currentUser) {
    const form = document.getElementById('editProfileForm');
    const nameInput = document.getElementById('editFullName');
    const bioInput = document.getElementById('editBio');
    const locInput = document.getElementById('editLocation');
    const eduInput = document.getElementById('editEducation');
    const workInput = document.getElementById('editWork');

    if (!form) return;

    // Prefill form
    nameInput.value = currentUser.fullName || '';
    bioInput.value = currentUser.bio || '';
    locInput.value = currentUser.location || '';
    eduInput.value = currentUser.education || '';
    workInput.value = currentUser.work || '';

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedName = nameInput.value.trim();
        if (!updatedName) {
            alert('Full Name cannot be empty.');
            return;
        }

        const user = getUserById(currentUser.id);
        user.fullName = updatedName;
        user.bio = bioInput.value.trim();
        user.location = locInput.value.trim();
        user.education = eduInput.value.trim();
        user.work = workInput.value.trim();

        updateUser(user);

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        if (modal) modal.hide();

        // Refresh UI
        loadProfileHeader(user, user, true);
        loadProfileInfo(user);
        alert('Profile successfully updated and saved in local storage!');
    });
}

// ===== Ignore List Modal =====
function setupIgnoreList(currentUser) {
    const container = document.getElementById('ignoredUsersListContainer');
    if (!container) return;

    const list = currentUser.ignoreList || [];
    if (list.length === 0) {
        container.innerHTML = '<p class="text-muted small text-center my-3">Your ignore list is empty.</p>';
        return;
    }

    container.innerHTML = list.map(id => {
        const u = getUserById(id);
        if (!u) return '';
        return `
            <div class="d-flex justify-content-between align-items-center p-2 rounded mb-2" style="background:rgba(255,255,255,0.04)">
                <div class="d-flex align-items-center gap-2">
                    <img src="${u.avatar}" alt="${u.fullName}" width="32" height="32" class="rounded-circle">
                    <div>
                        <div class="fw-semibold small text-white">${u.fullName}</div>
                        <small class="text-muted">@${u.username}</small>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-warning" onclick="unblockFromModal('${u.id}')">
                    <i class="bi bi-unlock me-1"></i>Unblock
                </button>
            </div>
        `;
    }).join('');
}

function unblockFromModal(userId) {
    const currentUser = getUserById(getCurrentUserId());
    toggleIgnoreUser(currentUser.id, userId);
    const updatedUser = getUserById(currentUser.id);
    setupIgnoreList(updatedUser);
    loadProfileHeader(updatedUser, updatedUser, true);
}

// ===== Send Friend Request from Profile =====
function sendRequestFromProfile(toUserId) {
    const currentUser = getUserById(getCurrentUserId());
    const targetUser = getUserById(toUserId);

    if (!targetUser) {
        alert('User not found.');
        return;
    }

    // Ignore list check
    if (targetUser.ignoreList && targetUser.ignoreList.includes(currentUser.id)) {
        alert(`Cannot send friend request: ${targetUser.fullName} has placed you on their ignore list.`);
        return;
    }

    const requests = getFriendRequests();
    const existing = requests.find(r =>
        ((r.fromId === currentUser.id && r.toId === toUserId) ||
         (r.fromId === toUserId && r.toId === currentUser.id)) &&
        r.status === 'pending'
    );

    if (existing) {
        alert('A friend request already exists.');
        return;
    }

    if (currentUser.friends.includes(toUserId)) {
        alert('You are already friends.');
        return;
    }

    requests.push({
        id: generateId('fr'),
        fromId: currentUser.id,
        toId: toUserId,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    setFriendRequests(requests);

    alert(`Friend request sent to ${targetUser.fullName}!`);
    loadProfileHeader(targetUser, currentUser, false);
}

// ===== Escape HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global window exposure for inline onclick handlers
window.handleToggleIgnore = handleToggleIgnore;
window.handleUnfriend = handleUnfriend;
window.deleteProfilePost = deleteProfilePost;
window.toggleLikeProfile = toggleLikeProfile;
window.toggleDislikeProfile = toggleDislikeProfile;
window.unblockFromModal = unblockFromModal;
window.sendRequestFromProfile = sendRequestFromProfile;

