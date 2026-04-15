
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const errorMessage = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
    }
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.classList.remove('show');
            errorMessage.textContent = '';
        }
    });
}

document.addEventListener('input', function(e) {
    if (e.target.closest('.form-group')) {
        const formGroup = e.target.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');

        if (errorMessage && errorMessage.classList.contains('show')) {
            formGroup.classList.remove('error');
            errorMessage.classList.remove('show');
            errorMessage.textContent = '';
        }
    }
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const button = event.currentTarget;
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.add('fa-eye');
        icon.classList.remove('fa-eye-slash');
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    
    const toastText = document.getElementById('toast-text');
    const toastIcon = toast.querySelector('.toast-icon');

    if (toastText) {
        toastText.textContent = message;
    }
    
    toast.classList.remove('hidden');
    toast.classList.add('show');

    if (type === 'error') {
        if (toastIcon) {
            toastIcon.style.color = '#ff4757';
            toastIcon.classList.remove('fa-check-circle');
            toastIcon.classList.add('fa-exclamation-circle');
        }
    } else {
        if (toastIcon) {
            toastIcon.style.color = '#00e5ff';
            toastIcon.classList.add('fa-check-circle');
            toastIcon.classList.remove('fa-exclamation-circle');
        }
    }

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            const toast = document.getElementById('toast-notification');
            if (toast) {
                toast.classList.remove('show');
                toast.classList.add('hidden');
            }
        });
    }
});

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    if (!strengthBar) return;

    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;

    strengthBar.style.width = strength + '%';
}
