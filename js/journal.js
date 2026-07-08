// journal.js - 书写练习组件

function createJournal(container, courseId, day, worksheetData, onSaveComplete) {
  // 兼容旧调用：createJournal(container, day, worksheetData, onSaveComplete)
  if (arguments.length === 4) {
    onSaveComplete = worksheetData;
    worksheetData = day;
    day = courseId;
    courseId = 'ebp';
  }
  const hasPDF = worksheetData && worksheetData.src;
  const prompt = worksheetData ? worksheetData.prompt : '记录今天的练习心得';
  const curiosityGuide = worksheetData ? worksheetData.curiosityGuide : null;
  const prompts = worksheetData && worksheetData.prompts ? worksheetData.prompts : null;
  const worksheetHtml = worksheetData && worksheetData.worksheetHtml ? worksheetData.worksheetHtml : null;
  const writingGuideAudio = worksheetData && worksheetData.writingGuideAudio ? worksheetData.writingGuideAudio : null;

  // 是否使用内联模板书写模式（模板内含多个 textarea）
  const isInlineMode = !!worksheetHtml;

  // 内联模板 HTML
  const templateHtml = worksheetHtml ? `
    <div class="journal-worksheet-html">
      ${worksheetHtml}
    </div>
  ` : '';

  const promptsHtml = (!worksheetHtml && prompts) ? `
    <div class="journal-prompts">
      <div class="journal-prompts-title"><span class="svg-icon">${iconBulb(14)}</span> 今日书写引导</div>
      <ol class="journal-prompts-list">
        ${prompts.map(p => `<li>${p}</li>`).join('')}
      </ol>
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

  const html = `
    <div class="journal-section">
      ${curiosityGuide ? `<div class="curiosity-guide"><span class="svg-icon">${iconBulb(16)}</span> ${curiosityGuide}</div>` : ''}
      ${templateHtml}
      ${writingGuideHtml}
      ${promptsHtml}
      ${isInlineMode ? '' : `<textarea class="journal-textarea" placeholder="${prompt}"></textarea>`}
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

  let savedImageBase64s = [];
  let hasCompleted = false;

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

  return {
    save: () => doSave(),
    isSaved() { return hasContent(); },
    getText() { return getText(); }
  };
}