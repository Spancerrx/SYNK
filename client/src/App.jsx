import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Join from './pages/Join';
import Room from './pages/Room';

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Join />} />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App

