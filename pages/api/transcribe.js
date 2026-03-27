// pages/api/transcribe.js

import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { audioFile, metadata } = req.body;
            const transcription = await openai.transcriptions.create({
                model: 'whisper-1',
                file: audioFile,
            });

            const filePath = path.join(process.cwd(), 'transcriptions', `${Date.now()}_transcription.txt`);
            fs.writeFileSync(filePath, transcription.text);
            
            // Metadata generation
            const metadataFilePath = path.join(process.cwd(), 'transcriptions', `${Date.now()}_metadata.json`);
            fs.writeFileSync(metadataFilePath, JSON.stringify(metadata));

            res.status(200).json({ transcription: transcription.text, metadata });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}