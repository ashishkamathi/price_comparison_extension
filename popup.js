document.getElementById('compare').addEventListener('click', () => {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<p class="loading">Loading alternatives...</p>';

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0].url;
    chrome.runtime.sendMessage({ action: "findAlternatives", url: currentUrl }, (response) => {
      if (response.success) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.alternatives, 'text/html');
        const rows = Array.from(doc.querySelectorAll('table tr'));
        
        const tableHtml = `
          <table>
            <thead>
              <tr>
                <th>Site</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows.slice(1).map(row => {
                const cells = row.querySelectorAll('td');
                const siteName = cells[0]?.innerText || "Unknown";
                const link = cells[1]?.querySelector('a'); // Check if <a> exists
                const productUrl = link ? link.href : "#";
                const price = cells[2]?.innerText || "N/A";

                return `
                  <tr>
                    <td>${siteName}</td>
                    <td>${price}</td>
                    <td>
                      ${
                        link 
                          ? `<a href="${productUrl}" target="_blank" class="btn">View Product</a>`
                          : "No Link"
                      }
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;

        resultsDiv.innerHTML = tableHtml;
      } else {
        resultsDiv.innerHTML = `<p id="error">Error: ${response.error}</p>`;
      }
    });
  });
});
