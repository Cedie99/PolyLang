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

const languages = {
  "af": "Afrikaans",
  "ar": "Arabic",
  "bg": "Bulgarian",
  "bn": "Bangla",
  "ca": "Catalan",
  "cs": "Czech",
  "da": "Danish",
  "nl": "Dutch",
  "de": "German",
  "el": "Greek",
  "en": "English",
  "et": "Estonian",
  "fil": "Filipino",
  "fi": "Finnish",
  "fr": "French",
  "gu": "Gujarati",
  "he": "Hebrew",
  "hi": "Hindi",
  "hr": "Croatian",
  "hu": "Hungarian",
  "id": "Indonesian",
  "it": "Italian",
  "ja": "Japanese",
  "kn": "Kannada",
  "ko": "Korean",
  "lt": "Lithuanian",
  "lv": "Latvian",
  "ml": "Malayalam",
  "mr": "Marathi",
  "ms": "Malay",
  "no": "Norwegian",
  "fa": "Persian",
  "pa": "Punjabi",
  "pl": "Polish",
  "pt": "Portuguese",
  "ro": "Romanian",
  "ru": "Russian",
  "sk": "Slovak",
  "sl": "Slovenian",
  "es": "Spanish",
  "sv": "Swedish",
  "ta": "Tamil",
  "te": "Telugu",
  "th": "Thai",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "vi": "Vietnamese",
  "zh-Hans": "Chinese (Simplified)",
  "zh-Hant": "Chinese (Traditional)"
};

function populateLanguageDropdown() {
  const select = document.getElementById('languageSelect');
  for (const code in languages) {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = languages[code];
    select.appendChild(option);
  }
}

populateLanguageDropdown();

// page content translation
async function translatePage(language) {
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeValue.trim()) textNodes.push(node);
  }

  for (const node of textNodes) {
    const originalText = node.nodeValue;

    try {
      const endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + language;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "DbfWVDjlQlmuqk9XS12kroLSAdUqYGrXz5egWeYiqGzyQmHxGKZaJQQJ99BEACqBBLyXJ3w3AAAbACOGmFj3",
          "Ocp-Apim-Subscription-Region": "southeastasia"
        },
        body: JSON.stringify([{ Text: originalText }])
      });

      const data = await response.json();

      if (data && data[0]?.translations?.[0]?.text) {
        node.nodeValue = data[0].translations[0].text;
      } else {
        console.error("Bad translation response:", data);
        node.nodeValue = '[Translation Error]';
      }
    } catch (error) {
      console.error("Error translating:", error);
      node.nodeValue = '[Translation Failed]';
    }
  }
}

//word or phrase translation
document.getElementById('textTranslateBtn').addEventListener('click', async () => {
  const text = document.getElementById('textInput').value.trim();
  const language = document.getElementById('languageSelect').value;
  const output = document.getElementById('translationOutput');

  if (!text) {
    output.textContent = 'Please enter some text.';
    return;
  }

  try {
    const endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + language;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "DbfWVDjlQlmuqk9XS12kroLSAdUqYGrXz5egWeYiqGzyQmHxGKZaJQQJ99BEACqBBLyXJ3w3AAAbACOGmFj3",
        "Ocp-Apim-Subscription-Region": "southeastasia"
      },
      body: JSON.stringify([{ Text: text }])
    });

    const data = await response.json();

    if (data && data[0]?.translations?.[0]?.text) {
      output.textContent = data[0].translations[0].text;
    } else {
      console.error("Bad translation response:", data);
      output.textContent = '[Translation Error]';
    }
  } catch (error) {
    console.error("Error translating:", error);
    output.textContent = '[Translation Failed]';
  }
});

