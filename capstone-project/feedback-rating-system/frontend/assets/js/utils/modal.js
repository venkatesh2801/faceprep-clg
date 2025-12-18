/**
 * Modal & Toast Notification Utilities
 */

// Create modal container if it doesn't exist
function initModalContainer() {
    if (!document.getElementById('modal-container')) {
        const container = document.createElement('div');
        container.id = 'modal-container';
        document.body.appendChild(container);
    }
}

// Create toast container if it doesn't exist
function initToastContainer() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

/**
 * Show a confirmation modal
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.message - Modal message
 * @param {string} options.type - Modal type: 'success', 'error', 'warning', 'info'
 * @param {string} options.confirmText - Confirm button text
 * @param {string} options.cancelText - Cancel button text (optional)
 * @param {Function} options.onConfirm - Callback on confirm
 * @param {Function} options.onCancel - Callback on cancel
 */
function showModal(options) {
    initModalContainer();
    
    const {
        title = 'Confirm',
        message = 'Are you sure?',
        type = 'info',
        confirmText = 'OK',
        cancelText = null,
        onConfirm = () => {},
        onCancel = () => {}
    } = options;

    const iconMap = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="text-center">
                <span class="material-icons modal-icon ${type}">${iconMap[type]}</span>
                <h3>${title}</h3>
                <p>${message}</p>
                <div class="modal-actions">
                    ${cancelText ? `<button class="btn btn-secondary modal-cancel">${cancelText}</button>` : ''}
                    <button class="btn btn-primary modal-confirm">${confirmText}</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-container').appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    // Event handlers
    const confirmBtn = overlay.querySelector('.modal-confirm');
    const cancelBtn = overlay.querySelector('.modal-cancel');

    const closeModal = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };

    confirmBtn.addEventListener('click', () => {
        closeModal();
        onConfirm();
    });

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            closeModal();
            onCancel();
        });
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
            onCancel();
        }
    });

    // Close on Escape key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            onCancel();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

/**
 * Show a simple alert modal (no cancel button)
 */
function showAlert(title, message, type = 'info') {
    return new Promise((resolve) => {
        showModal({
            title,
            message,
            type,
            confirmText: 'OK',
            onConfirm: resolve
        });
    });
}

/**
 * Show a confirmation modal with confirm/cancel
 */
function showConfirm(title, message, type = 'warning') {
    return new Promise((resolve) => {
        showModal({
            title,
            message,
            type,
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false)
        });
    });
}

/**
 * Show a toast notification
 * @param {Object} options - Toast options
 * @param {string} options.title - Toast title
 * @param {string} options.message - Toast message
 * @param {string} options.type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} options.duration - Duration in ms (default: 4000)
 */
function showToast(options) {
    initToastContainer();
    
    const {
        title = '',
        message = '',
        type = 'info',
        duration = 4000
    } = options;

    const iconMap = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="material-icons toast-icon">${iconMap[type]}</span>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;

    document.getElementById('toast-container').appendChild(toast);

    const closeToast = () => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close').addEventListener('click', closeToast);

    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(closeToast, duration);
    }
}

// Convenience functions for toasts
function toastSuccess(message, title = 'Success') {
    showToast({ title, message, type: 'success' });
}

function toastError(message, title = 'Error') {
    showToast({ title, message, type: 'error' });
}

function toastWarning(message, title = 'Warning') {
    showToast({ title, message, type: 'warning' });
}

function toastInfo(message, title = 'Info') {
    showToast({ title, message, type: 'info' });
}

