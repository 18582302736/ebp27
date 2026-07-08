// toast.js - 轻量 Toast 通知组件

function showToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toastType = type || 'success';
  const toast = document.createElement('div');
  toast.className = 'toast ' + toastType;
  const icons = { success: '✓', error: '✕', warning: '!' };
  toast.innerHTML = '<span class="toast-icon">' + (icons[toastType] || '✓') + '</span>' + message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}