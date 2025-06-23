import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CodeEditor from "../components/Editor";
import ChatBox from '../components/ChatBox';

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
//   const { username } = location.state || {};
  const [username] = useState(location.state?.username || sessionStorage.getItem("username"));

  useEffect(() => {
    if(!username) {
        navigate('/');
        return;
    }
    sessionStorage.setItem("username", username);
//     socket.emit("join",{roomId, username});
    console.log(`Joined room: ${roomId} as ${username}`);
    // later will connect socket whiteboard code editor etc
  }, [roomId, username, navigate]);
//      return <h1>Hello! from Room: {roomId}</h1>
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome to Room: <span style={{ color: 'blue' }}>{roomId}</span></h2>
      <p>You are logged in as <strong>{username}</strong></p>

      {/* Code Editor Component */}
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
        <ChatBox roomId={roomId} username={username}/>
      </div>
    </div>
  );


}

export default Room;
