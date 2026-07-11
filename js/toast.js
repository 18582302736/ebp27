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

function showUndoToast(message, onUndo, duration) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast undo-toast';
  toast.innerHTML = '<span class="toast-icon">✓</span><span>' + message + '</span><button type="button" class="toast-action">撤销</button>';
  document.body.appendChild(toast);

  let active = true;
  const dismiss = () => {
    if (!active) return;
    active = false;
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  };
  toast.querySelector('.toast-action').addEventListener('click', async () => {
    if (!active) return;
    active = false;
    toast.remove();
    try { await onUndo(); } catch (e) { showToast('撤销失败，请重试', 'error'); }
  });
  setTimeout(dismiss, duration || 5000);
}
