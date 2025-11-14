import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import ListDetailPage from './routes/ListDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lists/1" replace />} />
      <Route path="/lists/:id" element={<ListDetailPage />} />
    </Routes>
  );
}

export default App;