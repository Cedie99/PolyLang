<?php

use Illuminate\Http\Request;

class TranslateController extends Controller
{
    public function translate(Request $request)
    {
        try {
            // Prepare text and target language
            $text = $request->input('text');
            $targetLanguage = $request->input('target');

            // Azure Translation API URL
            $url = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=' . $targetLanguage;


            // API Key from Azure
            $apiKey = env('AZURE_TRANSLATOR_KEY');

            // Prepare headers for the API request
            $headers = [
                'Content-Type' => 'application/json',
                'Ocp-Apim-Subscription-Key' => $apiKey,
                'Ocp-Apim-Subscription-Region' => env('AZURE_TRANSLATOR_REGION'), // Region like 'eastus'
            ];

            // Prepare the body of the request
            $body = [
                [
                    'Text' => $text
                ]
            ];

            // Make the request to Azure's Translator API
            $response = Http::withHeaders($headers)->post($url, $body);

            // Check if the response was successful
            if ($response->successful()) {
                $translatedText = $response->json()[0]['translations'][0]['text'];
                return response()->json([
                    'translatedText' => $translatedText
                ]);
            } else {
                return response()->json([
                    'error' => 'Translation failed: ' . $response->body()
                ], 500);
            }

        } catch (\Exception $e) {
            \Log::error('Azure Translation Error', ['message' => $e->getMessage()]);
            return response()->json([
                'error' => 'Translation failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
