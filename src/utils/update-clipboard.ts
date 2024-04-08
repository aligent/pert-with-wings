export const updateClipboard = (content: string) => {
  const tempHTMLContainer = document.createElement('ul');
  tempHTMLContainer.innerHTML = content;
  const blobHTML = new Blob([tempHTMLContainer.outerHTML], {
    type: 'text/html',
  });
  const blobText = new Blob([tempHTMLContainer.outerHTML], {
    type: 'text/plain',
  });
  const clipboardItemInput = new ClipboardItem({
    ['text/plain']: blobText,
    ['text/html']: blobHTML,
  });
  navigator.clipboard
    .write([clipboardItemInput])
    .then(() => console.log('content copied to clipboard'));
};
