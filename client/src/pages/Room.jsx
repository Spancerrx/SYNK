import { useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';

function Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const { username } = location.state || {};

  useEffect(() => {
    console.log(`🔗 Joined room: ${roomId} as ${username}`);

    // later will connect socket whiteboard code editor etc

  }, [roomId, username]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome to Room: <span style={{ color: 'blue' }}>{roomId}</span></h2>
      <p>You are logged in as <strong>{username}</strong></p>

      {/* This is placeholder UI for now */}
      <div style={{
        marginTop: '2rem',
        padding: '2rem',
        background: '#f4f4f4',
        borderRadius: '8px'
      }}>
        <p>Whiteboard and Code Editor coming soon!</p>
      </div>
    </div>
  );
}

export default Room;
