import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import socket from "../socket";

function Join(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');

    const handleCreateRoom = () => {
        const newRoomId = uuidv4();
        if(!username.trim()) {
           alert("Please enter your username before creating a room.");
           return;
        }
        setRoomId(newRoomId);
    };

    const handleJoinRoom = () => {
        if(!roomId.trim() || !username.trim()) {
            alert("Room Id and username are required");
            return;
        }
        //connects to backend socket
        socket.emit("join", {roomId, username});

        sessionStorage.setItem("username", username);
        sessionStorage.setItem("roomId", roomId);

        navigate(`/room/${roomId}`,{ state: { username } }); //navigate to room

    };

    return (
        <div className="join-page" style={{padding: `2rem` }}>
            <h2> Join a Room </h2>

            {/* Room ID input */}
            <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                style={{ display: 'block', margin: '1rem 0'}}
            />
            {/* Username input */}
            <input
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ display: 'block', margin: '1rem 0'}}
            />


            {/* Buttons input */}
            <button onClick={handleCreateRoom} style={{ marginRight: `1rem`}}>
                Create New Room
            </button>
            <button onClick={handleJoinRoom}> Join Room </button>
        </div>
    );
}

export default Join;

