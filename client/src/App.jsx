import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Join from './pages/Join';
import Room from './pages/Room';

function App() {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Join />} />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
        </Router>
    );
}
export default App

