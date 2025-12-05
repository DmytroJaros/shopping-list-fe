import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingListsRoute.css";
import ShoppingListTile from "../components/ShoppingListTile";
import {createShoppingList, deleteShoppingList,} from "../api/shoppingListsApi";

function ShoppingListsRoute({
  shoppingLists,
  setShoppingLists,
  status,
  error
}) {
  const [showArchived, setShowArchived] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  const navigate = useNavigate();

  if (status === "pending") {
    return (
      <div className="lists-page">
        <header className="lists-header">
          <h1>Shopping lists</h1>
        </header>
        <p>Loading shopping lists…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="lists-page">
        <header className="lists-header">
          <h1>Shopping lists</h1>
        </header>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  const filteredLists = shoppingLists.filter((list) =>
    showArchived ? true : !list.isArchived
  );

  function handleOpenDetail(id) {
    navigate(`/lists/${id}`);
  }

  function handleOpenCreateModal() {
    setNewListName("");
    setNewListDescription("");
    setIsCreateModalOpen(true);
  }

  function handleCloseCreateModal() {
    setIsCreateModalOpen(false);
  }

  // create via API
  async function handleCreateList(event) {
    event.preventDefault();

    const name = newListName.trim();
    const description = newListDescription.trim();

    if (!name) return;

    const created = await createShoppingList({
      name,
      description,
      isArchived: false,
      isOwner: true,
      items: []
    });

    setShoppingLists((prev) => [...prev, created]);
    setIsCreateModalOpen(false);
  }

  // delete via API
  async function handleDeleteList(id) {
    const list = shoppingLists.find((l) => l.id === id);
    if (!list) {
      return;
    }

    if (!list.isOwner) {
      alert("You can delete only lists where you are an owner.");
      return;
    }

    const confirmed = window.confirm(
      `Do you really want to delete list "${list.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const ok = await deleteShoppingList(id);
    if (!ok) {
      alert("Deleting the list failed.");
      return;
    }

    setShoppingLists((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="lists-page">
      <header className="lists-header">
        <h1>Shopping lists</h1>

        <div className="lists-header-actions">
          <label className="lists-filter">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
            />
            <span>Show archived lists</span>
          </label>

          <button
            type="button"
            className="primary-button"
            onClick={handleOpenCreateModal}
          >
            + New list
          </button>
        </div>
      </header>

      <main className="lists-grid">
        {filteredLists.map((list) => (
          <ShoppingListTile
            key={list.id}
            list={list}
            onOpenDetail={handleOpenDetail}
            onDelete={handleDeleteList}
          />
        ))}

        {filteredLists.length === 0 && (
          <p className="empty-message">No shopping lists for selected filter.</p>
        )}
      </main>

      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseCreateModal}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Create new shopping list</h2>

            <form onSubmit={handleCreateList} className="modal-form">
              <label>
                Name
                <input
                  type="text"
                  value={newListName}
                  onChange={(event) => setNewListName(event.target.value)}
                />
              </label>

              <label>
                Description
                <textarea
                  value={newListDescription}
                  onChange={(event) =>
                    setNewListDescription(event.target.value)
                  }
                  rows={3}
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCloseCreateModal}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default ShoppingListsRoute;