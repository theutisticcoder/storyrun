const express = require('express');
const { EdgeTTS } = require('universal-edge-tts');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors({
        origin: 'https://storyrun.vercel.app/generate-speech', // Or '*' for all origins (use with caution)
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    }));
app.use(express.json());
app.use(express.static("public")); // Serve your HTML file from a 'public' directory


app.post('/generate-speech', async (req, res) => {
    const { text } = req.body;

    try {

        const tts = new EdgeTTS(text, 'en-US-EmmaMultilingualNeural');
        var buffer = await tts.synthesize();
        res.set('Content-Type', 'audio/mp3');
        res.send(buffer);

    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});