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


app.get('/key', async (req, res) => {
    res.send(process.env.key)
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
