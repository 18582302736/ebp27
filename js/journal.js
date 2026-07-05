// journal.js - 书写练习组件

function createJournal(container, day, worksheetData) {
  const hasPDF = worksheetData && worksheetData.src;
  const prompt = worksheetData ? worksheetData.prompt : '记录今天的练习心得';
  const curiosityGuide = worksheetData ? worksheetData.curiosityGuide : null;

  const html = `
    <div class="journal-section">
      ${curiosityGuide ? `<div class="curiosity-guide"><span class="svg-icon">${iconBulb(16)}</span> ${curiosityGuide}</div>` : ''}
      <textarea class="journal-textarea" placeholder="${prompt}"></textarea>
      <div class="journal-actions">
        <button class="btn btn-secondary btn-small save-btn"><span class="svg-icon">${iconSave(16)}</span> 保存</button>
        <button class="btn btn-secondary btn-small upload-image-btn"><span class="svg-icon">${iconImage(16)}</span> 添加图片</button>
        ${hasPDF ? `<a class="pdf-link" href="${worksheetData.src}"><span class="svg-icon">${iconFile(16)}</span> 查看书写指南</a>` : `<span class="pdf-link" style="color: var(--text-muted);"><span class="svg-icon">${iconFile(16)}</span> 本日无书写指南，请根据提示自由书写</span>`}
      </div>
      <input type="file" class="hidden-input image-input" accept="image/*" multiple>
      <div class="image-preview"></div>
      <div class="save-hint">点击「保存」按钮保存内容</div>
    </div>
  `;
  container.innerHTML = html;

  const textarea = container.querySelector('.journal-textarea');
  const saveHint = container.querySelector('.save-hint');
  const saveBtn = container.querySelector('.save-btn');
  const uploadBtn = container.querySelector('.upload-image-btn');
  const imageInput = container.querySelector('.image-input');
  const imagePreview = container.querySelector('.image-preview');
  const curiosityEl = container.querySelector('.curiosity-guide');

  let savedImageBlobs = [];
  let loadedContent = null;

  // 保存函数
  async function doSave() {
    try {
      await saveJournalEntry(day, textarea.value, savedImageBlobs);
      saveHint.textContent = '已保存';
      saveHint.style.color = 'var(--success)';
      setTimeout(() => {
        saveHint.textContent = '点击「保存」按钮保存内容';
        saveHint.style.color = '';
      }, 2000);
    } catch (e) {
      console.error('保存失败:', e);
      saveHint.textContent = '保存失败';
      saveHint.style.color = '#d44';
    }
  }

  // 加载已有内容
  getJournalEntry(day).then(entry => {
    loadedContent = entry;
    if (entry && entry.text && !textarea.value) {
      textarea.value = entry.text;
      saveHint.textContent = '已加载上次内容';
      saveHint.style.color = 'var(--success)';
      setTimeout(() => {
        saveHint.textContent = '点击「保存」按钮保存内容';
        saveHint.style.color = '';
      }, 2000);
    }
    if (entry && entry.image_blobs && entry.image_blobs.length > 0) {
      savedImageBlobs = entry.image_blobs;
      showImagePreviews(entry.image_blobs);
    }
  }).catch(e => {
    console.error('加载日志失败:', e);
  });

  // 手动保存按钮
  saveBtn.addEventListener('click', () => {
    if (textarea.value.trim()) {
      doSave();
    }
  });

  // 用户开始输入时隐藏好奇心引导
  textarea.addEventListener('input', () => {
    saveHint.textContent = '有未保存内容';
    saveHint.style.color = '';
    if (curiosityEl) {
      curiosityEl.style.opacity = '0';
      curiosityEl.style.maxHeight = '0';
      curiosityEl.style.marginBottom = '0';
    }
  });

  // 图片上传
  uploadBtn.addEventListener('click', () => imageInput.click());

  imageInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    saveHint.textContent = '处理图片中...';

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert('单张图片不能超过10MB');
        continue;
      }
      try {
        const compressed = await compressImage(file);
        savedImageBlobs.push(compressed);
      } catch (e) {
        console.error('图片处理失败:', e);
      }
    }

    showImagePreviews(savedImageBlobs);
    await doSave();
    imageInput.value = '';
  });

  function showImagePreviews(blobs) {
    imagePreview.innerHTML = '';
    blobs.forEach((blob, idx) => {
      const url = URL.createObjectURL(blob);
      const wrapper = document.createElement('div');
      wrapper.className = 'image-preview-wrapper';
      wrapper.innerHTML = `
        <img class="image-preview-item" src="${url}" alt="练习图片 ${idx + 1}">
        <button class="image-remove-btn" data-idx="${idx}">×</button>
      `;
      wrapper.querySelector('.image-remove-btn').addEventListener('click', async () => {
        savedImageBlobs.splice(idx, 1);
        showImagePreviews(savedImageBlobs);
        await doSave();
      });
      imagePreview.appendChild(wrapper);
    });
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