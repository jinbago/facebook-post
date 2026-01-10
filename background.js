function convertText(text) {
  const zeroWidthSpace = '\u200B';
  
  let result = text;
  
  result = result.replace(/\n/g, zeroWidthSpace + '\n' + zeroWidthSpace);
  
  result = result.replace(/  /g, ' ' + zeroWidthSpace + ' ');
  
  return result;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'copy-with-whitespace',
    title: '改行を保持してコピー',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copy-with-whitespace' && info.selectionText) {
    const converted = convertText(info.selectionText);
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        navigator.clipboard.writeText(text).then(() => {
          window.postMessage({ type: 'COPY_SUCCESS' }, '*');
        });
      },
      args: [converted]
    });
  }
});
