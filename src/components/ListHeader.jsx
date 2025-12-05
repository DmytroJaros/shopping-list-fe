import React from "react";

function ListHeader({
  listId,
  listName,
  isOwner,
  isSaving,
  currentUserId,
  onChangeCurrentUser,
  onStartEditName,
  isEditingName,
  editedListName,
  onChangeEditedListName,
  onSaveEditName,
  onCancelEditName,
  onLeaveList
}) {
  return (
    <header className="page-header">
      <div className="page-header-left">
        {isEditingName ? (
          <>
            <input
              className="page-title-input"
              type="text"
              value={editedListName}
              onChange={(e) => onChangeEditedListName(e.target.value)}
              disabled={isSaving}
            />
            <button
              type="button"
              className="btn-outline"
              onClick={onSaveEditName}
              disabled={isSaving}
            >
              Save
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={onCancelEditName}
              disabled={isSaving}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h1 className="page-title">{listName}</h1>
            {isOwner && (
              <button
                type="button"
                className="btn-outline"
                onClick={onStartEditName}
                disabled={isSaving}
              >
                Edit name
              </button>
            )}
          </>
        )}
      </div>

      <div className="page-header-right">
        <span className="header-meta">List id: {listId}</span>
        <span className="header-meta">
          Role: {isOwner ? "Owner" : "Member"}
        </span>

        <div className="view-switcher">
          <span className="header-meta">View as:</span>
          <select
            className="view-select"
            value={currentUserId}
            onChange={(e) => onChangeCurrentUser(e.target.value)}
            disabled={isSaving}
          >
            <option value="1">Owner (John Doe)</option>
            <option value="2">Member (Jane Smith)</option>
          </select>
        </div>

        {!isOwner && (
          <button
            type="button"
            className="btn-outline leave-btn"
            onClick={onLeaveList}
            disabled={isSaving}
          >
            Leave list
          </button>
        )}
      </div>
    </header>
  );
}
export default ListHeader;