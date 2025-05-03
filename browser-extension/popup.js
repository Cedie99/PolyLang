document.getElementById('translateBtn').addEventListener('click', () => {
  const language = document.getElementById('languageSelect').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    if (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) {
      alert("Cannot translate this page.");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: translatePage,
      args: [language]
    });
  });
});

async function translatePage(language) {
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
      if (node.nodeValue.trim()) textNodes.push(node);
  }

  textNodes.forEach(async (node) => {
      const originalText = node.nodeValue;
      console.log(`Translating: ${originalText}`); // Log the original text

      try {
          const endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + language;

          const response = await fetch(endpoint, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Ocp-Apim-Subscription-Key": "DbfWVDjlQlmuqk9XS12kroLSAdUqYGrXz5egWeYiqGzyQmHxGKZaJQQJ99BEACqBBLyXJ3w3AAAbACOGmFj3",
                  "Ocp-Apim-Subscription-Region": "southeastasia" // e.g., "eastus"
              },
              body: JSON.stringify([{ "Text": originalText }])
          });

          const data = await response.json();
          console.log('Translation response:', data); // Log the entire API response

          if (data && data[0] && data[0].translations && data[0].translations[0]) {
              const translatedText = data[0].translations[0].text;
              console.log(`Original: ${originalText}, Translated: ${translatedText}`); // Log the original and translated text
              node.nodeValue = translatedText;
          } else {
              console.error('Translation error:', data); // Log error if translation data is missing
              node.nodeValue = '[Translation Error]';
          }
      } catch (error) {
          console.error('Translation error:', error); // Log any errors during fetch
          node.nodeValue = '[Translation Error]';  // Show error message if API call fails
      }
  });
}
