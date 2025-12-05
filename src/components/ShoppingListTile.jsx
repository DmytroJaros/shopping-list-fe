import React from "react";
import "../routes/ShoppingListsRoute.css";

function ShoppingListTile({ list, onOpenDetail, onDelete, disabled }) {
  const items = list.items ?? [];
  const itemsCount = items.length;
  const unresolvedCount = items.filter((item) => !item.done).length;

  return (
    <article className="list-tile">
      {/* klikací tělo kartičky */}
      <div
        className="list-tile-body"
        onClick={() => onOpenDetail(list.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpenDetail(list.id)}
      >
        <div className="list-tile-header">
          <h2>{list.name}</h2>
          {list.isArchived && (
            <span className="badge badge-archived">Archived</span>
          )}
        </div>

        <p className="list-description">{list.description}</p>

        <div className="list-meta">
          <span>{itemsCount} items</span>
          <span>{unresolvedCount} open</span>
        </div>
      </div>

      {/* spodní část s tlačítkem */}
      <div className="list-tile-footer">
        <span className="owner-label">
          {list.isOwner ? "Owner" : "Member"}
        </span>
        <button
          type="button"
          className="danger-button"
          disabled={!list.isOwner || disabled}
          onClick={() => onDelete(list.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ShoppingListTile;
