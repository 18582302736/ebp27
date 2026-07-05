// journal.js - 书写练习组件

function createJournal(container, day, worksheetData) {
  const hasPDF = worksheetData && worksheetData.src;
  const prompt = worksheetData ? worksheetData.prompt : '记录今天的练习心得';
  const curiosityGuide = worksheetData ? worksheetData.curiosityGuide : null;

  const html = `
    <div class="journal-section">
      ${curiosityGuide ? `<div class="curiosity-guide">💡 ${curiosityGuide}</div>` : ''}
      <textarea class="journal-textarea" placeholder="${prompt}"></textarea>
      <div class="journal-actions">
        <button class="btn btn-secondary btn-small upload-image-btn">📷 添加图片</button>
        ${hasPDF ? `<a class="pdf-link" href="${worksheetData.src}" target="_blank" rel="noopener">📄 查看书写指南</a>` : `<span class="pdf-link" style="color: var(--text-muted);">📄 本日无书写指南，请根据提示自由书写</span>`}
      </div>
      <input type="file" class="hidden-input image-input" accept="image/*">
      <div class="image-preview"></div>
      <div class="save-hint">输入内容会自动保存</div>
    </div>
  `;
  container.innerHTML = html;

  const textarea = container.querySelector('.journal-textarea');
  const saveHint = container.querySelector('.save-hint');
  const uploadBtn = container.querySelector('.upload-image-btn');
  const imageInput = container.querySelector('.image-input');
  const imagePreview = container.querySelector('.image-preview');
  const curiosityEl = container.querySelector('.curiosity-guide');

  let savedImageBlob = null;
  let saveTimer = null;
  let loadedContent = null;

  // 保存函数
  async function doSave() {
    try {
      await saveJournalEntry(day, textarea.value, savedImageBlob);
      saveHint.textContent = '已自动保存 ✓';
      saveHint.style.color = 'var(--success)';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        saveHint.textContent = '输入内容会自动保存';
        saveHint.style.color = '';
      }, 2000);
    } catch (e) {
      console.error('保存失败:', e);
      saveHint.textContent = '保存失败';
      saveHint.style.color = '#d44';
    }
  }

  // 加载已有内容（仅当用户未开始输入时）
  getJournalEntry(day).then(entry => {
    loadedContent = entry;
    // 只在用户还没输入时恢复内容
    if (entry && entry.text && !textarea.value) {
      textarea.value = entry.text;
      saveHint.textContent = '已加载上次内容 ✓';
      saveHint.style.color = 'var(--success)';
      setTimeout(() => {
        saveHint.textContent = '输入内容会自动保存';
        saveHint.style.color = '';
      }, 2000);
    }
    if (entry && entry.image_blob) {
      savedImageBlob = entry.image_blob;
      showImagePreview(entry.image_blob);
    }
  }).catch(e => {
    console.error('加载日志失败:', e);
  });

  // 自动保存：输入后 1.5 秒自动保存
  textarea.addEventListener('input', () => {
    saveHint.textContent = '输入中...';
    saveHint.style.color = '';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => doSave(), 1500);
    // 用户开始输入时隐藏好奇心引导
    if (curiosityEl) {
      curiosityEl.style.opacity = '0';
      curiosityEl.style.maxHeight = '0';
      curiosityEl.style.marginBottom = '0';
    }
  });

  // 失焦时立即保存
  textarea.addEventListener('blur', () => {
    clearTimeout(saveTimer);
    if (textarea.value.trim()) {
      doSave();
    }
  });

  // 图片上传
  uploadBtn.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('图片不能超过10MB');
      return;
    }

    try {
      saveHint.textContent = '处理图片中...';
      const compressed = await compressImage(file);
      savedImageBlob = compressed;
      showImagePreview(compressed);
      await doSave();
    } catch (e) {
      console.error('图片处理失败:', e);
    }
  });

  function showImagePreview(blob) {
    const url = URL.createObjectURL(blob);
    imagePreview.innerHTML = `<img class="image-preview-item" src="${url}" alt="练习图片">`;
  }

  return {
    save: () => doSave(),
    isSaved() { return textarea.value.trim().length > 0; },
    getText() { return textarea.value; }
  };
}

async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxWidth = 800;
      const maxHeight = 800;
      let { width, height } = img;

      if (width > maxWidth) {
        height = height * (maxWidth / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = width * (maxHeight / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.7);
    };
    img.src = url;
  });
}