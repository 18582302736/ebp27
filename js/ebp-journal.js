// EBP 结构化书写组件。CBT/ACT 继续使用 journal.js 的原组件。
function createEBPJournal(container, courseId, day, worksheetData, onSaveComplete) {
  const config = getEBPJournalConfig(day);
  if (!config) return createJournal(container, courseId, day, worksheetData, onSaveComplete);

  let state = defaultState(config);
  let entryId = null;
  let legacyText = '';
  let saveTimer = null;
  let hasCompleted = false;

  container.innerHTML = '<div class="journal-section structured-journal">'
    + '<div class="structured-intro"><h3>' + escapeJournalHtml(config.title) + '</h3>'
    + (config.note ? '<p>' + escapeJournalHtml(config.note) + '</p>' : '') + '</div>'
    + '<div class="structured-form"></div>'
    + '<details class="legacy-journal" hidden><summary>原有记录</summary><div class="legacy-journal-text"></div></details>'
    + (worksheetData.peerExample ? '<details class="ws-example"><summary>同行伙伴书写示例</summary><div class="ws-example-body">' + worksheetData.peerExample + '</div></details>' : '')
    + '<div class="structured-save-status">内容会自动保存在这台设备上</div>'
    + '<button class="btn btn-primary save-complete-btn"><span class="svg-icon">' + iconSave(16) + '</span> 保存并完成书写</button>'
    + '</div>';

  const form = container.querySelector('.structured-form');
  const status = container.querySelector('.structured-save-status');
  const completeBtn = container.querySelector('.save-complete-btn');

  function render() {
    if (config.type === 'repeat') renderRepeatForm();
    else if (config.type === 'mixed') renderMixedForm();
    else if (config.type === 'grouped') renderGroupedForm();
    else renderFixedForm();
    bindFormEvents();
    requestAnimationFrame(resizeAll);
  }

  function renderRepeatForm() {
    const items = state.items || [];
    form.innerHTML = '<div class="repeat-list">' + items.map((item, index) => repeatCardHtml(item, index, config.fields, config.repeatLabel, config.photos)).join('') + '</div>'
      + '<button class="btn btn-secondary structured-add" data-action="add-item">＋ 添加' + escapeJournalHtml(config.repeatLabel) + '</button>'
      + legacyUnassignedPhotosHtml()
      + sourceHelpHtml();
  }

  function renderMixedForm() {
    const items = state.items || [];
    form.innerHTML = '<div class="repeat-list">' + items.map((item, index) => repeatCardHtml(item, index, config.repeatFields, config.repeatLabel, config.photos)).join('') + '</div>'
      + '<button class="btn btn-secondary structured-add" data-action="add-item">＋ 添加' + escapeJournalHtml(config.repeatLabel) + '</button>'
      + '<div class="structured-fixed">' + fieldsHtml(config.fields, state.values || {}, 'fixed') + globalPhotosHtml() + '</div>'
      + sourceHelpHtml();
  }

  function renderGroupedForm() {
    form.innerHTML = '<div class="repeat-list">' + config.groups.map((group, index) => groupedCardHtml(group, state.items[index], index)).join('') + '</div>'
      + legacyUnassignedPhotosHtml()
      + sourceHelpHtml();
  }

  function renderFixedForm() {
    form.innerHTML = '<div class="structured-fixed">' + fieldsHtml(config.fields, state.values || {}, 'fixed') + globalPhotosHtml() + '</div>' + sourceHelpHtml();
  }

  function groupedCardHtml(group, item, index) {
    return '<section class="repeat-card" data-index="' + index + '">'
      + '<div class="repeat-card-header"><strong>' + escapeJournalHtml(group.label) + '</strong></div>'
      + fieldsHtml(group.fields, (item && item.values) || {}, 'item-' + index)
      + photosHtml((item && item.images) || [], 'item', index) + '</section>';
  }

  function repeatCardHtml(item, index, fields, label, photos) {
    return '<section class="repeat-card" data-index="' + index + '">'
      + '<div class="repeat-card-header"><strong>' + escapeJournalHtml(label) + ' ' + (index + 1) + '</strong>'
      + '<div class="repeat-card-actions">'
      + (index > 0 ? '<button type="button" data-action="move-up" aria-label="上移">↑</button>' : '')
      + (index < state.items.length - 1 ? '<button type="button" data-action="move-down" aria-label="下移">↓</button>' : '')
      + (state.items.length > (config.minItems || 1) ? '<button type="button" data-action="remove-item" aria-label="删除">删除</button>' : '') + '</div></div>'
      + fieldsHtml(fields, item.values || {}, 'item-' + index)
      + (photos ? photosHtml(item.images || [], 'item', index) : '') + '</section>';
  }

  function fieldsHtml(fields, values, scope) {
    return (fields || []).map(f => {
      if (f.kind === 'heading') return '<h4 class="structured-heading">' + escapeJournalHtml(f.label) + '</h4>';
      const value = values[f.key] == null ? '' : values[f.key];
      const attrs = 'data-scope="' + scope + '" data-key="' + f.key + '"';
      if (f.type === 'range') return rangeHtml(f, value, attrs);
      if (f.type === 'list') return listHtml(f, Array.isArray(value) ? value : [], scope);
      const tag = f.type === 'text' ? 'input' : 'textarea';
      const valueAttr = tag === 'input' ? ' value="' + escapeJournalAttr(value) + '"' : '';
      return '<label class="structured-field"><span>' + escapeJournalHtml(f.label) + '</span>'
        + '<' + tag + ' class="structured-input" ' + attrs + ' placeholder="' + escapeJournalAttr(f.placeholder || '写下你的回答…') + '"' + valueAttr + '>'
        + (tag === 'textarea' ? escapeJournalHtml(value) + '</textarea>' : '') + '</label>';
    }).join('');
  }

  function rangeHtml(f, value, attrs) {
    return '<div class="structured-field range-field"><span>' + escapeJournalHtml(f.label) + '</span>'
      + '<div class="range-choice" ' + attrs + '>'
      + Array.from({length: 9}, (_, i) => '<button type="button" data-action="range" data-value="' + (i + 1) + '" class="' + (String(value) === String(i + 1) ? 'selected' : '') + '">' + (i + 1) + '</button>').join('')
      + '</div><small>1 没有明显情绪 · 5 中等 · 9 最强烈</small></div>';
  }

  function listHtml(f, values, scope) {
    const rows = values.length ? values : [''];
    return '<div class="structured-field structured-list-field"><span>' + escapeJournalHtml(f.label) + '</span>'
      + '<div class="structured-list">' + rows.map((v, i) => '<div class="structured-list-row"><span>' + (i + 1) + '</span><textarea class="structured-input" data-scope="' + scope + '" data-key="' + f.key + '" data-list-index="' + i + '" placeholder="' + escapeJournalAttr(f.placeholder || '写下一项') + '">' + escapeJournalHtml(v) + '</textarea><button type="button" data-action="remove-list" aria-label="删除本项">×</button></div>').join('') + '</div>'
      + '<button type="button" class="structured-list-add" data-action="add-list" data-scope="' + scope + '" data-key="' + f.key + '">＋ 继续添加</button></div>';
  }

  function photosHtml(images, scope, index) {
    return '<div class="structured-photos"><div class="image-preview">' + images.map((src, i) => imageHtml(src, scope, index, i)).join('') + '</div>'
      + '<button type="button" class="btn btn-secondary btn-small" data-action="pick-images" data-photo-scope="' + scope + '" data-item-index="' + index + '"><span class="svg-icon">' + iconImage(16) + '</span> 添加照片</button>'
      + '<input type="file" class="hidden-input structured-image-input" data-photo-scope="' + scope + '" data-item-index="' + index + '" accept="image/*" multiple></div>';
  }

  function globalPhotosHtml() { return photosHtml(state.images || [], 'global', -1); }
  function legacyUnassignedPhotosHtml() {
    if (!state.images || !state.images.length) return '';
    return '<div class="structured-fixed"><h4 class="structured-heading">之前上传的未分组照片</h4><div class="image-preview">'
      + state.images.map((src, index) => imageHtml(src, 'global', -1, index)).join('') + '</div></div>';
  }
  function sourceHelpHtml() {
    if (!config.help) return '';
    return '<details class="ws-example structured-source-help"><summary>' + escapeJournalHtml(config.helpTitle || '原课程提示') + '</summary><div class="ws-example-body">' + escapeJournalHtml(config.help).replace(/\n/g, '<br>') + '</div></details>';
  }
  function imageHtml(src, scope, itemIndex, imageIndex) { return '<div class="image-preview-wrapper"><img class="image-preview-item" src="' + src + '" alt="练习照片 ' + (imageIndex + 1) + '" role="button" tabindex="0" aria-label="查看练习照片 ' + (imageIndex + 1) + ' 大图"><button type="button" class="image-remove-btn" aria-label="删除练习照片 ' + (imageIndex + 1) + '" data-action="remove-image" data-photo-scope="' + scope + '" data-item-index="' + itemIndex + '" data-image-index="' + imageIndex + '">×</button></div>'; }

  function bindFormEvents() {
    form.querySelectorAll('.structured-input').forEach(el => {
      el.addEventListener('input', updateFromInput);
      el.addEventListener('blur', saveNow);
    });
    form.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', handleAction));
    form.querySelectorAll('.structured-image-input').forEach(el => el.addEventListener('change', handleImages));
    form.querySelectorAll('.image-preview-item').forEach(bindImagePreview);
  }

  function updateFromInput(e) {
    const el = e.currentTarget;
    const target = valuesForScope(el.dataset.scope);
    if (el.dataset.listIndex != null) {
      if (!Array.isArray(target[el.dataset.key])) target[el.dataset.key] = [];
      target[el.dataset.key][Number(el.dataset.listIndex)] = el.value;
    } else target[el.dataset.key] = el.value;
    autoResizeStructured(el);
    scheduleSave();
  }

  function handleAction(e) {
    e.preventDefault();
    const action = e.currentTarget.dataset.action;
    const card = e.currentTarget.closest('.repeat-card');
    const index = card ? Number(card.dataset.index) : -1;
    if (action === 'add-item') state.items.push(newItem(config.type === 'mixed' ? config.repeatFields : config.fields));
    if (action === 'remove-item') state.items.splice(index, 1);
    if (action === 'move-up') [state.items[index - 1], state.items[index]] = [state.items[index], state.items[index - 1]];
    if (action === 'move-down') [state.items[index + 1], state.items[index]] = [state.items[index], state.items[index + 1]];
    if (action === 'range') {
      const box = e.currentTarget.closest('.range-choice');
      valuesForScope(box.dataset.scope)[box.dataset.key] = Number(e.currentTarget.dataset.value);
    }
    if (action === 'add-list' || action === 'remove-list') {
      const owner = action === 'add-list' ? e.currentTarget : e.currentTarget.closest('.structured-list-row').querySelector('.structured-input');
      const target = valuesForScope(owner.dataset.scope); const key = owner.dataset.key;
      if (!Array.isArray(target[key])) target[key] = [];
      if (action === 'add-list') target[key].push(''); else target[key].splice(Number(owner.dataset.listIndex), 1);
    }
    if (action === 'pick-images') {
      e.currentTarget.nextElementSibling.click(); return;
    }
    if (action === 'remove-image') {
      const scope = e.currentTarget.dataset.photoScope;
      const itemIndex = Number(e.currentTarget.dataset.itemIndex);
      const imageIndex = Number(e.currentTarget.dataset.imageIndex);
      const images = imagesForScope(scope, itemIndex);
      const removed = images.splice(imageIndex, 1)[0];
      render(); saveNow();
      showUndoToast('图片已删除', async () => {
        imagesForScope(scope, itemIndex).splice(Math.min(imageIndex, imagesForScope(scope, itemIndex).length), 0, removed);
        render(); await saveNow(); showToast('已恢复图片', 'success');
      });
      return;
    }
    render(); scheduleSave();
  }

  async function handleImages(e) {
    const input = e.currentTarget; const target = imagesForScope(input.dataset.photoScope, Number(input.dataset.itemIndex));
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const pickButton = input.previousElementSibling;
    pickButton.disabled = true;
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];
      pickButton.innerHTML = '<span class="upload-spinner" aria-hidden="true"></span> 正在处理 ' + (fileIndex + 1) + '/' + files.length;
      status.textContent = '正在处理第 ' + (fileIndex + 1) + '/' + files.length + ' 张图片…';
      if (file.size > 10 * 1024 * 1024) { showToast('单张图片不能超过10MB', 'error'); continue; }
      try {
        const compressed = await compressImage(file); target.push(await blobToBase64(compressed));
      } catch (err) { showToast('第 ' + (fileIndex + 1) + ' 张图片处理失败', 'error'); }
    }
    render(); await saveNow();
  }

  function valuesForScope(scope) { return scope === 'fixed' ? state.values : state.items[Number(scope.split('-')[1])].values; }
  function imagesForScope(scope, index) { return scope === 'global' ? state.images : state.items[index].images; }
  function scheduleSave() { status.textContent = '正在保存…'; clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 500); }
  async function saveNow() {
    clearTimeout(saveTimer);
    try { await saveJournalEntry(courseId, day, summaryText(config, state, legacyText), state.images || [], state); status.textContent = '已自动保存'; }
    catch (err) { status.textContent = '保存失败，请稍后重试'; }
  }

  completeBtn.addEventListener('click', async () => {
    await saveNow(); showToast('保存成功', 'success');
    if (!hasCompleted && onSaveComplete) { hasCompleted = true; await onSaveComplete(); }
  });

  getJournalEntry(courseId, day).then(entry => {
    if (entry) {
      entryId = entry.id || null;
      if (entry.form_data && entry.form_version >= 2) state = normalizeState(config, entry.form_data);
      else if (entry.text) {
        legacyText = entry.text;
        const details = container.querySelector('.legacy-journal');
        details.hidden = false; details.querySelector('.legacy-journal-text').textContent = entry.text;
      }
      if (entry.image_base64 && !state.images.length) state.images = entry.image_base64;
    }
    render();
  }).catch(() => render());

  render();
  return { save: saveNow, isSaved: () => true, getText: () => summaryText(config, state, legacyText) };
}

function defaultState(config) {
  const state = { values: {}, items: [], images: [] };
  if (config.type === 'grouped') {
    config.groups.forEach(group => state.items.push(newItem(group.fields)));
  } else if (config.type === 'repeat' || config.type === 'mixed') {
    const fields = config.type === 'mixed' ? config.repeatFields : config.fields;
    const count = Math.max(1, config.initialItems || 1);
    for (let i = 0; i < count; i++) state.items.push(newItem(fields));
  }
  return state;
}
function newItem(fields) { const values = {}; (fields || []).forEach(f => { if (f.kind === 'field') values[f.key] = f.type === 'list' ? [''] : ''; }); return { values, images: [] }; }
function normalizeState(config, data) {
  const base = defaultState(config);
  let items = Array.isArray(data.items) && data.items.length
    ? data.items.map(x => ({ values: x.values || {}, images: x.images || [] }))
    : base.items;
  if ((!data.items || !data.items.length) && config.legacyGroupCount && data.values) {
    items = Array.from({ length: config.legacyGroupCount }, (_, index) => {
      const values = {};
      (config.fields || []).forEach(field => {
        if (field.kind === 'field') values[field.key] = data.values[field.key + (index + 1)] || '';
      });
      return { values, images: [] };
    });
  }
  if ((!data.items || !data.items.length) && config.type === 'grouped' && data.values) {
    items = config.groups.map(group => {
      const values = {};
      group.fields.forEach(field => { if (field.kind === 'field') values[field.key] = data.values[field.key] || ''; });
      return { values, images: [] };
    });
  }
  if (config.type === 'repeat' || config.type === 'mixed') {
    const fields = config.type === 'mixed' ? config.repeatFields : config.fields;
    while (items.length < (config.minItems || 1)) items.push(newItem(fields));
  }
  return { values: config.type === 'grouped' ? base.values : (data.values || base.values), items, images: data.images || [] };
}
function summaryText(config, state, legacyText) { const lines = []; (state.items || []).forEach((item, i) => { const groupLabel = config.type === 'grouped' && config.groups[i] ? config.groups[i].label : (config.repeatLabel || '记录') + ' ' + (i + 1); lines.push(groupLabel); Object.values(item.values || {}).forEach(v => lines.push(Array.isArray(v) ? v.filter(Boolean).join('\n') : v || '')); }); Object.values(state.values || {}).forEach(v => lines.push(Array.isArray(v) ? v.filter(Boolean).join('\n') : v || '')); if (legacyText) lines.push('原有记录\n' + legacyText); return lines.filter(Boolean).join('\n'); }
function autoResizeStructured(el) { if (el.tagName !== 'TEXTAREA') return; el.style.height = 'auto'; el.style.height = Math.max(el.scrollHeight, 64) + 'px'; }
function resizeAll() { document.querySelectorAll('.structured-journal textarea').forEach(autoResizeStructured); }
function escapeJournalHtml(value) { const div = document.createElement('div'); div.textContent = String(value == null ? '' : value); return div.innerHTML; }
function escapeJournalAttr(value) { return escapeJournalHtml(value).replace(/"/g, '&quot;'); }
