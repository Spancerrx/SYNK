import React from 'react';
import { useState } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios';

function CodeEditor({ roomId, username }) {
    const [code, setCode] = useState('// Start coding...');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleLanguageChange = (e) => setLanguage(e.target.value);
    const handleEditorChange = (value) => setCode(value);

    const handleRun = async () => {
        setIsRunning(true);
        try{
            const res = await axios.post('http://localhost:5000/api/execute', {
                language,
                code,
            });
            setOutput(res.data.output);
        }
        catch {
            setOutput(`Error: ${err.response?.data?.error || err.message}`);
        }
        setIsRunning(false);
    };

    return(
        <div>
            <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="language" style={{ marginRight: '1rem' }}>
                      Select Language:
                    </label>
                    <select id="language" value={language} onChange={handleLanguageChange}>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                      <option value="c">C</option>
                    </select>
                    <button onClick={handleRun} disabled={isRunning} style={{ marginLeft: `1rem` }}>{isRunning ? 'Running...' : 'Run'}</button>
            </div>
            <Editor
                height="70vh"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={handleEditorChange}
                options={{
                    fontSize: 14,
                    minimap: {enabled: false},
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                }}
            />
            <div style={{ marginTop: `1rem`, backgroundColor: `#f4f4f4`, padding: `rem`, borderRadius: `6px` }}>
                <h4>Output: </h4>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default CodeEditor;