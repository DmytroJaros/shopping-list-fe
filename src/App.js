import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ShoppingListsRoute from "./routes/ShoppingListsRoute";
import ListDetailPage from "./routes/ListDetailPage";
import { getShoppingLists } from "./api/shoppingListsApi";

function App() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [status, setStatus] = useState("pending"); //pending, ready, error
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setStatus("pending");
        setError(null);

        const lists = await getShoppingLists();

        if (!isMounted) return; // safety guard
        setShoppingLists(lists);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError("Nepodařilo se načíst nákupní seznamy.");
        setStatus("error");
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lists" replace />} />

      <Route
        path="/lists"
        element={
          <ShoppingListsRoute
            shoppingLists={shoppingLists}
            setShoppingLists={setShoppingLists}
            status={status}
            error={error}
          />
        }
      />

    <Route
      path="/lists/:id"
      element={
        <ListDetailPage
          shoppingLists={shoppingLists}
          setShoppingLists={setShoppingLists}
          status={status}
          error={error}
        />
      }
    />
    </Routes>
  );
}

export default App;