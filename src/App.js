import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import ShoppingListsRoute from "./routes/ShoppingListsRoute";
import ListDetailPage from "./routes/ListDetailPage";
import { initialShoppingLists } from "./data/initialShoppingLists";

function App() {
  const [shoppingLists, setShoppingLists] = useState(initialShoppingLists);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lists" replace />} />

      <Route
        path="/lists"
        element={
          <ShoppingListsRoute
            shoppingLists={shoppingLists}
            setShoppingLists={setShoppingLists}
          />
        }
      />

      <Route
        path="/lists/:id"
        element={<ListDetailPage shoppingLists={shoppingLists} />}
      />
    </Routes>
  );
}

export default App;
