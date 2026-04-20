document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const firstName = document.getElementById('reg-firstname').value.trim();
            const lastName = document.getElementById('reg-lastname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;

            clearErrors();
            let isValid = true;

            if (!firstName) {
                showError('reg-firstname', 'Vui lòng nhập tên');
                isValid = false;
            }

            if (!lastName) {
                showError('reg-lastname', 'Vui lòng nhập họ');
                isValid = false;
            }

            if (!validateEmail(email)) {
                showError('reg-email', 'Email không hợp lệ');
                isValid = false;
            }

            if (!/^\d{10}$/.test(phone)) {
                showError('reg-phone', 'Số điện thoại phải gồm đúng 10 chữ số');
                isValid = false;
            }

            if (password.length < 8) {
                showError('reg-password', 'Mật khẩu phải có ít nhất 8 ký tự');
                isValid = false;
            }

            if (password !== confirmPassword) {
                showError('reg-confirm', 'Mật khẩu xác nhận không khớp');
                isValid = false;
            }

            if (!isValid) return;

            const result = await auth.register(firstName, lastName, email, phone, password);

            if (!result.success) {
                showToast(result.message, 'error');
                return;
            }

            showToast(result.message, 'success');

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        });
    }
});
