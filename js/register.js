/**
 * Register Form Handler - Pure JavaScript (No Backend)
 * Uses auth-helper.js for common functions
 */

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const regPassword = document.getElementById('reg-password');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const firstName = document.getElementById('reg-firstname').value.trim();
            const lastName = document.getElementById('reg-lastname').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm').value;
            const termsCheckbox = document.querySelector('input[name="terms"]');

            // Clear previous errors
            clearErrors();
            let isValid = true;

            // Validation
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

            if (!phone || phone.length < 10) {
                showError('reg-phone', 'Vui lòng nhập số điện thoại hợp lệ');
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

            if (!termsCheckbox.checked) {
                showToast('Vui lòng chấp nhận Điều khoản dịch vụ', 'error');
                isValid = false;
            }

            if (!isValid) return;

            // Perform registration using auth manager
            const result = await auth.register(firstName, lastName, email, phone, password);

            if (!result.success) {
                showToast(result.message, 'error');
                return;
            }

            showToast(result.message, 'success');

            // Update header display to show user profile instead of login/register links
           setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        });
    }
});
