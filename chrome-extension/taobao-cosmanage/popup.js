const exportData = document.getElementById('exportData');

exportData.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getItemInfo,
  });

  const copied = document.getElementById('copied');
  copied.style.display = 'flex';
  setTimeout(() => {
    copied.style.display = 'none';
  }, 500);
});

function getItemInfo() {
  const price = document.querySelector('span[class*="priceText--"]')?.innerHTML;
  const imagesNode = document.querySelectorAll('li[class*="thumbnail--"] img');
  const images = new Set();
  const seller = document.querySelector('span[class*="shopName--"]')?.innerHTML;
  const title = document
    .querySelector('div[class*="ItemTitle--"] h1')
    ?.innerHTML?.replace(/\\u([0-9a-fA-F]{4})/g, (whole, group1) => {
      return String.fromCharCode(Number.parseInt(group1, 16));
    });

  for (let i = 0; i < imagesNode.length; i++) {
    images.add(imagesNode[i].src);
  }

  const finalProduct = {
    price: price !== '' ? price : -1,
    images: Array.from(images),
    seller,
    title,
    url: window.location.href,
  };

  const copyFrom = document.createElement('textarea');
  copyFrom.textContent = JSON.stringify(finalProduct);
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}
