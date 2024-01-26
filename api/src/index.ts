// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { textToSpeech } from "./utils/text_to_speech/TextToSpeech";
import { speechToText } from "./utils/SpeechToText";
import multer from "multer";

dotenv.config();

// Load environment variables
const openai = new OpenAI({
  apiKey: "OPENAI_API_KEY",
});

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", async (req: Request, res: Response) => {
  textToSpeech(
    "Of all the planets in star wars what is your favourite and why?"
  );

  res.send("this worked");
});

// talk
app.post(
  "/conversate",
  upload.single("audio"),
  (req: Request, res: Response) => {
    const audio = req!.file!.buffer;

    console.log(req!.file!.buffer);

    // //  call benny's code in order to generate a text query from the .wav file
    speechToText(audio)
      .then(async (text: string) => {
        try {
          const completion = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content:
                  "Your name is Brodie AI. All of your responses will be in the same manner as the robot C3PO. Your primary goal is to be helpful to the person takling to you. Please keep your answers concise, 1-3 sentences maximum per response.",
              },
              {
                role: "user",
                content: text,
              },
            ],
            model: "gpt-3.5-turbo",
          });

          const GPTOutput =
            completion.choices[0].message.content || "This did not work";

          // Now call the textToSpeech function to convert the GPTOutput to speech
          await textToSpeech(GPTOutput);

          // After converting to speech, send the path to the audio file as the response
          const audioFilePath = path.join(__dirname, "../assets/output.wav");

          // uploadFile(fs.createReadStream(audioFilePath), "output.wav");

          setTimeout(() => {
            res.sendFile(audioFilePath);
          }, 5000);
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .send("An error occurred while processing the request.");
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Failed to convert speech to text.");
      });
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
