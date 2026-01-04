import React from "react";

function ItemsSection({
  items,
  isSaving,
  newItemName,
  onChangeNewItemName,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  showOnlyUnresolved,
  onChangeShowOnlyUnresolved,
  t
}) {
  const resolvedCount = items.filter((item) => item.done).length;
  const displayedItems = showOnlyUnresolved
    ? items.filter((item) => !item.done)
    : items;

  return (
    <section className="section">
      <div className="section-header">
        <h2>{t("itemsTitle")}</h2>

        <div className="items-controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOnlyUnresolved}
              onChange={(e) => onChangeShowOnlyUnresolved(e.target.checked)}
              disabled={isSaving}
            />
            <span>{t("showOnlyUnresolved")}</span>
          </label>

          <span className="resolved-info">
            {t("resolvedItems", { count: resolvedCount })}
          </span>
        </div>
      </div>

      <div className="add-item-row">
        <input
          type="text"
          placeholder="Item name"
          value={newItemName}
          onChange={(e) => onChangeNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAddItem()}
          className="text-input"
          disabled={isSaving}
        />
        <button
          type="button"
          className="btn-outline"
          onClick={onAddItem}
          disabled={isSaving}
        >
          {t("add")}
        </button>
      </div>

      <div className="items-table">
        <div className="items-header-row">
          <div>{t("done")}</div>
          <div>{t("itemName")}</div>
          <div className="items-header-actions">{t("action")}</div>
        </div>

        {displayedItems.map((item) => (
          <div key={item.id} className="items-row">
            <div>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => onToggleItem(item.id)}
                disabled={isSaving}
              />
            </div>
            <div className={item.done ? "item-name done" : "item-name"}>
              {item.name}
            </div>
            <div className="items-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => onDeleteItem(item.id)}
                disabled={isSaving}
              >
                 {t("deleteItem")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default ItemsSection;