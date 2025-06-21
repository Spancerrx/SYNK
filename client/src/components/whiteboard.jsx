import React from 'react';
import { useEffect, useRef, useState } from 'react';
import socket from '../socket';

function Whiteboard({ roomId }) {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [penColor, setPenColor] = useState('#000000');
    const [penSize, setPenSize] = useState(2);
    const [penOpacity, setPenOpacity] = useState(1);
    const lastPos = useRef({ x: 0, y: 0 });
    const resizeCanvasWithBuffer = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Create buffer
        const buffer = document.createElement('canvas');
        buffer.width = canvas.width;
        buffer.height = canvas.height;
        const bufferCtx = buffer.getContext('2d');
        bufferCtx.drawImage(canvas, 0, 0);

        // Resize
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Restore from buffer
        ctx.drawImage(buffer, 0, 0);
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        resizeCanvasWithBuffer();
        window.addEventListener("resize", resizeCanvasWithBuffer);

        ctx.lineCap = 'round';

        const drawLine = ({ x0, y0, x1, y1, color, size, opacity }) => {
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.strokeStyle = color;
          ctx.lineWidth = size;
          ctx.globalAlpha = opacity;
          ctx.stroke();
          ctx.globalAlpha = 1;
        };

        const handleDraw = (data) => drawLine(data);

        const handleClear = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        socket.on("whiteboard-draw", handleDraw);
        socket.on("whiteboard-clear", handleClear);

        return () => {
          socket.off("whiteboard-draw", handleDraw);
          socket.off("whiteboard-clear", handleClear);
          window.removeEventListener("resize", resizeCanvasWithBuffer);
        };
    }, [roomId]);

    const handleMouseDown = (e) => {
        setDrawing(true);
        lastPos.current = getCoords(e);
    };

    const handleMouseMove = (e) => {
        if (!drawing) return;
        const { x, y } = getCoords(e);
        const { x: x0, y: y0 } = lastPos.current;

        const drawData = {
            roomId,
            x0, y0, x1: x, y1: y,
            color: penColor,
            size: penSize,
            opacity: penOpacity
        };
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x, y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.globalAlpha = penOpacity;
        ctx.stroke();
        ctx.globalAlpha = 1;
        //emit with others
        socket.emit("whiteboard-draw", drawData);
        lastPos.current = { x, y };
    };


    const getCoords = (e) => ({
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
    });

    const handleMouseUp = () => setDrawing(false);

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit("whiteboard-clear", { roomId });
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = image;
        a.download = "whiteboard.png";
        a.click();
    };

    const handleEraser = () => {
        setPenColor('#F4F4F4');
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} />
                <input type="range" min="1" max="20" value={penSize} onChange={(e) => setPenSize(e.target.value)} />
                <input type="range" min="0.1" max="1" step="0.1" value={penOpacity} onChange={(e) => setPenOpacity(e.target.value)} />
                <button onClick={handleClear}>Clear</button>
                <button onClick={handleEraser}>Eraser</button>
                <button onClick={handleSave}>Save</button>
            </div>
            <canvas
                ref={canvasRef}
                style={{
                    border: "1px solid #ccc",
                    width: "100%",
                    height: "70vh",
                    maxWidth: "100%",
                    maxHeight: "block"
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
        </div>
    );
}

export default Whiteboard;
