import express from 'express';
import axios from 'axios';

const router = express.Router();
const languageMap = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
    csharp: 51,
    c: 50,
};

router.post('/', async(req, res) => {
    const { language, code } = req.body || {};
    if (!language || !code) {
            return res.status(400).json({ error: 'Missing language or code in request body' });
    }

    const language_id = languageMap[language];
    if(!language_id) return res.status(400).json({ error: 'Unsupported Language'});

    try {
        const submission = await axios.post(
            'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
            {
                source_code: code,
                language_id: language_id,
            },
            {
                headers: {
                    'Content-Type':'application/json',
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                }
            }
        );

        const result = submission.data;
        res.json({
            output: result.stdout || result.stderr || result.compile_output || 'No output received',
        });
    } catch (err) {
        console.error('Execution error: ', err.message);
        res.status(500).json({error: 'code execution failed'});
    }
});

export default router;