// journal.js - 书写练习组件

function createJournal(container, courseId, day, worksheetData, onSaveComplete) {
  // 兼容旧调用：createJournal(container, day, worksheetData, onSaveComplete)
  if (arguments.length === 4) {
    onSaveComplete = worksheetData;
    worksheetData = day;
    day = courseId;
    courseId = 'ebp';
  }
  const prompt = worksheetData ? (worksheetData.prompt || '记录今天的练习心得') : '记录今天的练习心得';
  const curiosityGuide = worksheetData ? worksheetData.curiosityGuide : null;
  const prompts = worksheetData && worksheetData.prompts ? worksheetData.prompts : null;
  const worksheetHtml = worksheetData && worksheetData.worksheetHtml ? worksheetData.worksheetHtml : null;
  const writingGuideAudio = worksheetData && worksheetData.writingGuideAudio ? worksheetData.writingGuideAudio : null;
  const peerExample = worksheetData && worksheetData.peerExample ? worksheetData.peerExample : null;

  // EBP: 有 prompts 但没有 worksheetHtml 时，自动生成内联模板
  const isInlineMode = !!worksheetHtml || !!prompts;
  const generatedTemplateHtml = (!worksheetHtml && prompts) ? buildPromptsTemplate(prompts) : '';

  // 内联模板 HTML
  const templateHtml = (worksheetHtml || generatedTemplateHtml) ? `
    <div class="journal-worksheet-html">
      ${worksheetHtml || generatedTemplateHtml}
    </div>
  ` : '';

  const promptsHtml = (!isInlineMode && prompts) ? `
    <div class="journal-prompts">
      <div class="journal-prompts-title"><span class="svg-icon">${iconBulb(14)}</span> 今日书写引导</div>
      <ul class="journal-prompts-list">
        ${prompts.map(p => `<li>${p}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  const writingGuideHtml = writingGuideAudio ? `
    <div class="writing-guide-audio">
      <div class="writing-guide-header">
        <span class="svg-icon">${iconHeadphones(16)}</span> ${writingGuideAudio.title || '书写语音引导'}
        <span class="writing-guide-duration">${writingGuideAudio.duration || ''}</span>
      </div>
      <div class="writing-guide-player"></div>
    </div>
  ` : '';

  const peerExampleHtml = peerExample ? `
    <details class="ws-example">
      <summary>同行伙伴书写示例</summary>
      <div class="ws-example-body">${peerExample}</div>
    </details>
  ` : '';

  const html = `
    <div class="journal-section">
      ${curiosityGuide ? `<div class="curiosity-guide"><span class="svg-icon">${iconBulb(16)}</span> ${curiosityGuide}</div>` : ''}
      ${templateHtml}
      ${writingGuideHtml}
      ${promptsHtml}
      ${isInlineMode ? '' : `<textarea class="journal-textarea" placeholder="${prompt}"></textarea>`}
      <div class="journal-actions">
        <button class="btn btn-secondary btn-small upload-image-btn"><span class="svg-icon">${iconImage(16)}</span> 添加图片</button>
      </div>
      <input type="file" class="hidden-input image-input" accept="image/*" multiple>
      <div class="image-preview"></div>
      ${peerExampleHtml}
      <button class="btn btn-primary save-complete-btn"><span class="svg-icon">${iconSave(16)}</span> 保存并完成书写</button>
    </div>
  `;
  container.innerHTML = html;

  // 初始化书写引导音频播放器
  if (writingGuideAudio) {
    const playerContainer = container.querySelector('.writing-guide-player');
    if (playerContainer && typeof createAudioPlayer === 'function') {
      createAudioPlayer(playerContainer, writingGuideAudio.src, () => {});
    }
  }

  const textarea = container.querySelector('.journal-textarea');
  const wsTextareas = container.querySelectorAll('.ws-textarea');
  const curiosityEl = container.querySelector('.curiosity-guide');
  const saveCompleteBtn = container.querySelector('.save-complete-btn');
  const uploadBtn = container.querySelector('.upload-image-btn');
  const imageInput = container.querySelector('.image-input');
  const imagePreview = container.querySelector('.image-preview');

  let savedImageBase64s = [];
  let hasCompleted = false;

  // 自动撑高所有 textarea
  function autoResize(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.max(ta.scrollHeight, parseInt(getComputedStyle(ta).minHeight) || 64) + 'px';
  }
  const allTAs = container.querySelectorAll('textarea');
  allTAs.forEach(ta => {
    ta.addEventListener('input', () => autoResize(ta));
    autoResize(ta);
  });

  // 获取当前书写文本：内联模式合并所有 ws-textarea，否则取单个 textarea
  function getText() {
    if (isInlineMode && wsTextareas.length > 0) {
      const parts = [];
      wsTextareas.forEach(ta => parts.push(ta.value));
      return parts.join('\n===\n');
    }
    return textarea ? textarea.value : '';
  }

  // 设置书写文本：内联模式拆分到各 ws-textarea
  function setText(text) {
    if (isInlineMode && wsTextareas.length > 0) {
      const parts = text.split('\n===\n');
      wsTextareas.forEach((ta, i) => {
        if (i < parts.length) ta.value = parts[i];
      });
    } else if (textarea) {
      textarea.value = text;
    }
  }

  // 检查是否有内容
  function hasContent() {
    if (isInlineMode && wsTextareas.length > 0) {
      return Array.from(wsTextareas).some(ta => ta.value.trim().length > 0);
    }
    return textarea && textarea.value.trim().length > 0;
  }

  // 保存函数
  async function doSave() {
    try {
      await saveJournalEntry(courseId, day, getText(), savedImageBase64s);
      return true;
    } catch (e) {
      console.error('保存失败:', e);
      throw e;
    }
  }

  // 加载已有内容
  getJournalEntry(courseId, day).then(entry => {
    if (entry && entry.text && !hasContent()) {
      setText(entry.text);
    }
    if (entry && entry.image_base64 && entry.image_base64.length > 0) {
      savedImageBase64s = entry.image_base64;
      showImagePreviews(entry.image_base64);
    }
  }).catch(e => {
    console.error('加载日志失败:', e);
  });

  // 保存按钮
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

  // 失焦自动保存（所有 textarea）
  const allTextareas = isInlineMode ? wsTextareas : (textarea ? [textarea] : []);
  allTextareas.forEach(ta => {
    ta.addEventListener('blur', async () => {
      try { await doSave(); } catch (e) {}
    });
    ta.addEventListener('input', () => {
      if (curiosityEl) {
        curiosityEl.style.opacity = '0';
        curiosityEl.style.maxHeight = '0';
        curiosityEl.style.marginBottom = '0';
      }
    });
  });

  // 图片上传
  if (uploadBtn && imageInput) {
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
        } catch (err) {
          console.error('图片处理失败:', err);
        }
      }

      showImagePreviews(savedImageBase64s);
      try {
        await doSave();
      } catch (err) {
        showToast('图片保存失败', 'error');
      }
      imageInput.value = '';
    });
  }

  function showImagePreviews(base64s) {
    if (!imagePreview) return;
    imagePreview.innerHTML = '';
    base64s.forEach((dataUrl, idx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'image-preview-wrapper';
      wrapper.innerHTML = `
        <img class="image-preview-item" src="${dataUrl}" alt="练习图片 ${idx + 1}">
        <button class="image-remove-btn" data-idx="${idx}">&times;</button>
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
    isSaved() { return hasContent(); },
    getText() { return getText(); }
  };
}

// 从 prompts 数组生成 ws-question/ws-textarea 内联模板
function buildPromptsTemplate(prompts) {
  if (!prompts || prompts.length === 0) return '';
  return prompts.map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `<div class="ws-question">
      <span class="ws-q-num">${num}</span>
      <span class="ws-q-text">${p}</span>
    </div>
    <textarea class="ws-textarea" placeholder="写下你的回答..."></textarea>`;
  }).join('');
}

// 图片压缩
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

// Blob 转 Base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
