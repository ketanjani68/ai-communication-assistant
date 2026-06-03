/**
 * Teams AI Enhance - Robust Inline Version
 * Uses original toolbar UI with the friend's robust replacement engine.
 */

(function () {
    if (window.__TEAMS_AI_LOADED__) return;
    window.__TEAMS_AI_LOADED__ = true;

    class TeamsAIEnhance {
        constructor() {
            this.editorMap = new Map();
            this.tone = 'professional';
            this.init();
        }

        init() {
            chrome.storage.sync.get(['tone'], (data) => {
                if (data.tone) this.tone = data.tone;
            });

            const scan = () => {
                if (!chrome.runtime?.id) return;
                this.findAllEditors(document).forEach(el => {
                    if (!el.dataset.aiInjected) this.inject(el);
                });
            };

            const observer = new MutationObserver(scan);
            observer.observe(document.body, { childList: true, subtree: true });
            setInterval(scan, 3000);
            scan();
        }

        inject(editable) {
            // Find parent to insert toolbar above
            const parent = editable.parentElement;
            if (!parent || parent.querySelector('#gf-toolbar')) return;

            const toolbar = document.createElement("div");
            toolbar.id = "gf-toolbar";
            // Use existing CSS classes from styles.css
            toolbar.innerHTML = `
        <div id="gf-btn-row" style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
            <button id="gf-grammar-btn" class="ai-action-btn">🔵 Grammar Check</button>
            <button id="gf-translate-btn" class="ai-action-btn">🟢 Hindi to ENG</button>
            <span id="gf-loading" style="font-size:12px; color:#6264a7; font-weight:bold;"></span>
        </div>
        <div id="gf-suggestion-box" style="display:none; margin-top:8px; padding:10px; border:1px solid #6264a7; border-radius:8px; background:rgba(98,100,167,0.05);">
            <div style="font-weight:bold; font-size:11px; color:#6264a7; margin-bottom:4px; text-transform:uppercase;">AI Suggestion:</div>
            <div id="gf-suggestion-text" style="font-size:13px; margin-bottom:10px; color:inherit;"></div>
            <div id="gf-suggestion-actions" style="display:flex; gap:8px;">
                <button id="gf-copy-btn" style="background:#6264a7; color:white; border:none; padding:5px 12px; border-radius:4px; cursor:pointer; font-weight:600; font-size:12px;">✅ Apply to Chat</button>
                <button id="gf-ignore-btn" style="background:none; border:1px solid #8a8886; padding:5px 12px; border-radius:4px; cursor:pointer; font-size:12px;">✕ Ignore</button>
            </div>
        </div>
      `;

            // Insert before the editable area
            editable.parentNode.insertBefore(toolbar, editable);
            editable.dataset.aiInjected = 'true';

            const tag = 'ai-' + Math.random().toString(36).substr(2, 9);
            editable.setAttribute('data-ai-target', tag);
            this.editorMap.set(tag, { el: editable, parent: editable.parentElement });

            // Event Listeners
            toolbar.querySelector('#gf-grammar-btn').onclick = (e) => { e.preventDefault(); this.handle(tag, 'grammar'); };
            toolbar.querySelector('#gf-translate-btn').onclick = (e) => { e.preventDefault(); this.handle(tag, 'translate'); };
            toolbar.querySelector('#gf-ignore-btn').onclick = (e) => {
                e.preventDefault();
                toolbar.querySelector('#gf-suggestion-box').style.display = 'none';
            };
            toolbar.querySelector('#gf-copy-btn').onclick = (e) => {
                e.preventDefault();
                const text = toolbar.querySelector('#gf-suggestion-text').textContent;
                toolbar.querySelector('#gf-suggestion-box').style.display = 'none';
                this.replaceFinal(tag, text);
            };
        }

        async handle(tag, mode) {
            const data = this.editorMap.get(tag);
            if (!data) return;
            const editable = data.el;
            const text = (editable.textContent || '').trim();
            if (!text) return;

            const toolbar = editable.parentElement.querySelector('#gf-toolbar');
            const statusEl = toolbar.querySelector('#gf-loading');
            const suggestionBox = toolbar.querySelector('#gf-suggestion-box');
            const suggestionText = toolbar.querySelector('#gf-suggestion-text');

            statusEl.textContent = mode === 'grammar' ? '⏳ Checking...' : '⏳ Translating...';
            suggestionBox.style.display = 'none';

            let prompt = "";
            if (mode === 'grammar') {
                prompt = `Fix the English grammar and punctuation mistakes in the following text. Make it ${this.tone} and professional. Return ONLY the corrected sentence, nothing else:\n\n${text}`;
            } else {
                prompt = `Translate the following Hindi or Hinglish text into ${this.tone} professional English suitable for workplace communication. Return ONLY the translated English text, nothing else:\n\n${text}`;
            }

            chrome.runtime.sendMessage({ action: 'callGroq', prompt: prompt }, (r) => {
                statusEl.textContent = '';
                if (r && r.success) {
                    suggestionText.textContent = r.text;
                    suggestionBox.style.display = 'block';
                } else {
                    statusEl.textContent = '❌ Error';
                    setTimeout(() => statusEl.textContent = '', 3000);
                }
            });
        }

        async replaceFinal(tag, text) {
            const data = this.editorMap.get(tag);
            let editor = data ? data.el : null;

            if (!editor || !editor.isConnected) {
                editor = this.findInShadows(document, tag) ||
                    (data && data.parent ? data.parent.querySelector('[contenteditable="true"]') : null);
            }

            if (!editor) return;

            editor.focus();
            const selection = window.getSelection();
            try {
                const range = document.createRange();
                range.selectNodeContents(editor);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('selectAll', false, null);
            } catch (e) { }

            // Backspace hammer
            for (let i = 0; i < 5; i++) {
                editor.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Backspace', code: 'Backspace' }));
                document.execCommand('delete', false, null);
                editor.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'deleteContentBackward' }));
            }

            editor.innerHTML = '';
            await new Promise(r => setTimeout(r, 30));

            // Paste trick
            const dataTransfer = new DataTransfer();
            dataTransfer.setData('text/plain', text);
            const pasteEvent = new ClipboardEvent('paste', {
                clipboardData: dataTransfer,
                bubbles: true,
                cancelable: true
            });

            editor.dispatchEvent(new InputEvent('beforeinput', {
                bubbles: true,
                inputType: 'insertFromPaste',
                dataTransfer: dataTransfer
            }));

            editor.dispatchEvent(pasteEvent);

            if (!editor.textContent.includes(text.substring(0, 3))) {
                document.execCommand('insertText', false, text);
            }

            editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste', data: text }));

            setTimeout(() => {
                editor.focus();
                const endRange = document.createRange();
                endRange.selectNodeContents(editor);
                endRange.collapse(false);
                selection.removeAllRanges();
                selection.addRange(endRange);
                editor.dispatchEvent(new Event('change', { bubbles: true }));
            }, 50);

            // Visual feedback
            editor.style.boxShadow = '0 0 10px #6264a7';
            setTimeout(() => editor.style.boxShadow = 'none', 1000);
        }

        findInShadows(root, tag) {
            let found = root.querySelector(`[data-ai-target="${tag}"]`);
            if (found) return found;
            const all = root.querySelectorAll('*');
            for (const el of all) {
                if (el.shadowRoot) {
                    found = this.findInShadows(el.shadowRoot, tag);
                    if (found) return found;
                }
            }
            return null;
        }

        findAllEditors(root) {
            let editors = Array.from(root.querySelectorAll('[contenteditable="true"]'));
            const all = root.querySelectorAll('*');
            all.forEach(el => {
                if (el.shadowRoot) editors = editors.concat(this.findAllEditors(el.shadowRoot));
            });
            return editors;
        }
    }

    new TeamsAIEnhance();
})();
