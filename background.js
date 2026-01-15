chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'copy-with-whitespace',
    title: '改行を保持してコピー',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copy-with-whitespace') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const convertText = (text) => {
          const zeroWidthSpace = '\u200B';
          let result = text;
          result = result.replace(/\n/g, zeroWidthSpace + '\n' + zeroWidthSpace);
          result = result.replace(/  /g, ' ' + zeroWidthSpace + ' ');
          return result;
        };

        // 選択範囲から改行を保持したテキストを取得
        const getSelectionText = () => {
          const selection = window.getSelection();
          if (!selection.rangeCount) return '';

          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const fragment = range.cloneContents();

          // DOMノードを走査してテキストを構築
          const extractText = (node, result = '') => {
            if (node.nodeType === Node.TEXT_NODE) {
              return result + node.textContent;
            }

            // ブロック要素の前に改行を追加
            const blockElements = ['DIV', 'P', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI'];
            if (blockElements.includes(node.tagName)) {
              if (result.length > 0 && !result.endsWith('\n')) {
                result += '\n';
              }
            }

            for (const child of node.childNodes) {
              result = extractText(child, result);
            }

            // BR要素の後に改行を追加
            if (node.tagName === 'BR') {
              result += '\n';
            }

            return result;
          };

          let text = extractText(fragment);

          // 余分な改行を整理
          text = text.replace(/\n{3,}/g, '\n\n');
          text = text.trim();

          return text;
        };

        const text = getSelectionText();

        if (text) {
          const converted = convertText(text);
          navigator.clipboard.writeText(converted).then(() => {
            window.postMessage({ type: 'COPY_SUCCESS' }, '*');
          });
        }
      }
    });
  }
});
