const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../', req.file.path);
        const file = fs.createReadStream(filePath);

        const response = await openai.createTranscription(file, 'whisper-1');

        // Delete the file after transcription
        fs.unlinkSync(filePath);

        if (response.status === 200) {
            const transcript = response.data.text;
            // TODO: Save the transcript and metadata to GitHub or database
            res.status(200).json({ transcript });
        } else {
            res.status(500).json({ error: 'Failed to transcribe audio.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = app;