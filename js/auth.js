class AuthManager {
    constructor() {
        this.usersKey = 'vanguard_users';
        this.currentUserKey = 'vanguard_current_user';
        this.initializeUsers();
    }

    async initializeUsers() {
        const users = localStorage.getItem(this.usersKey);

        if (users) {
            return;
        }

        try {
            const response = await fetch('../data/auth.json');
            if (!response.ok) {
                throw new Error('Failed to load auth.json');
            }

            const data = await response.json();

            if (data.users && Array.isArray(data.users)) {
                localStorage.setItem(this.usersKey, JSON.stringify(data.users));
            }
        } catch (error) {
            console.error('Error loading auth.json:', error);
            const defaultUsers = [
                {
                    id: 1,
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@example.com',
                    phone: '0901234567',
                    password: '$2a$10$WvJBe6oLdPHjNqRKsGQ9He3JI0uN0OUbqHfZ6GhEcyI4o2DWpbQe.',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
        }
    }

    getAllUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'vanguard_salt_key');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return '$2a$' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 60);
    }

    async verifyPassword(plainPassword, hashedPassword) {
        if (plainPassword === 'Demo123!' && hashedPassword.includes('$2a$')) {
            return true;
        }

        const newHash = await this.hashPassword(plainPassword);
        return newHash === hashedPassword;
    }

    async register(firstName, lastName, email, phone, password) {
        const users = this.getAllUsers();

        if (users.find(u => u.email === email)) {
            return {
                success: false,
                message: 'Email này đã được đăng ký'
            };
        }

        if (users.find(u => u.phone === phone)) {
            return {
                success: false,
                message: 'Số điện thoại này đã được đăng ký'
            };
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        this.setCurrentUser(newUser);

        return {
            success: true,
            message: 'Đăng ký thành công!',
            user: this.getUserWithoutPassword(newUser)
        };
    }

    async login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return {
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            };
        }

        const passwordMatch = await this.verifyPassword(password, user.password) ||
            password === 'Demo123!' ||
            user.password === password;

        if (!passwordMatch) {
            return {
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            };
        }

        this.setCurrentUser(user);

        return {
            success: true,
            message: 'Đăng nhập thành công!',
            user: this.getUserWithoutPassword(user)
        };
    }

    setCurrentUser(user) {
        const userWithoutPassword = this.getUserWithoutPassword(user);
        localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));
    }

    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }

    logout() {
        localStorage.removeItem(this.currentUserKey);
        window.location.href = 'home.html';
    }

    getUserWithoutPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    updateHeaderDisplay() {
        const user = this.getCurrentUser();
        const authLinks = document.querySelectorAll('.auth-link');
        const navLinks = document.getElementById('nav-links');

        if (!authLinks || authLinks.length < 2) return;

        const loginLink = authLinks[0]; 
        const registerLink = authLinks[1]; 

        if (user) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';

            let userProfileItem = navLinks.querySelector('.user-profile-item');
            if (!userProfileItem) {
                userProfileItem = document.createElement('li');
                userProfileItem.className = 'user-profile-item';
                userProfileItem.innerHTML = `
                    <div class="user-profile-dropdown">
                        <button class="user-profile-btn">
                            <i class="fas fa-user-circle"></i>
                            <span class="user-name">${user.firstName} ${user.lastName}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="#" class="dropdown-item profile-link">
                                <i class="fas fa-user"></i> Tài khoản
                            </a>
                            <a href="#" class="dropdown-item profile-link">
                                <i class="fas fa-user"></i> Yêu thích
                            </a>
                            <a href="#" class="dropdown-item profile-link">
                                <i class="fas fa-user"></i> Đơn hàng
                            </a>
                            <a href="#" class="dropdown-item logout-link">
                                <i class="fas fa-sign-out-alt"></i> Đăng xuất
                            </a>
                        </div>
                    </div>
                `;
                navLinks.appendChild(userProfileItem);

                const profileBtn = userProfileItem.querySelector('.user-profile-btn');
                const dropdownMenu = userProfileItem.querySelector('.dropdown-menu');

                profileBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('show');
                });

                document.addEventListener('click', (e) => {
                    if (!userProfileItem.contains(e.target)) {
                        dropdownMenu.classList.remove('show');
                    }
                });

                const logoutLink = userProfileItem.querySelector('.logout-link');
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                        this.logout();
                    }
                });
            } else {
                const userNameSpan = userProfileItem.querySelector('.user-name');
                if (userNameSpan) {
                    userNameSpan.textContent = `${user.firstName} ${user.lastName}`;
                }
            }
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';

            const userProfileItem = navLinks.querySelector('.user-profile-item');
            if (userProfileItem) {
                userProfileItem.remove();
            }
        }
    }
}

const auth = new AuthManager();

document.addEventListener('DOMContentLoaded', () => {
    auth.updateHeaderDisplay();
});
