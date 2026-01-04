import React from "react";
import "../routes/ShoppingListsRoute.css";

function ShoppingListTile({ list, onOpenDetail, onDelete, disabled, t }) {
  const items = list.items ?? [];
  const itemsCount = items.length;
  const unresolvedCount = items.filter((item) => !item.done).length;
  const resolvedCount = itemsCount - unresolvedCount;  
  const resolvedPercent = itemsCount === 0 ? 0 : Math.round((resolvedCount / itemsCount) * 100);
  
  return (
    <article className="list-tile">
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
            <span className="badge badge-archived">{t("archived")}</span>
          )}
        </div>

        <p className="list-description">{list.description}</p>

        <div className="list-meta">
          <div className="list-meta-row">
            <span className="meta-pill">{itemsCount} {t("items")}</span>
            <span className="meta-pill">{unresolvedCount} {t("open")}</span>
            <span className="meta-pill">{t("donePercent", { percent: resolvedPercent })}</span>
          </div>

          <div
            className="progress"
            role="progressbar"
            aria-valuenow={resolvedPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Resolved items progress"
          >
            <div
              className="progress-bar"
              style={{ width: `${resolvedPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="list-tile-footer">
        <span className="owner-label">
          {list.isOwner ? t("owner") : t("member")}
        </span>

        <button
          type="button"
          className="danger-button"
          disabled={!list.isOwner || disabled}
          onClick={() => onDelete(list.id)}
        >
          {t("delete")}
        </button>
      </div>
    </article>
  );
}

export default ShoppingListTile;
