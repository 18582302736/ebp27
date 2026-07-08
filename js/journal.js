// journal.js - 书写练习组件

function createJournal(container, day, worksheetData, onSaveComplete) {
  const hasPDF = worksheetData && worksheetData.src;
  const prompt = worksheetData ? worksheetData.prompt : '记录今天的练习心得';
  const curiosityGuide = worksheetData ? worksheetData.curiosityGuide : null;

  const html = `
    <div class="journal-section">
      ${curiosityGuide ? `<div class="curiosity-guide"><span class="svg-icon">${iconBulb(16)}</span> ${curiosityGuide}</div>` : ''}
      <textarea class="journal-textarea" placeholder="${prompt}"></textarea>
      <div class="journal-actions">
        <button class="btn btn-secondary btn-small upload-image-btn"><span class="svg-icon">${iconImage(16)}</span> 添加图片</button>
        ${hasPDF ? `<a class="pdf-link" href="${worksheetData.src}" target="_blank" rel="noopener"><span class="svg-icon">${iconFile(16)}</span> 查看书写指南</a>` : `<span class="pdf-link" style="color: var(--text-muted);"><span class="svg-icon">${iconFile(16)}</span> 本日无书写指南，请根据提示自由书写</span>`}
      </div>
      <input type="file" class="hidden-input image-input" accept="image/*" multiple>
      <div class="image-preview"></div>
      <button class="btn btn-primary save-complete-btn" style="margin-top:12px;width:100%;justify-content:center;"><span class="svg-icon">${iconSave(16)}</span> 保存并完成书写</button>
    </div>
  `;
  container.innerHTML = html;

  const textarea = container.querySelector('.journal-textarea');
  const uploadBtn = container.querySelector('.upload-image-btn');
  const imageInput = container.querySelector('.image-input');
  const imagePreview = container.querySelector('.image-preview');
  const curiosityEl = container.querySelector('.curiosity-guide');
  const saveCompleteBtn = container.querySelector('.save-complete-btn');

  let savedImageBase64s = [];
  let hasCompleted = false;

  // 保存函数（不触发完成回调）
  async function doSave() {
    try {
      await saveJournalEntry(day, textarea.value, savedImageBase64s);
      return true;
    } catch (e) {
      console.error('保存失败:', e);
      throw e;
    }
  }

  // 加载已有内容
  getJournalEntry(day).then(entry => {
    if (entry && entry.text && !textarea.value) {
      textarea.value = entry.text;
    }
    if (entry && entry.image_base64 && entry.image_base64.length > 0) {
      savedImageBase64s = entry.image_base64;
      showImagePreviews(entry.image_base64);
    }
  }).catch(e => {
    console.error('加载日志失败:', e);
  });

  // 更新保存按钮：保存 + 触发完成
  saveCompleteBtn.addEventListener('click', async () => {
    try {
      await doSave();
      showToast('保存成功', 'success');
      if (onSaveComplete && !hasCompleted) {
        hasCompleted = true;
        await onSaveComplete();
      }
    } catch (e) {
      showToast('保存失败', 'error');
    }
  });

  // 失焦自动保存（不触发完成回调）
  textarea.addEventListener('blur', async () => {
    try {
      await doSave();
    } catch (e) {
      // 静默保存失败
    }
  });

  // 用户开始输入时隐藏好奇心引导
  textarea.addEventListener('input', () => {
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

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('单张图片不能超过10MB', 'error');
        continue;
      }
      try {
        const compressed = await compressImage(file);
        const base64 = await blobToBase64(compressed);
        savedImageBase64s.push(base64);
      } catch (e) {
        console.error('图片处理失败:', e);
      }
    }

    showImagePreviews(savedImageBase64s);
    try {
      await doSave();
    } catch (e) {
      showToast('图片保存失败', 'error');
    }
    imageInput.value = '';
  });

  function showImagePreviews(base64s) {
    imagePreview.innerHTML = '';
    base64s.forEach((dataUrl, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-preview-wrapper';
      wrapper.innerHTML = `
        <img class="image-preview-item" src="${dataUrl}" alt="练习图片 ${idx + 1}">
        <button class="image-remove-btn" data-idx="${idx}">×</button>
      `;
      wrapper.querySelector('.image-remove-btn').addEventListener('click', async () => {
        savedImageBase64s.splice(idx, 1);
        showImagePreviews(savedImageBase64s);
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