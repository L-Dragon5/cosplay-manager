const exportData = document.getElementById("exportData");

exportData.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getItemInfo,
  });
});

function getItemInfo() {
  const scripts = document.head.getElementsByTagName('script');
  const config = scripts[63].innerHTML;
  const scriptParts = config.split('};');
  const firstCurlyBracket = scriptParts[0].indexOf('{');
  const jsObj = scriptParts[0].substring(firstCurlyBracket + 1);
  const jsObjSplit = jsObj.split(',');

  const productArray = {};

  jsObjSplit.map((item) => {
    const colonSplit = item.split(':');
    const key = colonSplit[0].trim();
    let value = "";
    if (colonSplit[1] !== null && colonSplit[1] !== '') {
      value = colonSplit[1];
    }

    productArray[key] = value?.replaceAll("'", '').trim();
  });

  const finalProduct = {
    price: productArray['price'] !== '' ? productArray['price'] : -1,
    image: productArray['pic'],
    seller: productArray['sellerNick'],
    title: productArray['title'].replace(/\\u([0-9a-fA-F]{4})/g, function (whole, group1) {
        return String.fromCharCode(parseInt(group1, 16));
    }),
    url: window.location.href,
  };

  const copyFrom = document.createElement("textarea");
  copyFrom.textContent = JSON.stringify(finalProduct);
  document.body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  copyFrom.blur();
  document.body.removeChild(copyFrom);
  alert('Copied');
}
