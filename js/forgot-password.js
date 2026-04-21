/**
 * Forgot Password - Logic handler
 * Quy trình 3 bước: Email → OTP → Đặt mật khẩu mới
 * Sử dụng localStorage để lưu trữ người dùng (như phần còn lại của hệ thống)
 */

(function () {
    'use strict';

    // ──────────────────────────────────────────
    // State
    // ──────────────────────────────────────────
    const state = {
        currentStep: 1,
        email: '',
        generatedOtp: '',
        otpExpiry: null,       // timestamp (ms)
        timerInterval: null,
        resendInterval: null,
        resendCooldown: 60,    // seconds
    };

    // OTP duration: 2 minutes
    const OTP_DURATION_MS = 2 * 60 * 1000;

    // ──────────────────────────────────────────
    // DOM helpers
    // ──────────────────────────────────────────
    const $ = (id) => document.getElementById(id);

    function showStep(stepNum) {
        // Hide all cards
        document.querySelectorAll('.fp-card').forEach(c => {
            c.classList.add('hidden-step');
            c.classList.remove('entering');
        });

        const card = $(`step-${stepNum}`);
        card.classList.remove('hidden-step');
        // Force reflow before adding animation
        void card.offsetWidth;
        card.classList.add('entering');

        // Update step indicator dots
        for (let i = 1; i <= 3; i++) {
            const dot = $(`step-dot-${i}`);
            dot.classList.remove('active', 'completed');
            if (i < stepNum) dot.classList.add('completed');
            else if (i === stepNum) dot.classList.add('active');
        }

        // Update step indicator lines
        for (let i = 1; i <= 2; i++) {
            const line = $(`line-${i}-${i + 1}`);
            if (line) {
                line.classList.toggle('active', i < stepNum);
            }
        }

        state.currentStep = stepNum;
    }

    // ──────────────────────────────────────────
    // OTP generator
    // ──────────────────────────────────────────
    function generateOtp() {
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    // ──────────────────────────────────────────
    // Simulate sending OTP (console + alert for demo)
    // ──────────────────────────────────────────
    function sendOtpToEmail(email, otp) {
        // In production: call backend API to send email
        console.log(`[DEV] OTP for ${email}: ${otp}`);
        // Show OTP in a dismissible banner inside the card for demo purposes
        showOtpDevBanner(otp);
    }

    function showOtpDevBanner(otp) {
        // Remove existing banner
        const existing = document.querySelector('.otp-dev-banner');
        if (existing) existing.remove();

        const banner = document.createElement('div');
        banner.className = 'otp-dev-banner';
        banner.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>Mã OTP của bạn (chế độ demo): <strong>${otp}</strong></span>
        `;
        banner.style.cssText = `
            background: rgba(0,229,255,0.08);
            border: 1px dashed rgba(0,229,255,0.4);
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 0.88rem;
            color: var(--accent-gold, #00e5ff);
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        // Insert before otp form submit button
        const otpForm = $('otpForm');
        if (otpForm) {
            otpForm.insertBefore(banner, otpForm.firstChild);
        }
    }

    // ──────────────────────────────────────────
    // Timer
    // ──────────────────────────────────────────
    function startOtpTimer() {
        clearInterval(state.timerInterval);
        state.otpExpiry = Date.now() + OTP_DURATION_MS;

        const display = $('timer-display');

        state.timerInterval = setInterval(() => {
            const remaining = state.otpExpiry - Date.now();

            if (remaining <= 0) {
                clearInterval(state.timerInterval);
                display.textContent = '00:00';
                display.className = 'timer-count danger';
                // Disable verify button
                $('verifyOtpBtn').disabled = true;
                $('verifyOtpBtn').querySelector('.btn-text').innerHTML =
                    '<i class="fas fa-times-circle"></i> Mã đã hết hạn';
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // Color warnings
            if (remaining <= 20000) {
                display.className = 'timer-count danger';
            } else if (remaining <= 40000) {
                display.className = 'timer-count warning';
            } else {
                display.className = 'timer-count';
            }
        }, 500);
    }

    // ──────────────────────────────────────────
    // Resend cooldown
    // ──────────────────────────────────────────
    function startResendCooldown() {
        clearInterval(state.resendInterval);
        const btn = $('resendBtn');
        const countdown = $('resend-countdown');
        let seconds = state.resendCooldown;

        btn.disabled = true;
        btn.textContent = `Gửi lại mã (${seconds}s)`;

        state.resendInterval = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(state.resendInterval);
                btn.disabled = false;
                btn.innerHTML = 'Gửi lại mã';
                return;
            }
            btn.textContent = `Gửi lại mã (${seconds}s)`;
        }, 1000);
    }

    // ──────────────────────────────────────────
    // Set button loading state
    // ──────────────────────────────────────────
    function setLoading(btnId, loading) {
        const btn = $(btnId);
        if (!btn) return;
        const textEl = btn.querySelector('.btn-text');
        const loadEl = btn.querySelector('.btn-loading');
        btn.disabled = loading;
        if (textEl) textEl.classList.toggle('hidden', loading);
        if (loadEl) loadEl.classList.toggle('hidden', !loading);
    }

    // ──────────────────────────────────────────
    // Show / clear inline errors
    // ──────────────────────────────────────────
    function showInlineError(errorId, message) {
        const el = $(errorId);
        if (el) el.textContent = message;
    }

    function clearInlineError(errorId) {
        const el = $(errorId);
        if (el) el.textContent = '';
    }

    // ──────────────────────────────────────────
    // STEP 1 – Email form
    // ──────────────────────────────────────────
    $('emailForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        clearInlineError('email-error');

        const email = $('fp-email').value.trim();

        if (!email) {
            showInlineError('email-error', 'Vui lòng nhập địa chỉ email.');
            return;
        }

        if (!validateEmail(email)) {
            showInlineError('email-error', 'Địa chỉ email không hợp lệ.');
            return;
        }

        setLoading('sendOtpBtn', true);

        // Simulate async check (500ms delay)
        await delay(600);

        // Check if user exists in localStorage
        const users = auth.getAllUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        setLoading('sendOtpBtn', false);

        if (!user) {
            showInlineError('email-error', 'Email này chưa được đăng ký tài khoản.');
            return;
        }

        // Generate & "send" OTP
        state.email = email;
        state.generatedOtp = generateOtp();
        sendOtpToEmail(email, state.generatedOtp);

        // Update displayed email
        $('display-email').textContent = email;

        // Move to Step 2
        showStep(2);

        // Start timers
        startOtpTimer();
        startResendCooldown();

        // Focus first OTP input
        setTimeout(() => $('otp-0').focus(), 300);

        showToast('Mã OTP đã được gửi tới ' + email, 'success');
    });

    // ──────────────────────────────────────────
    // STEP 2 – OTP inputs UX
    // ──────────────────────────────────────────
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
        // Allow only numbers
        input.addEventListener('keydown', function (e) {
            // Allow backspace, arrow keys, tab
            if (['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].includes(e.key)) {
                if (e.key === 'Backspace') {
                    if (input.value === '' && index > 0) {
                        otpInputs[index - 1].focus();
                        otpInputs[index - 1].value = '';
                        otpInputs[index - 1].classList.remove('otp-filled');
                    } else {
                        input.value = '';
                        input.classList.remove('otp-filled');
                    }
                    e.preventDefault();
                }
                return;
            }

            // Block non-numeric
            if (!/^\d$/.test(e.key)) {
                e.preventDefault();
                return;
            }
        });

        input.addEventListener('input', function () {
            // Keep only last digit
            if (input.value.length > 1) {
                input.value = input.value.slice(-1);
            }

            if (/^\d$/.test(input.value)) {
                input.classList.add('otp-filled');
                input.classList.remove('otp-error');
                // Move to next
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            } else {
                input.classList.remove('otp-filled');
            }
        });

        // Handle paste
        input.addEventListener('paste', function (e) {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
            pasted.split('').forEach((char, i) => {
                if (index + i < otpInputs.length) {
                    otpInputs[index + i].value = char;
                    otpInputs[index + i].classList.add('otp-filled');
                    otpInputs[index + i].classList.remove('otp-error');
                }
            });
            // Focus last filled or last
            const nextIndex = Math.min(index + pasted.length, otpInputs.length - 1);
            otpInputs[nextIndex].focus();
        });
    });

    // Get assembled OTP value
    function getOtpValue() {
        return Array.from(otpInputs).map(i => i.value).join('');
    }

    function setOtpError() {
        otpInputs.forEach(i => {
            i.classList.add('otp-error');
            i.classList.remove('otp-filled');
        });
    }

    function clearOtpInputs() {
        otpInputs.forEach(i => {
            i.value = '';
            i.classList.remove('otp-filled', 'otp-error');
        });
    }

    // ──────────────────────────────────────────
    // STEP 2 – OTP form submit
    // ──────────────────────────────────────────
    $('otpForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        clearInlineError('otp-error');

        const entered = getOtpValue();

        if (entered.length < 6) {
            showInlineError('otp-error', 'Vui lòng nhập đủ 6 chữ số.');
            setOtpError();
            return;
        }

        // Check expiry
        if (Date.now() > state.otpExpiry) {
            showInlineError('otp-error', 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.');
            setOtpError();
            return;
        }

        setLoading('verifyOtpBtn', true);
        await delay(700);
        setLoading('verifyOtpBtn', false);

        if (entered !== state.generatedOtp) {
            showInlineError('otp-error', 'Mã OTP không chính xác. Vui lòng thử lại.');
            setOtpError();
            showToast('Mã OTP không chính xác!', 'error');
            return;
        }

        // OTP correct – move to step 3
        clearInterval(state.timerInterval);
        clearInterval(state.resendInterval);
        showStep(3);
        $('new-password').focus();
        showToast('Xác minh thành công!', 'success');
    });

    // ──────────────────────────────────────────
    // STEP 2 – Resend OTP
    // ──────────────────────────────────────────
    $('resendBtn').addEventListener('click', function () {
        state.generatedOtp = generateOtp();

        // Remove old banner
        const existing = document.querySelector('.otp-dev-banner');
        if (existing) existing.remove();

        sendOtpToEmail(state.email, state.generatedOtp);
        clearOtpInputs();
        clearInlineError('otp-error');
        $('verifyOtpBtn').disabled = false;
        $('verifyOtpBtn').querySelector('.btn-text').innerHTML = '<i class="fas fa-check-circle"></i> Xác nhận mã OTP';

        startOtpTimer();
        startResendCooldown();
        otpInputs[0].focus();
        showToast('Đã gửi lại mã OTP mới!', 'success');
    });

    // ──────────────────────────────────────────
    // STEP 2 – Back to email
    // ──────────────────────────────────────────
    $('backToEmail').addEventListener('click', function (e) {
        e.preventDefault();
        clearInterval(state.timerInterval);
        clearInterval(state.resendInterval);
        state.generatedOtp = '';
        const existing = document.querySelector('.otp-dev-banner');
        if (existing) existing.remove();
        showStep(1);
    });

    // ──────────────────────────────────────────
    // STEP 3 – Password requirements checker
    // ──────────────────────────────────────────
    $('new-password').addEventListener('input', function () {
        checkPasswordRequirements(this.value);
        updateStrengthBar(this.value);
    });

    function checkPasswordRequirements(password) {
        const rules = [
            { id: 'req-length', test: () => password.length >= 8 },
            { id: 'req-upper',  test: () => /[A-Z]/.test(password) },
            { id: 'req-lower',  test: () => /[a-z]/.test(password) },
            { id: 'req-number', test: () => /[0-9]/.test(password) },
            { id: 'req-special', test: () => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
        ];

        rules.forEach(rule => {
            const el = $(rule.id);
            if (!el) return;
            const dot = el.querySelector('.req-dot');
            const met = rule.test();
            el.classList.toggle('met', met);
            if (dot && met) {
                dot.className = 'fas fa-check-circle req-dot';
            } else if (dot) {
                dot.className = 'fas fa-circle req-dot';
            }
        });
    }

    function updateStrengthBar(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

        const bar = $('strength-bar-fp');
        const label = $('strength-label-text');
        if (!bar) return;

        const pct = (score / 5) * 100;
        bar.style.width = pct + '%';

        const levels = [
            { min: 0,  max: 20,  text: '',           color: '' },
            { min: 21, max: 40,  text: 'Yếu',        color: '#ff4757' },
            { min: 41, max: 60,  text: 'Trung bình',  color: '#ffaa00' },
            { min: 61, max: 80,  text: 'Khá mạnh',   color: '#2ed573' },
            { min: 81, max: 100, text: 'Rất mạnh',   color: '#00e5ff' },
        ];

        const lvl = levels.find(l => pct >= l.min && pct <= l.max) || levels[0];
        bar.style.background = lvl.color || '';
        if (label) {
            label.textContent = lvl.text;
            label.style.color = lvl.color;
        }
    }

    // ──────────────────────────────────────────
    // STEP 3 – New password form submit
    // ──────────────────────────────────────────
    $('newPasswordForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        clearInlineError('np-error');
        clearInlineError('cp-error');

        const newPass = $('new-password').value;
        const confirmPass = $('confirm-password').value;

        let valid = true;

        if (newPass.length < 8) {
            showInlineError('np-error', 'Mật khẩu phải có ít nhất 8 ký tự.');
            valid = false;
        }

        if (newPass !== confirmPass) {
            showInlineError('cp-error', 'Mật khẩu xác nhận không khớp.');
            valid = false;
        }

        if (!valid) return;

        setLoading('resetBtn', true);
        await delay(900);

        // Update password in localStorage
        const success = await updateUserPassword(state.email, newPass);
        setLoading('resetBtn', false);

        if (!success) {
            showInlineError('np-error', 'Có lỗi xảy ra. Vui lòng thử lại.');
            return;
        }

        // Show success step
        showStep(4);
        startRedirectCountdown();
    });

    // ──────────────────────────────────────────
    // Update user password in localStorage
    // ──────────────────────────────────────────
    async function updateUserPassword(email, newPassword) {
        try {
            const users = auth.getAllUsers();
            const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

            if (idx === -1) return false;

            const hashedPassword = await auth.hashPassword(newPassword);
            users[idx].password = hashedPassword;
            // Also store plain for the demo login system's loose check
            users[idx]._plainPassword = newPassword;
            users[idx].updatedAt = new Date().toISOString();

            localStorage.setItem('vanguard_users', JSON.stringify(users));

            // If the updated user is the currently logged-in user, log them out
            const currentUser = auth.getCurrentUser();
            if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
                localStorage.removeItem('vanguard_current_user');
            }

            return true;
        } catch (err) {
            console.error('updateUserPassword error:', err);
            return false;
        }
    }

    // ──────────────────────────────────────────
    // Step 4 – Redirect countdown
    // ──────────────────────────────────────────
    function startRedirectCountdown() {
        let count = 5;
        const el = $('redirect-count');

        const interval = setInterval(() => {
            count--;
            if (el) el.textContent = count;

            if (count <= 0) {
                clearInterval(interval);
                window.location.href = 'login.html';
            }
        }, 1000);
    }

    // ──────────────────────────────────────────
    // Utility
    // ──────────────────────────────────────────
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ──────────────────────────────────────────
    // Init
    // ──────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        showStep(1);

        // Clear errors on input
        $('fp-email').addEventListener('input', () => clearInlineError('email-error'));
        $('new-password').addEventListener('input', () => clearInlineError('np-error'));
        $('confirm-password').addEventListener('input', () => clearInlineError('cp-error'));
    });
})();
