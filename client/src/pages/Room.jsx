import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CodeEditor from "../components/Editor";
import ChatBox from '../components/ChatBox';
import socket from '../socket';

function Room() {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [username] = useState(location.state?.username || sessionStorage.getItem("username"));
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!username) {
            navigate('/');
            return;
        }
        sessionStorage.setItem("username", username);

        socket.emit("join", { roomId, username });

        const handleUserList = (userList) => {
            setUsers(userList);
        }

        socket.on("update-users", handleUserList);

        return () => {
            socket.off("update-users");
        };
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Welcome to Room: <span style={{ color: 'blue' }}>{roomId}</span></h2>
            <p>You are logged in as <strong>{username}</strong></p>

            {/* Active Users List */}
            <div style={{
                marginTop: '1rem',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem'
            }}>
                <h4>Active Users:</h4>
                <ul style={{ paddingLeft: '1rem' }}>
                    {users.map((user, idx) => (
                        <li key={idx}>{user === username ? "You" : user}</li>
                    ))}
                </ul>
            </div>

            {/* Code Editor and Chat */}
            <div style={{
                marginTop: '2rem',
                padding: '2rem',
                background: '#f4f4f4',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
            }}>
                <CodeEditor roomId={roomId} username={username} />
                <ChatBox roomId={roomId} username={username} />
            </div>
        </div>
    );
}

export default Room;
