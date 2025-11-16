const express = require('express');
const crypto = require('crypto');
const { UniversalEdgeTTS } = require('universal-edge-tts');
const app = express();
const path = require("path");
const port = 3000;
const cors = require("cors")
const {put} = require("@vercel/blob")

app.use(express.text());
app.use(cors()); // Allow all origins, or configure specific origins
app.post('/generate-speech', async (req, res) => {
    const text = req.body;
    console.log(text);
    try {
        const tts = new UniversalEdgeTTS(text, 'en-US-BrianNeural');
        var result = await tts.synthesize();
        var fname = crypto.pseudoRandomBytes(16).toString("hex") + '-output.mp3'
        // Collect all the audio data chunks
        const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
        const { url } = await put(fname, audioBuffer, { access: 'public' });
        res.send(url);

    } catch (error) {
        console.error('Error calling TTS API:', error);
        res.status(500).send('Error generating speech.');
    }
});
app.use(express.static(path.join(__dirname,"public")));
app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});

module.exports = app; // Export the app for Vercel to use as a serverless function