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
        
        const selection = window.getSelection();
        const text = selection.toString();
        
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
