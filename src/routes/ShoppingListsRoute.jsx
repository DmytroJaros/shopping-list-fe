import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingListsRoute.css";
import ShoppingListTile from "../components/ShoppingListTile";
import {createShoppingList, deleteShoppingList,} from "../api/shoppingListsApi";

function ShoppingListsRoute({
  shoppingLists,
  setShoppingLists,
  status,
  error,
  theme,
  onToggleTheme,
  t,
  lang,
  setLang,
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
          <h1>{t("shoppingLists")}</h1>
        </header>
        <p>{t("loadingLists")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="lists-page">
        <header className="lists-header">
          <h1>{t("shoppingLists")}</h1>
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
      alert(t("deleteOwnerOnly"));
      return;
    }

    const confirmed = window.confirm(
      t("deleteConfirm", { name: list.name })
    );

    if (!confirmed) {
      return;
    }

    const ok = await deleteShoppingList(id);
    if (!ok) {
      alert(t("deletingFailed"));
      return;
    }

    setShoppingLists((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="lists-page">
      <header className="lists-header">
      <h1>{t("shoppingLists")}</h1>

        <div className="lists-header-actions">

          <button type="button" className="theme-toggle" onClick={onToggleTheme}>
           {theme === "dark" ? t("lightMode") : t("darkMode")}
          </button>

          <label className="lists-filter">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.target.checked)}
            />
            <span>{t("showArchived")}</span>
          </label>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="lang-select"
            aria-label={t("language")}
          >
            <option value="en">EN</option>
            <option value="cs">CZ</option>
          </select>

          <button
            type="button"
            className="primary-button"
            onClick={handleOpenCreateModal}
          >
            {t("newList")}
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
            t={t}
          />
        ))}

        {filteredLists.length === 0 && (
          <p className="empty-message">{t("noListsForFilter")}</p>
        )}
      </main>

      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseCreateModal}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{t("createNewList")}</h2>

            <form onSubmit={handleCreateList} className="modal-form">
              <label>
                {t("name")}
                <input
                  type="text"
                  value={newListName}
                  onChange={(event) => setNewListName(event.target.value)}
                />
              </label>

              <label>
                {t("description")}
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
                  {t("cancel")}
                </button>
                <button type="submit" className="primary-button">
                  {t("create")}
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