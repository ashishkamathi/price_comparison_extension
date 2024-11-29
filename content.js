function extractProductInfo() {
  const title = document.querySelector('h1').innerText;
  const price = document.querySelector('.price').innerText;
  return { title, price };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getProductInfo") {
    sendResponse(extractProductInfo());
  }
});