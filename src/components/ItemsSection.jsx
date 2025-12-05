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
  onChangeShowOnlyUnresolved
}) {
  const resolvedCount = items.filter((item) => item.done).length;
  const displayedItems = showOnlyUnresolved
    ? items.filter((item) => !item.done)
    : items;

  return (
    <section className="section">
      <div className="section-header">
        <h2>Items</h2>

        <div className="items-controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showOnlyUnresolved}
              onChange={(e) => onChangeShowOnlyUnresolved(e.target.checked)}
              disabled={isSaving}
            />
            <span>Show only unresolved</span>
          </label>

          <span className="resolved-info">
            Resolved items: {resolvedCount}
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
          Add
        </button>
      </div>

      <div className="items-table">
        <div className="items-header-row">
          <div>Done</div>
          <div>Item name</div>
          <div className="items-header-actions">Action</div>
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
                ✕ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default ItemsSection;