import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import ShoppingListsRoute from "./routes/ShoppingListsRoute";
import ListDetailPage from "./routes/ListDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lists" replace />} />
      <Route path="/lists" element={<ShoppingListsRoute />} />
      <Route path="/lists/:id" element={<ListDetailPage />} />
    </Routes>
  );
}

export default App;