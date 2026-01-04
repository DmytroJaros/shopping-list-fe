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
  onLeaveList,
  t
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
              {t("save")}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={onCancelEditName}
              disabled={isSaving}
            >
              {t("cancel")}
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
                {t("editName")}
              </button>
            )}
          </>
        )}
      </div>

      <div className="page-header-right">
        <span className="header-meta">{t("listId")}: {listId}</span>
        <span className="header-meta"> {t("role")}: {isOwner ? t("owner") : t("member")} </span>

        <div className="view-switcher">
          <span className="header-meta">{t("viewAs")}:</span>
          <select
            className="view-select"
            value={currentUserId}
            onChange={(e) => onChangeCurrentUser(e.target.value)}
            disabled={isSaving}
          >
            <option value="1">{t("ownerName")}</option>
            <option value="2">{t("memberName")}</option>
          </select>
        </div>

        {!isOwner && (
          <button
            type="button"
            className="btn-outline leave-btn"
            onClick={onLeaveList}
            disabled={isSaving}
          >
            {t("leaveList")}
          </button>
        )}
      </div>
    </header>
  );
}
export default ListHeader;