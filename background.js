chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "findAlternatives") {
    fetchAlternatives(request.url)
      .then((alternatives) => sendResponse({ success: true, alternatives }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for asynchronous response
  }
});

async function fetchAlternatives(url) {
  const apiKey = 'Perplexity_API_KEY_Here'; // Replace with your API key
  const apiEndpoint = 'https://api.perplexity.ai/chat/completions';
  const requestBody = {
    model: "llama-3.1-sonar-huge-128k-online",
    messages: [
      {
        role: "user",
        content: `For the product on this page: ${url}, find other ecommerce sites which have the same product listed for a cheaper price. Ensure the site is relevant in India and is an actual store from where you can buy and not blog or news site. output has to be HTML Code Create an HTML table of site name, page URL of the mentioned site, and price, and only return HTML code and nothing else.`,
      },
    ],
  };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Log the response for debugging
    console.log('API Response:', data);

    // Validate if HTML content exists
    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Invalid API response. No HTML content found.");
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to fetch alternatives. Please try again later.');
  }
}
