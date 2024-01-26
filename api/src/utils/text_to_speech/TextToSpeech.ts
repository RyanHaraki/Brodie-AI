"use strict";
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var readline = require("readline");
const speechConfig = sdk.SpeechConfig.fromSubscription(
  "AZURE_API_KEY",
  "AZURE_LOCATION"
);

export const textToSpeech = async (text: string) => {
  var audioFile = "./assets/output.wav";
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

  speechConfig.speechSynthesisVoiceName = "en-GB-EthanNeural";

  var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.close();
  synthesizer.speakTextAsync(
    text,
    function (result: any) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error("speech synthesis canceled, " + result.errorDetails);
      }
      synthesizer.close();
      synthesizer = null;
    },
    function (err: unknown) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = null;
    }
  );
  console.log("now synthesizing to: " + audioFile);
};
