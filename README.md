PolyLang Translator

PolyLang is a translation web extension and service that uses Azure Cognitive Services to translate text from one language to another. This project is split into two parts: the frontend (browser extension) and the backend (API for translation).

Features
- Translate web pages via a browser extension.
- Use Azure Cognitive Services for translations.
- Supports multiple languages via the extension interface.

Table of Contents
1. Prerequisites
2. Setup
   - Frontend (Browser Extension)
   - Backend (Laravel API)
3. Usage
4. Contributing
5. License

Prerequisites
Before getting started, make sure you have the following installed:

- PHP and Laravel (for running the backend API)
- Composer (for managing PHP dependencies)
- Git (for version control)
- Azure Cognitive Services Account (for using the translation API)

Setup

Frontend (Browser Extension)

1. Clone the Repository

   If you haven't cloned the repository yet, run the following command:

   git clone https://github.com/Cedie99/PolyLang.git
   cd PolyLang

2. Install the Extension Locally

   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer Mode" (top-right corner).
   - Click on "Load Unpacked" and select the folder containing the extension files.
   - You should now be able to use the extension on any website.

4. Set Up Azure API Key

   - Create an Azure Cognitive Services Translator instance.
   - Add your **API Key** and **Region** in the `background.js` or the extension's configuration file to authenticate with the translation API.

Backend (Laravel API)

1. Clone the Repository

   If you haven't cloned the repository yet, run the following command:

   git clone https://github.com/Cedie99/PolyLang.git
   cd PolyLang/backend

2. Install PHP Dependencies

   Ensure you have Composer installed and run the following command to install the necessary dependencies for the Laravel backend:

   composer install

3. Configure Environment Variables

   Copy `.env.example` to `.env` and update the environment variables, especially the Azure translation API key:

   cp .env.example .env

   Edit the `.env` file:

   AZURE_TRANSLATOR_KEY=your-azure-subscription-key
   AZURE_TRANSLATOR_REGION=your-azure-region

4. Run the Laravel Development Server

   Run the Laravel development server:

   php artisan serve

   This will start your backend API at `http://localhost:8000`.

Usage

Frontend (Browser Extension)

1. Translate Web Pages
   - Click on the extension icon in your browser.
   - Select the language you want to translate the page into.
   - The page will automatically reload with the translated text.


Backend (Laravel API)

1. API Endpoint for Translation

   The backend exposes an endpoint that can be used to translate text:

   POST /api/translate

   - Request body: 

     {
       "text": "Text to be translated",
       "target": "Target language code (e.g., 'fr' for French)"
     }

   - Response:

     {
       "translatedText": "Translated text"
     }

2. Example Request:
   
   You can test the API using a tool like Postman or cURL.

   curl -X POST http://localhost:8000/api/translate \
        -H "Content-Type: application/json" \
        -d '{"text": "Hello, world!", "target": "es"}'

   The response will be:

   {
     "translatedText": "¡Hola, mundo!"
   }

Contributing

Contributions are always welcome! If you'd like to contribute, feel free to submit a pull request or open an issue.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request.

License

This project is licensed under the MIT License - see the LICENSE file for details.
