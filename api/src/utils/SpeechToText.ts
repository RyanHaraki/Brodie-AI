const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const path = require("path");
const WaveFile = require("wavefile").WaveFile;

const speechConfig = sdk.SpeechConfig.fromSubscription(
  "AZURE_API_KEY",
  "AZURE_LOCATION"
);
speechConfig.speechRecognitionLanguage = "en-US";

export async function speechToText(buffer: any): Promise<string> {
  const outputPath = "assets/prompt.wav";

  fs.writeFileSync(outputPath, buffer);

  let recognizedText = "";
  let audioConfig = sdk.AudioConfig.fromWavFileInput(
    fs.readFileSync(outputPath)
  );
  let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  // Convert the callback-based recognizeOnceAsync to a promise-based approach
  await new Promise((resolve, reject) => {
    speechRecognizer.recognizeOnceAsync((result: any) => {
      switch (result.reason) {
        case sdk.ResultReason.RecognizedSpeech:
          recognizedText = result.text;
          resolve(recognizedText);
          break;
        case sdk.ResultReason.NoMatch:
          console.log("NOMATCH: no speech recognized");
          resolve("");
          break;
        case sdk.ResultReason.Canceled:
          const cancellation = sdk.CancellationDetails.fromResult(result);
          console.log(`CANCELED: Reason=${cancellation.reason}`);

          if (cancellation.reason == sdk.CancellationReason.Error) {
            console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
            console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
            console.log(`CANCELED: Did you update the subscription info?`);
          }
          reject(
            new Error(
              `Speech recognition canceled with reason: ${cancellation.reason}`
            )
          );
          break;
      }
      speechRecognizer.close();
    });
  });

  return recognizedText;
}
