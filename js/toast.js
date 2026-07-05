// toast.js - 轻量 Toast 通知组件

function showToast(message, type) {
  // 移除已有 toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast ' + (type === 'error' ? 'error' : 'success');
  toast.innerHTML = '<span class="toast-icon">' + (type === 'error' ? '✕' : '✓') + '</span>' + message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}