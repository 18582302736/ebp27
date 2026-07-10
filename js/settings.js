// settings.js - 设置与 iCloud 文件备份 UI
let settingsOverlay = null;
let settingsPanel = null;

function initSettingsPage() {
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) { settingsBtn.innerHTML = iconSettings(20); settingsBtn.addEventListener('click', openSettings); }
  settingsOverlay = document.getElementById('settingsOverlay');
  settingsPanel = document.querySelector('.settings-panel');
  if (!settingsOverlay) return;
  const closeBtn = document.getElementById('settingsClose');
  if (closeBtn) closeBtn.addEventListener('click', closeSettings);
  settingsOverlay.addEventListener('click', e => { if (e.target === settingsOverlay) closeSettings(); });

  const backupBtn = document.getElementById('createBackupBtn');
  const restoreBtn = document.getElementById('restoreBackupBtn');
  const fileInput = document.getElementById('backupFileInput');
  if (backupBtn) backupBtn.addEventListener('click', openCreateBackupDialog);
  if (restoreBtn && fileInput) restoreBtn.addEventListener('click', () => fileInput.click());
  if (fileInput) fileInput.addEventListener('change', handleBackupFileSelected);
  updateBackupUI();
  updateBackupIndicator();
}

function openSettings() {
  if (!settingsOverlay) return;
  updateBackupUI();
  settingsOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeSettings() { if (settingsOverlay) { settingsOverlay.style.display = 'none'; document.body.style.overflow = ''; } }

async function updateBackupUI() {
  const statusIcon = document.querySelector('.backup-status-icon');
  const statusText = document.querySelector('.backup-status-text');
  const lastBackup = document.getElementById('lastBackupTime');
  const summary = document.getElementById('backupDataSummary');
  if (statusIcon && statusText) {
    const dirty = isBackupDirty();
    statusIcon.textContent = dirty ? '●' : '✓';
    statusIcon.className = 'backup-status-icon ' + (dirty ? 'pending' : 'safe');
    statusText.textContent = dirty ? '有新内容待备份' : '本机内容已备份';
  }
  if (lastBackup) lastBackup.textContent = '上次备份：' + formatBackupTime(getLastBackupAt());
  if (summary) {
    try { const s = await getBackupSummary(); summary.textContent = s.progressCount + ' 天进度 · ' + s.journalCount + ' 篇书写 · ' + s.photoCount + ' 张照片'; }
    catch (e) { summary.textContent = '数据统计暂不可用'; }
  }
}

async function openCreateBackupDialog() {
  let summary;
  try { summary = await getBackupSummary(); }
  catch (e) { showToast('读取本地数据失败', 'error'); return; }
  openBackupDialog('创建备份', '<p class="backup-dialog-copy">将备份 ' + summary.progressCount + ' 天进度、' + summary.journalCount + ' 篇书写和 ' + summary.photoCount + ' 张照片。</p>'
    + '<p class="backup-dialog-warning">照片会一起保存在同一个 .ahbackup 文件里。备份文件不再需要密码，请保存到你自己的 iCloud Drive。</p>'
    + '<div class="backup-dialog-actions"><button class="btn btn-secondary" data-close-backup>取消</button><button class="btn btn-primary" id="prepareBackupBtn">创建备份</button></div>');
  document.getElementById('prepareBackupBtn').addEventListener('click', prepareBackupFile);
}

async function prepareBackupFile() {
  const btn = document.getElementById('prepareBackupBtn'); btn.disabled = true; btn.textContent = '正在整理…';
  try {
    pendingBackupFile = await createBackupFile();
    setBackupDialogContent('<div class="backup-ready-icon">✓</div><p class="backup-dialog-copy">备份文件已准备好。点击下面按钮，在 iPhone 菜单中选择“存储到文件”，再保存到 iCloud Drive。</p>'
      + '<div class="backup-dialog-actions stacked"><button class="btn btn-primary" id="shareBackupBtn">保存到 iCloud</button><button class="btn btn-secondary" data-close-backup>稍后再说</button></div>');
    document.getElementById('shareBackupBtn').addEventListener('click', savePreparedBackup);
    bindBackupCloseButtons();
  } catch (e) { showBackupDialogError(e.message || '创建备份失败'); btn.disabled = false; btn.textContent = '创建备份'; }
}

async function savePreparedBackup() {
  if (!pendingBackupFile) return;
  const btn = document.getElementById('shareBackupBtn'); btn.disabled = true;
  try { await shareBackupFile(pendingBackupFile); closeBackupDialog(); showToast('备份文件已交给系统保存', 'success'); updateBackupUI(); }
  catch (e) { if (e.name !== 'AbortError') showBackupDialogError('保存失败，请重试'); btn.disabled = false; }
}

function handleBackupFileSelected(event) {
  const file = event.target.files && event.target.files[0]; event.target.value = '';
  if (!file) return;
  pendingRestore = { file, payload: null };
  openBackupDialog('打开备份', '<p class="backup-dialog-copy">已选择：' + escapeSettingsHtml(file.name) + '</p>'
    + '<p class="backup-dialog-warning" id="legacyPasswordHint" style="display:none;">这是旧版加密备份，需要输入当时设置的密码。</p>'
    + '<label class="backup-dialog-field" id="legacyPasswordField" style="display:none;">旧版备份密码<input type="password" id="restorePassword" autocomplete="current-password" placeholder="创建旧备份时使用的密码"></label>'
    + '<div class="backup-dialog-actions"><button class="btn btn-secondary" data-close-backup>取消</button><button class="btn btn-primary" id="readBackupBtn">查看备份</button></div>');
  document.getElementById('readBackupBtn').addEventListener('click', previewRestoreBackup);
}

async function previewRestoreBackup() {
  const passwordInput = document.getElementById('restorePassword');
  const password = passwordInput ? passwordInput.value : '';
  const btn = document.getElementById('readBackupBtn'); btn.disabled = true; btn.textContent = '正在验证…';
  try {
    const payload = await readBackupFile(pendingRestore.file, password); pendingRestore.payload = payload;
    const summary = await getBackupSummary({ progress: payload.progress, journals: payload.journals });
    setBackupDialogContent('<div class="backup-preview"><div><span>备份时间</span><strong>' + formatBackupTime(payload.createdAt) + '</strong></div><div><span>应用版本</span><strong>v' + escapeSettingsHtml(payload.appVersion || '未知') + '</strong></div><div><span>备份内容</span><strong>' + summary.progressCount + ' 天进度 · ' + summary.journalCount + ' 篇书写 · ' + summary.photoCount + ' 张照片</strong></div></div>'
      + '<p class="backup-dialog-copy">恢复时会合并数据，同一天保留更新的内容，不会删除本机已有记录。</p>'
      + '<div class="backup-dialog-actions"><button class="btn btn-secondary" data-close-backup>取消</button><button class="btn btn-primary" id="confirmRestoreBtn">合并并恢复</button></div>');
    document.getElementById('confirmRestoreBtn').addEventListener('click', confirmRestoreBackup); bindBackupCloseButtons();
  } catch (e) {
    if (e.message && e.message.includes('旧版加密备份')) {
      const hint = document.getElementById('legacyPasswordHint');
      const field = document.getElementById('legacyPasswordField');
      if (hint) hint.style.display = '';
      if (field) field.style.display = '';
    }
    showBackupDialogError(e.message); btn.disabled = false; btn.textContent = '查看备份';
  }
}

async function confirmRestoreBackup() {
  if (!pendingRestore || !pendingRestore.payload) return;
  const btn = document.getElementById('confirmRestoreBtn'); btn.disabled = true; btn.textContent = '正在恢复…';
  try { await restoreBackupPayload(pendingRestore.payload); setBackupDialogContent('<div class="backup-ready-icon">✓</div><p class="backup-dialog-copy">数据恢复完成。页面将重新加载。</p>'); setTimeout(() => window.location.reload(), 900); }
  catch (e) { showBackupDialogError(e.message || '恢复失败'); btn.disabled = false; btn.textContent = '合并并恢复'; }
}

function openBackupDialog(title, html) {
  closeSettings();
  let overlay = document.getElementById('backupDialogOverlay');
  if (!overlay) { overlay = document.createElement('div'); overlay.id = 'backupDialogOverlay'; overlay.className = 'backup-dialog-overlay'; overlay.innerHTML = '<div class="backup-dialog"><div class="backup-dialog-header"><h3></h3><button type="button" data-close-backup>×</button></div><div class="backup-dialog-body"></div><p class="backup-dialog-error" id="backupDialogError"></p></div>'; document.body.appendChild(overlay); }
  overlay.querySelector('h3').textContent = title; setBackupDialogContent(html); overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; bindBackupCloseButtons();
}
function setBackupDialogContent(html) { const body = document.querySelector('#backupDialogOverlay .backup-dialog-body'); if (body) body.innerHTML = html; const error = document.getElementById('backupDialogError'); if (error) error.textContent = ''; }
function bindBackupCloseButtons() { document.querySelectorAll('#backupDialogOverlay [data-close-backup]').forEach(btn => btn.onclick = closeBackupDialog); }
function closeBackupDialog() { const overlay = document.getElementById('backupDialogOverlay'); if (overlay) overlay.style.display = 'none'; document.body.style.overflow = ''; pendingBackupFile = null; }
function showBackupDialogError(message) { const el = document.getElementById('backupDialogError'); if (el) el.textContent = message; }
function escapeSettingsHtml(value) { const div = document.createElement('div'); div.textContent = value || ''; return div.innerHTML; }
