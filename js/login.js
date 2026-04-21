document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!validateEmail(email)) {
                showError('login-email', 'Email không hợp lệ');
                return;
            }

            if (password.length < 6) {
                showError('login-password', 'Mật khẩu phải có ít nhất 6 ký tự');
                return;
            }

            clearErrors();

            const result = await auth.login(email, password);

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
