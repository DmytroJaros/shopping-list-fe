import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingListsRoute.css";

const initialShoppingLists = [
  {
    id: 1,
    name: "Weekly groceries",
    description: "Common shopping for the whole week",
    isArchived: false,
    isOwner: true,
    itemsCount: 12,
    unresolvedCount: 5
  },
  {
    id: 2,
    name: "Party supplies",
    description: "Snacks and drinks for Friday party",
    isArchived: false,
    isOwner: false,
    itemsCount: 8,
    unresolvedCount: 2
  },
  {
    id: 3,
    name: "Old renovation list",
    description: "Archived list – only for history",
    isArchived: true,
    isOwner: true,
    itemsCount: 20,
    unresolvedCount: 0
  }
];

function ShoppingListsRoute() {
  const [shoppingLists, setShoppingLists] = useState(initialShoppingLists);
  const [showArchived, setShowArchived] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  const navigate = useNavigate();

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

  function handleCreateList(event) {
    event.preventDefault();

    if (!newListName.trim()) {
      return;
    }

    const newId =
      shoppingLists.length === 0
        ? 1
        : Math.max(...shoppingLists.map((l) => l.id)) + 1;

    const newList = {
      id: newId,
      name: newListName.trim(),
      description: newListDescription.trim(),
      isArchived: false,
      isOwner: true,
      itemsCount: 0,
      unresolvedCount: 0
    };

    setShoppingLists((prev) => [...prev, newList]);
    setIsCreateModalOpen(false);
  }

  function handleDeleteList(id) {
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
          <article key={list.id} className="list-tile">
            <div
              className="list-tile-body"
              onClick={() => handleOpenDetail(list.id)}
            >
              <div className="list-tile-header">
                <h2>{list.name}</h2>
                {list.isArchived && <span className="badge badge-archived">Archived</span>}
              </div>
              <p className="list-description">{list.description}</p>
              <div className="list-meta">
                <span>{list.itemsCount} items</span>
                <span>{list.unresolvedCount} open</span>
              </div>
            </div>

            <div className="list-tile-footer">
              <span className="owner-label">
                {list.isOwner ? "Owner" : "Member"}
              </span>
              <button
                type="button"
                className="danger-button"
                disabled={!list.isOwner}
                onClick={() => handleDeleteList(list.id)}
              >
                Delete
              </button>
            </div>
          </article>
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
