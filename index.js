const express = require('express');
const OpenAI = require('openai');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve your HTML file from a 'public' directory

const openai = new OpenAI({
    apiKey: "sk-7890abcdef7890abcdef7890abcdef7890abcd", // Set your OpenAI API key as an environment variable
});

app.post('/generate-speech', async (req, res) => {
    const { text } = req.body;

    try {
        const speechResponse = await openai.audio.speech.create({
            model: "tts-1", // or "tts-1-hd" for higher quality
            voice: "alloy", // Choose from available voices: alloy, echo, fable, onyx, nova, shimmer
            input: text,
            response_format: "mp3", // or opus, aac, flac, wav, pcm
        });

        const buffer = Buffer.from(await speechResponse.arrayBuffer());

        res.set('Content-Type', 'audio/mp3');
        res.send(buffer);

    } catch (error) {
        console.error('Error calling OpenAI TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});