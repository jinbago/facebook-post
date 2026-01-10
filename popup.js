function convertText(text) {
  const zeroWidthSpace = '\u200B';
  
  let result = text;
  
  result = result.replace(/\n/g, zeroWidthSpace + '\n' + zeroWidthSpace);
  
  result = result.replace(/  /g, ' ' + zeroWidthSpace + ' ');
  
  return result;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const inputText = document.getElementById('inputText');
  const convertButton = document.getElementById('convertButton');
  const message = document.getElementById('message');
  let messageTimeout;

  convertButton.addEventListener('click', async () => {
    const text = inputText.value;
    
    if (!text.trim()) {
      alert('テキストを入力してください');
      return;
    }
    
    const converted = convertText(text);
    const success = await copyToClipboard(converted);
    
    if (success) {
      message.classList.remove('hidden');
      
      if (messageTimeout) {
        clearTimeout(messageTimeout);
      }
      
      messageTimeout = setTimeout(() => {
        message.classList.add('hidden');
      }, 2000);
    } else {
      alert('コピーに失敗しました');
    }
  });
});
