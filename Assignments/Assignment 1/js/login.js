/* ===================================
   ConnecFriend - Authentication Page Logic
   Login, Registration, Persistence (localStorage)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to home
    if (getCurrentUserId()) {
        window.location.href = 'home.html';
        return;
    }

    // ===== Tab elements & Switch Links =====
    const loginTabBtn = document.getElementById('loginTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');
    const goToRegisterLink = document.getElementById('goToRegisterLink');
    const goToLoginLink = document.getElementById('goToLoginLink');
    const forgotPassLink = document.getElementById('forgotPassLink');

    if (goToRegisterLink && registerTabBtn) {
        goToRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = new bootstrap.Tab(registerTabBtn);
            tab.show();
        });
    }

    if (goToLoginLink && loginTabBtn) {
        goToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = new bootstrap.Tab(loginTabBtn);
            tab.show();
        });
    }

    if (forgotPassLink) {
        forgotPassLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginError('Demo Hint: Pre-loaded accounts (ahmed_khan, sara_ali, omar_farooq, ayesha_nawaz) use password: pass123');
        });
    }

    // ===== LOGIN FORM ELEMENTS =====
    const loginForm = document.getElementById('loginForm');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const togglePassword = document.getElementById('togglePassword');
    const loginError = document.getElementById('loginError');
    const loginErrorMsg = document.getElementById('loginErrorMsg');
    const loginSuccess = document.getElementById('loginSuccess');
    const loginSuccessMsg = document.getElementById('loginSuccessMsg');
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');
    const quickLoginBtns = document.getElementById('quickLoginBtns');

    // ===== Toggle Password Visibility =====
    if (togglePassword && loginPasswordInput) {
        togglePassword.addEventListener('click', () => {
            const type = loginPasswordInput.type === 'password' ? 'text' : 'password';
            loginPasswordInput.type = type;
            togglePassword.querySelector('i').className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });
    }

    // ===== Quick Login Buttons =====
    if (quickLoginBtns) {
        const users = getUsers();
        const quickUsers = users.slice(0, 4);
        quickUsers.forEach(u => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'quick-login-btn';
            btn.innerHTML = `<img src="${u.avatar}" alt="${u.fullName}"> ${u.fullName.split(' ')[0]}`;
            btn.addEventListener('click', () => {
                loginUsernameInput.value = u.username;
                loginPasswordInput.value = u.password;
                loginForm.requestSubmit();
            });
            quickLoginBtns.appendChild(btn);
        });
    }

    // ===== Show / Hide Login Alerts =====
    function showLoginError(msg) {
        loginError.classList.remove('d-none');
        loginSuccess.classList.add('d-none');
        loginErrorMsg.textContent = msg;
    }

    function showLoginSuccess(msg) {
        loginSuccess.classList.remove('d-none');
        loginError.classList.add('d-none');
        loginSuccessMsg.textContent = msg;
    }

    function hideLoginAlerts() {
        loginError.classList.add('d-none');
        loginSuccess.classList.add('d-none');
    }

    // ===== Login Form Submit =====
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideLoginAlerts();

        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (!username) {
            loginUsernameInput.classList.add('is-invalid');
            showLoginError('Please enter your username.');
            loginUsernameInput.focus();
            return;
        }
        loginUsernameInput.classList.remove('is-invalid');

        if (!password) {
            loginPasswordInput.classList.add('is-invalid');
            showLoginError('Please enter your password.');
            loginPasswordInput.focus();
            return;
        }
        loginPasswordInput.classList.remove('is-invalid');

        // Show spinner
        loginBtn.querySelector('.btn-text').textContent = 'Signing in...';
        loginSpinner.classList.remove('d-none');
        loginBtn.disabled = true;

        setTimeout(() => {
            const user = getUserByUsername(username);

            if (!user) {
                showLoginError('No account found with username "@' + username + '". You can register in the Register tab.');
                resetLoginBtn();
                return;
            }

            if (user.password !== password) {
                showLoginError('Incorrect password. Please verify your credentials.');
                resetLoginBtn();
                return;
            }

            // Successful login: update status & lastLogin
            user.online = true;
            user.lastLogin = new Date().toISOString();
            updateUser(user);
            setCurrentUserId(user.id);

            showLoginSuccess(`Welcome back, ${user.fullName.split(' ')[0]}! Redirecting...`);

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 700);
        }, 500);
    });

    function resetLoginBtn() {
        loginBtn.querySelector('.btn-text').textContent = 'Sign In';
        loginSpinner.classList.add('d-none');
        loginBtn.disabled = false;
    }

    loginUsernameInput.addEventListener('input', () => loginUsernameInput.classList.remove('is-invalid'));
    loginPasswordInput.addEventListener('input', () => loginPasswordInput.classList.remove('is-invalid'));

    // ==========================================
    // ===== REGISTRATION FORM LOGIC =====
    // ==========================================
    const regForm = document.getElementById('registerForm');
    const regFullNameInput = document.getElementById('regFullName');
    const regUsernameInput = document.getElementById('regUsername');
    const regPasswordInput = document.getElementById('regPassword');
    const regConfirmPasswordInput = document.getElementById('regConfirmPassword');
    const regBioInput = document.getElementById('regBio');
    const regLocationInput = document.getElementById('regLocation');
    const regEducationInput = document.getElementById('regEducation');
    const regWorkInput = document.getElementById('regWork');
    const regError = document.getElementById('registerError');
    const regErrorMsg = document.getElementById('registerErrorMsg');
    const regSuccess = document.getElementById('registerSuccess');
    const regSuccessMsg = document.getElementById('registerSuccessMsg');
    const registerBtn = document.getElementById('registerBtn');
    const registerSpinner = document.getElementById('registerSpinner');

    // Avatar theme hue selection
    let selectedAvatarHue = 260;
    const avatarThemeBtns = document.querySelectorAll('.avatar-theme-btn');
    avatarThemeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            avatarThemeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAvatarHue = parseInt(btn.dataset.hue) || 260;
        });
    });

    function showRegError(msg) {
        regError.classList.remove('d-none');
        regSuccess.classList.add('d-none');
        regErrorMsg.textContent = msg;
    }

    function showRegSuccess(msg) {
        regSuccess.classList.remove('d-none');
        regError.classList.add('d-none');
        regSuccessMsg.textContent = msg;
    }

    function hideRegAlerts() {
        regError.classList.add('d-none');
        regSuccess.classList.add('d-none');
    }

    function resetRegBtn() {
        registerBtn.querySelector('.btn-text').innerHTML = '<i class="bi bi-check-circle me-1"></i>Create Account';
        registerSpinner.classList.add('d-none');
        registerBtn.disabled = false;
    }

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            hideRegAlerts();

            const fullName = regFullNameInput.value.trim();
            const rawUsername = regUsernameInput.value.trim();
            const password = regPasswordInput.value.trim();
            const confirmPassword = regConfirmPasswordInput.value.trim();
            const bio = regBioInput.value.trim();
            const location = regLocationInput.value.trim();
            const education = regEducationInput.value.trim();
            const work = regWorkInput.value.trim();

            // Validation 1: Full Name
            if (!fullName || fullName.length < 2) {
                regFullNameInput.classList.add('is-invalid');
                showRegError('Please enter your full name (minimum 2 characters).');
                regFullNameInput.focus();
                return;
            }
            regFullNameInput.classList.remove('is-invalid');

            // Validation 2: Username
            const usernameClean = rawUsername.toLowerCase().replace(/^@/, '');
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            if (!usernameRegex.test(usernameClean)) {
                regUsernameInput.classList.add('is-invalid');
                showRegError('Username must be 3-20 characters long and contain only letters, numbers, or underscores.');
                regUsernameInput.focus();
                return;
            }
            regUsernameInput.classList.remove('is-invalid');

            // Check if username already exists in localStorage
            const existingUser = getUserByUsername(usernameClean);
            if (existingUser) {
                regUsernameInput.classList.add('is-invalid');
                showRegError(`The username "@${usernameClean}" is already registered. Please choose another username.`);
                regUsernameInput.focus();
                return;
            }

            // Validation 3: Password length
            if (!password || password.length < 4) {
                regPasswordInput.classList.add('is-invalid');
                showRegError('Password must be at least 4 characters long.');
                regPasswordInput.focus();
                return;
            }
            regPasswordInput.classList.remove('is-invalid');

            // Validation 4: Password Match
            if (password !== confirmPassword) {
                regConfirmPasswordInput.classList.add('is-invalid');
                showRegError('Passwords do not match. Please re-enter to confirm.');
                regConfirmPasswordInput.focus();
                return;
            }
            regConfirmPasswordInput.classList.remove('is-invalid');

            // Start registration process
            registerBtn.querySelector('.btn-text').textContent = 'Creating Account...';
            registerSpinner.classList.remove('d-none');
            registerBtn.disabled = true;

            setTimeout(() => {
                // Generate unique user object
                const newUserId = generateId('u');
                const avatarSvg = generateAvatar(fullName, selectedAvatarHue);

                const newUser = {
                    id: newUserId,
                    username: usernameClean,
                    password: password,
                    fullName: fullName,
                    bio: bio || 'Hello! I just joined ConnecFriend 🚀',
                    location: location || 'Islamabad, Pakistan',
                    work: work || 'Software Engineer',
                    education: education || 'Air University',
                    joinedDate: new Date().toISOString(),
                    friends: ['u1', 'u2'], // Connect with top demo users so newsfeed is immediately active!
                    ignoreList: [],
                    lastLogin: new Date().toISOString(),
                    online: true,
                    avatar: avatarSvg
                };

                // Save to localStorage
                const allUsers = getUsers();
                allUsers.push(newUser);

                // Also add reciprocal friendship with default friends
                const ahmed = allUsers.find(u => u.id === 'u1');
                if (ahmed && !ahmed.friends.includes(newUserId)) {
                    ahmed.friends.push(newUserId);
                }
                const sara = allUsers.find(u => u.id === 'u2');
                if (sara && !sara.friends.includes(newUserId)) {
                    sara.friends.push(newUserId);
                }

                setUsers(allUsers);

                // Add an initial welcome post for the new user
                const posts = getPosts();
                posts.unshift({
                    id: generateId('p'),
                    authorId: newUserId,
                    content: `Excited to join ConnecFriend! Looking forward to connecting with amazing minds. 🎉`,
                    timestamp: new Date().toISOString(),
                    shareScope: 'all',
                    sharedWith: [],
                    likes: ['u1', 'u2'],
                    dislikes: []
                });
                setPosts(posts);

                // Set as current logged-in user
                setCurrentUserId(newUserId);

                showRegSuccess(`Account successfully created for ${fullName}! Taking you to your home feed...`);

                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 800);
            }, 600);
        });

        // Clear invalid classes on input
        regFullNameInput.addEventListener('input', () => regFullNameInput.classList.remove('is-invalid'));
        regUsernameInput.addEventListener('input', () => regUsernameInput.classList.remove('is-invalid'));
        regPasswordInput.addEventListener('input', () => regPasswordInput.classList.remove('is-invalid'));
        regConfirmPasswordInput.addEventListener('input', () => regConfirmPasswordInput.classList.remove('is-invalid'));
    }
});
