/* ===================================
   ConnecFriend - Data Layer (localStorage)
   Seed data + CRUD helpers
   =================================== */

const DB_KEYS = {
    USERS: 'cf_users',
    POSTS: 'cf_posts',
    MESSAGES: 'cf_messages',
    FRIEND_REQUESTS: 'cf_friend_requests',
    RATINGS: 'cf_ratings',
    CURRENT_USER: 'cf_current_user',
    INITIALIZED: 'cf_initialized'
};

// ===== Avatar Generator (SVG data URIs) =====
function generateAvatar(name, hue) {
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:hsl(${hue},70%,55%)"/>
                <stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360},70%,45%)"/>
            </linearGradient>
        </defs>
        <rect width="120" height="120" rx="60" fill="url(#g)"/>
        <text x="60" y="62" text-anchor="middle" dominant-baseline="central" fill="white" font-family="Inter,sans-serif" font-size="42" font-weight="700">${initials}</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// ===== Seed Data =====
function seedData() {
    if (localStorage.getItem(DB_KEYS.INITIALIZED)) return;

    const users = [
        {
            id: 'u1', username: 'ahmed_khan', password: 'pass123',
            fullName: 'Ahmed Khan', bio: 'Tech enthusiast & coffee lover ☕',
            location: 'Islamabad, Pakistan', work: 'Software Engineer at TechCorp',
            education: 'Air University', joinedDate: '2025-03-15',
            friends: ['u2', 'u3', 'u4', 'u6'],
            ignoreList: [],
            lastLogin: new Date(Date.now() - 2 * 60000).toISOString(),
            online: true
        },
        {
            id: 'u2', username: 'sara_ali', password: 'pass123',
            fullName: 'Sara Ali', bio: 'Digital artist & UI designer 🎨',
            location: 'Lahore, Pakistan', work: 'UI/UX Designer at DesignHub',
            education: 'LUMS', joinedDate: '2025-04-20',
            friends: ['u1', 'u3', 'u5'],
            ignoreList: ['u7'],
            lastLogin: new Date(Date.now() - 15 * 60000).toISOString(),
            online: true
        },
        {
            id: 'u3', username: 'omar_farooq', password: 'pass123',
            fullName: 'Omar Farooq', bio: 'Blockchain developer & gamer 🎮',
            location: 'Karachi, Pakistan', work: 'Blockchain Dev at ChainWorks',
            education: 'FAST-NUCES', joinedDate: '2025-01-10',
            friends: ['u1', 'u2', 'u4', 'u5', 'u7'],
            ignoreList: [],
            lastLogin: new Date(Date.now() - 60 * 60000).toISOString(),
            online: false
        },
        {
            id: 'u4', username: 'ayesha_nawaz', password: 'pass123',
            fullName: 'Ayesha Nawaz', bio: 'Data scientist & book worm 📚',
            location: 'Rawalpindi, Pakistan', work: 'Data Scientist at DataVerse',
            education: 'NUST', joinedDate: '2025-05-08',
            friends: ['u1', 'u3', 'u6'],
            ignoreList: ['u5'],
            lastLogin: new Date(Date.now() - 30 * 60000).toISOString(),
            online: true
        },
        {
            id: 'u5', username: 'zain_malik', password: 'pass123',
            fullName: 'Zain Malik', bio: 'Photographer & travel junkie ✈️',
            location: 'Peshawar, Pakistan', work: 'Freelance Photographer',
            education: 'UET Peshawar', joinedDate: '2025-06-22',
            friends: ['u2', 'u3'],
            ignoreList: [],
            lastLogin: new Date(Date.now() - 120 * 60000).toISOString(),
            online: false
        },
        {
            id: 'u6', username: 'fatima_hassan', password: 'pass123',
            fullName: 'Fatima Hassan', bio: 'Full-stack dev & fitness freak 💪',
            location: 'Islamabad, Pakistan', work: 'Full-Stack Dev at WebNova',
            education: 'Air University', joinedDate: '2025-02-14',
            friends: ['u1', 'u4'],
            ignoreList: [],
            lastLogin: new Date(Date.now() - 5 * 60000).toISOString(),
            online: true
        },
        {
            id: 'u7', username: 'bilal_ahmed', password: 'pass123',
            fullName: 'Bilal Ahmed', bio: 'Cybersecurity analyst 🔒',
            location: 'Faisalabad, Pakistan', work: 'Security Analyst at SecureNet',
            education: 'COMSATS', joinedDate: '2025-07-01',
            friends: ['u3'],
            ignoreList: [],
            lastLogin: new Date(Date.now() - 200 * 60000).toISOString(),
            online: false
        },
        {
            id: 'u8', username: 'hina_raza', password: 'pass123',
            fullName: 'Hina Raza', bio: 'Marketing guru & foodie 🍕',
            location: 'Multan, Pakistan', work: 'Marketing Manager at BrandX',
            education: 'BZU Multan', joinedDate: '2025-08-10',
            friends: [],
            ignoreList: ['u1'],
            lastLogin: new Date(Date.now() - 300 * 60000).toISOString(),
            online: false
        }
    ];

    // Generate avatars
    const hues = [250, 340, 160, 200, 30, 290, 100, 10];
    users.forEach((u, i) => {
        u.avatar = generateAvatar(u.fullName, hues[i]);
    });

    const now = Date.now();
    const posts = [
        {
            id: 'p1', authorId: 'u1', content: 'Just finished building a REST API with Node.js and Express. The feeling when all tests pass on the first try is unmatched! 🚀 #coding #nodejs',
            timestamp: new Date(now - 3600000).toISOString(),
            shareScope: 'all', sharedWith: [],
            likes: ['u2', 'u3', 'u6'], dislikes: ['u4']
        },
        {
            id: 'p2', authorId: 'u2', content: 'New design concept for a fintech app! Glassmorphism is still going strong in 2026. What do you guys think? 💎✨',
            timestamp: new Date(now - 7200000).toISOString(),
            shareScope: 'all', sharedWith: [],
            likes: ['u1', 'u3', 'u5'], dislikes: []
        },
        {
            id: 'p3', authorId: 'u3', content: 'Smart contracts on Ethereum have come so far. Just deployed my first DeFi protocol. The future is decentralized! 🔗',
            timestamp: new Date(now - 14400000).toISOString(),
            shareScope: 'all', sharedWith: [],
            likes: ['u1', 'u2', 'u5', 'u7'], dislikes: ['u4']
        },
        {
            id: 'p4', authorId: 'u4', content: 'Reading "Designing Data-Intensive Applications" for the third time. Each read reveals something new. Highly recommended for any engineer! 📖',
            timestamp: new Date(now - 21600000).toISOString(),
            shareScope: 'all', sharedWith: [],
            likes: ['u1', 'u6'], dislikes: []
        },
        {
            id: 'p5', authorId: 'u6', content: 'Hit a new PR at the gym today - 120kg deadlift! 💪 Consistency is key. Also, the new ConnecFriend UI is looking fire 🔥',
            timestamp: new Date(now - 28800000).toISOString(),
            shareScope: 'all', sharedWith: [],
            likes: ['u1', 'u4'], dislikes: ['u3']
        },
        {
            id: 'p6', authorId: 'u5', content: 'Golden hour at Hunza Valley. Pakistan is truly one of the most beautiful countries in the world. 🏔️📸',
            timestamp: new Date(now - 36000000).toISOString(),
            shareScope: 'all', sharedWith: [],
            likes: ['u2', 'u3'], dislikes: []
        },
        {
            id: 'p7', authorId: 'u1', content: 'Weekend plans: binge-watch a new series, order pizza, and maybe write some code. Living the dream! 😂🍕',
            timestamp: new Date(now - 43200000).toISOString(),
            shareScope: 'select', sharedWith: ['u2', 'u3'],
            likes: ['u2', 'u3'], dislikes: []
        },
        {
            id: 'p8', authorId: 'u7', content: 'Just found a critical vulnerability in a major platform. Responsible disclosure done. Bug bounty incoming! 🐛💰',
            timestamp: new Date(now - 50000000).toISOString(),
            shareScope: 'all', sharedWith: [],
            likes: ['u3'], dislikes: []
        }
    ];

    const messages = [
        {
            id: 'm1', senderId: 'u2', receiverId: 'u1',
            content: 'Hey Ahmed! Love your latest post about Node.js. Any tips for beginners?',
            timestamp: new Date(now - 1800000).toISOString(), read: true
        },
        {
            id: 'm2', senderId: 'u1', receiverId: 'u2',
            content: 'Thanks Sara! I\'d recommend starting with Express.js tutorials on YouTube. Happy to help!',
            timestamp: new Date(now - 1500000).toISOString(), read: true
        },
        {
            id: 'm3', senderId: 'u2', receiverId: 'u1',
            content: 'That would be awesome! Maybe we can collaborate on a project sometime? 🙌',
            timestamp: new Date(now - 1200000).toISOString(), read: false
        },
        {
            id: 'm4', senderId: 'u3', receiverId: 'u1',
            content: 'Bro, check out this new blockchain framework. It\'s insane!',
            timestamp: new Date(now - 3600000).toISOString(), read: false
        },
        {
            id: 'm5', senderId: 'u6', receiverId: 'u1',
            content: 'Are you coming to the Air University hackathon next week?',
            timestamp: new Date(now - 7200000).toISOString(), read: true
        },
        {
            id: 'm6', senderId: 'u1', receiverId: 'u6',
            content: 'Absolutely! Already registered. Let\'s form a team! 🤝',
            timestamp: new Date(now - 7000000).toISOString(), read: true
        },
        {
            id: 'm7', senderId: 'u5', receiverId: 'u3',
            content: 'Omar, the photos from the meetup turned out great! Check your email.',
            timestamp: new Date(now - 9000000).toISOString(), read: true
        }
    ];

    const friendRequests = [
        { id: 'fr1', fromId: 'u5', toId: 'u1', timestamp: new Date(now - 86400000).toISOString(), status: 'pending' },
        { id: 'fr2', fromId: 'u7', toId: 'u1', timestamp: new Date(now - 172800000).toISOString(), status: 'pending' }
    ];

    const ratings = [
        { fromId: 'u1', toId: 'u2', rating: 3 },
        { fromId: 'u1', toId: 'u3', rating: 2 },
        { fromId: 'u2', toId: 'u1', rating: 3 },
        { fromId: 'u3', toId: 'u1', rating: 2 },
        { fromId: 'u4', toId: 'u1', rating: 3 }
    ];

    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(DB_KEYS.POSTS, JSON.stringify(posts));
    localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(messages));
    localStorage.setItem(DB_KEYS.FRIEND_REQUESTS, JSON.stringify(friendRequests));
    localStorage.setItem(DB_KEYS.RATINGS, JSON.stringify(ratings));
    localStorage.setItem(DB_KEYS.INITIALIZED, 'true');
}

// ===== CRUD Helpers =====
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        console.error('Error reading localStorage key:', key, e);
        return [];
    }
}

function setData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Error writing localStorage key:', key, e);
    }
}

function getUsers() { return getData(DB_KEYS.USERS); }
function setUsers(users) { setData(DB_KEYS.USERS, users); }

function getUserById(id) {
    return getUsers().find(u => u.id === id) || null;
}

function getUserByUsername(username) {
    return getUsers().find(u => u.username === username) || null;
}

function updateUser(updatedUser) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
        users[idx] = updatedUser;
        setUsers(users);
    }
}

function getPosts() { return getData(DB_KEYS.POSTS); }
function setPosts(posts) { setData(DB_KEYS.POSTS, posts); }

function getMessages() { return getData(DB_KEYS.MESSAGES); }
function setMessages(msgs) { setData(DB_KEYS.MESSAGES, msgs); }

function getFriendRequests() { return getData(DB_KEYS.FRIEND_REQUESTS); }
function setFriendRequests(reqs) { setData(DB_KEYS.FRIEND_REQUESTS, reqs); }

function getRatings() { return getData(DB_KEYS.RATINGS); }
function setRatings(ratings) { setData(DB_KEYS.RATINGS, ratings); }

function getCurrentUserId() {
    return localStorage.getItem(DB_KEYS.CURRENT_USER);
}

function setCurrentUserId(id) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, id);
}

function clearCurrentUser() {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
}

// ===== Utility =====
function generateId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

function timeSince(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getRatingLabel(rating) {
    const labels = { 1: 'Stupid', 2: 'Cool', 3: 'Trustworthy' };
    return labels[rating] || '';
}

function getRatingIcon(rating) {
    const icons = {
        1: '<i class="bi bi-emoji-frown-fill text-danger"></i>',
        2: '<i class="bi bi-emoji-sunglasses-fill text-info"></i>',
        3: '<i class="bi bi-emoji-heart-eyes-fill text-warning"></i>'
    };
    return icons[rating] || '';
}

// ===== Extended Helper Methods for Full Interactivity =====
function deletePost(postId) {
    const posts = getPosts().filter(p => p.id !== postId);
    setPosts(posts);
}

function removeFriend(userId1, userId2) {
    const users = getUsers();
    const u1 = users.find(u => u.id === userId1);
    const u2 = users.find(u => u.id === userId2);
    if (u1 && u1.friends) u1.friends = u1.friends.filter(id => id !== userId2);
    if (u2 && u2.friends) u2.friends = u2.friends.filter(id => id !== userId1);
    setUsers(users);
}

function toggleIgnoreUser(currentUserId, targetUserId) {
    const users = getUsers();
    const user = users.find(u => u.id === currentUserId);
    if (!user) return false;
    if (!user.ignoreList) user.ignoreList = [];
    const isIgnored = user.ignoreList.includes(targetUserId);
    if (isIgnored) {
        user.ignoreList = user.ignoreList.filter(id => id !== targetUserId);
    } else {
        user.ignoreList.push(targetUserId);
    }
    setUsers(users);
    return !isIgnored; // true if now ignored, false if unignored
}

function saveRating(fromId, toId, ratingVal) {
    const ratings = getRatings();
    const idx = ratings.findIndex(r => r.fromId === fromId && r.toId === toId);
    if (idx !== -1) {
        ratings[idx].rating = ratingVal;
    } else {
        ratings.push({ fromId, toId, rating: ratingVal });
    }
    setRatings(ratings);
}

function resetDemoData() {
    localStorage.removeItem(DB_KEYS.INITIALIZED);
    localStorage.removeItem(DB_KEYS.USERS);
    localStorage.removeItem(DB_KEYS.POSTS);
    localStorage.removeItem(DB_KEYS.MESSAGES);
    localStorage.removeItem(DB_KEYS.FRIEND_REQUESTS);
    localStorage.removeItem(DB_KEYS.RATINGS);
    seedData();
}

// ===== Initialize =====
seedData();

