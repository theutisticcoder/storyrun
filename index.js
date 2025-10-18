const express = require('express');
const { EdgeTTS } = require('universal-edge-tts');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static("public")); // Serve your HTML file from a 'public' directory


app.post('/generate-speech', async (req, res) => {
    const text = res.body

    try {
        console.log(text)
        const tts = new EdgeTTS(text, 'en-US-EmmaMultilingualNeural');
        var buffer = await tts.synthesize();
        res.set('Content-Type', 'audio/mp3');
        res.send(buffer);
        console.log(buffer);
    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
