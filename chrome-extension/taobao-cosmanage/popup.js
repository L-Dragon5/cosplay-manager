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
  const price = document.querySelector('[class*="priceText--"]')?.textContent;
  const imagesNode = document.querySelectorAll(
    '[class*="thumbnailItem--"] img',
  );
  const images = new Set();
  const seller = document.querySelector('[class*="shopName--"]')?.textContent;
  const title = document.querySelector('[class*="mainTitle--"]')?.textContent;

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
