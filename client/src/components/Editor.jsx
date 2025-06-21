import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import axios from 'axios';
import socket from '../socket';
import Whiteboard from '../components/Whiteboard';

function CodeEditor({ roomId, username }) {
    const [code, setCode] = useState('// Start coding...');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const editorRef = useRef(null);
    const preventEmit = useRef(false);//prevents infinite emit loop

    const handleLanguageChange = (e) => setLanguage(e.target.value);
    const handleEditorChange = (value) => {
        setCode(value);
        if(!preventEmit.current) {
            socket.emit("code-change", {
                roomId,
                code: value,
            })
        }
    };

    const handleRun = async () => {
        setIsRunning(true);
        try{
            const res = await axios.post('http://localhost:5000/api/execute', {
                language,
                code,
            });
            setOutput(res.data.output);
        }
        catch (err) {
            setOutput(`Error: ${err.response?.data?.error || err.message}`);
        }
        setIsRunning(false);
    };
    useEffect(() => {
        if(!socket) return;
        socket.emit("Join", { roomId, username });
        const handleCodeUpdate = (incomingCode) => {
            preventEmit.current = true;
            setCode(incomingCode);

            if(editorRef.current) editorRef.current.setValue(incomingCode);

            setTimeout(() => {
                preventEmit.current = false;
            }, 100);
        };

        socket.on("code-update", handleCodeUpdate);

        socket.on("load-code", (incomingCode) => {
            preventEmit.current = true;
            setCode(incomingCode);
            if(editorRef.current) editorRef.current.setValue(incomingCode);
            setTimeout(() => {
                preventEmit.current = false;
            }, 100);
        });


        return () => {
            socket.off("code-update", handleCodeUpdate);
            socket.off("load-code");
        };
    }, [roomId, username]);


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
                onMount={(editor) => (editorRef.current = editor)} //need for sync
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
            <Whiteboard roomId={roomId}/>
        </div>
    );
};

export default CodeEditor;