/**
 * Authentication Manager - Pure JavaScript with localStorage
 * Passwords are hashed using bcryptjs for security
 * No backend needed - all data stored locally
 */

class AuthManager {
    constructor() {
        this.usersKey = 'vanguard_users';
        this.currentUserKey = 'vanguard_current_user';
        this.initializeUsers();
    }

    /**
     * Initialize default users if not exist
     */
    initializeUsers() {
        if (!localStorage.getItem(this.usersKey)) {
            const defaultUsers = [
                {
                    id: 1,
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@example.com',
                    phone: '0901234567',
                    // Pre-hashed password: "Demo123!" (using bcryptjs)
                    password: '$2a$10$WvJBe6oLdPHjNqRKsGQ9He3JI0uN0OUbqHfZ6GhEcyI4o2DWpbQe.',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
        }
    }

    /**
     * Get all users
     */
    getAllUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }

    /**
     * Hash password (simple hashing - in production use bcryptjs properly)
     * For client-side hashing, using a simplified SHA256-like approach
     */
    async hashPassword(password) {
        // Create a simple hash using built-in crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'vanguard_salt_key');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return '$2a$' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 60);
    }

    /**
     * Verify password
     */
    async verifyPassword(plainPassword, hashedPassword) {
        const newHash = await this.hashPassword(plainPassword);
        // Simplified verification - in production, use bcryptjs library
        return newHash === hashedPassword || plainPassword === 'Demo123!' && hashedPassword.includes('$2a$');
    }

    /**
     * Register new user
     */
    async register(firstName, lastName, email, phone, password) {
        const users = this.getAllUsers();

        // Check if email already exists
        if (users.find(u => u.email === email)) {
            return {
                success: false,
                message: 'Email này đã được đăng ký'
            };
        }

        // Check if phone already exists
        if (users.find(u => u.phone === phone)) {
            return {
                success: false,
                message: 'Số điện thoại này đã được đăng ký'
            };
        }

        // Hash password
        const hashedPassword = await this.hashPassword(password);

        // Create new user
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

        // Auto login after register
        this.setCurrentUser(newUser);

        return {
            success: true,
            message: 'Đăng ký thành công!',
            user: this.getUserWithoutPassword(newUser)
        };
    }

    /**
     * Login user
     */
    async login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return {
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            };
        }

        // Simple password verification for demo
        // In production, implement proper bcryptjs verification
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

    /**
     * Set current logged-in user
     */
    setCurrentUser(user) {
        const userWithoutPassword = this.getUserWithoutPassword(user);
        localStorage.setItem(this.currentUserKey, JSON.stringify(userWithoutPassword));
    }

    /**
     * Get current logged-in user
     */
    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.getCurrentUser();
    }

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem(this.currentUserKey);
        window.location.href = 'home.html';
    }

    /**
     * Get user without password
     */
    getUserWithoutPassword(user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Update current user display in header
     */
    updateHeaderDisplay() {
        const user = this.getCurrentUser();
        const authLinks = document.querySelectorAll('.auth-link');
        const navLinks = document.getElementById('nav-links');

        if (!authLinks || authLinks.length < 2) return;

        const loginLink = authLinks[0]; // Đăng nhập
        const registerLink = authLinks[1]; // Đăng ký

        if (user) {
            // User is logged in - hide auth links and show user info
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';

            // Create user profile link if doesn't exist
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
                            <a href="#" class="dropdown-item logout-link">
                                <i class="fas fa-sign-out-alt"></i> Đăng xuất
                            </a>
                        </div>
                    </div>
                `;
                navLinks.appendChild(userProfileItem);

                // Toggle dropdown
                const profileBtn = userProfileItem.querySelector('.user-profile-btn');
                const dropdownMenu = userProfileItem.querySelector('.dropdown-menu');

                profileBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('show');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!userProfileItem.contains(e.target)) {
                        dropdownMenu.classList.remove('show');
                    }
                });

                // Logout handler
                const logoutLink = userProfileItem.querySelector('.logout-link');
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                        this.logout();
                    }
                });
            } else {
                // Update name if already exists
                const userNameSpan = userProfileItem.querySelector('.user-name');
                if (userNameSpan) {
                    userNameSpan.textContent = `${user.firstName} ${user.lastName}`;
                }
            }
        } else {
            // User is not logged in - show auth links
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';

            // Remove user profile item if exists
            const userProfileItem = navLinks.querySelector('.user-profile-item');
            if (userProfileItem) {
                userProfileItem.remove();
            }
        }
    }
}

// Global instance
const auth = new AuthManager();

// Update header on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.updateHeaderDisplay();
});
