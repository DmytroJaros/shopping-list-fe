import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const OWNER_ID = '1';

const INITIAL_MEMBERS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Owner', initial: 'J' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Member', initial: 'J' },
];

const INITIAL_ITEMS = [
  { id: '1', name: 'Milk', done: false },
  { id: '2', name: 'Bread', done: true },
  { id: '3', name: 'Eggs', done: false },
];

function ListDetailPage({ shoppingLists }) {
  const { id } = useParams();
  const listId = Number(id);

  const list = shoppingLists.find((l) => l.id === listId);
  const initialListName = list?.name ?? "My Shopping List";

  const [currentUserId, setCurrentUserId] = useState(OWNER_ID);

  // List name state
  const [listName, setListName] = useState(initialListName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedListName, setEditedListName] = useState(initialListName);

  // Members and items
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [items, setItems] = useState(INITIAL_ITEMS);

  const [newItemName, setNewItemName] = useState('');
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);

  const isOwner = currentUserId === OWNER_ID;
  const [hasLeft, setHasLeft] = useState(false);


  // List name logic (only owner can change)

  const startEditName = () => {
    if (!isOwner) return;
    setEditedListName(listName);
    setIsEditingName(true);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
  };

  const saveEditName = () => {
    const trimmed = editedListName.trim();
    if (!trimmed) return;
    setListName(trimmed);
    setIsEditingName(false);
  };

  // Members logic

  const inviteMember = () => {
    if (!isOwner) return;

    const name = window.prompt('Enter member name');
    if (!name) return;

    const email = window.prompt('Enter member email');
    if (!email) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;

    const initial = trimmedName.charAt(0).toUpperCase();

    setMembers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: trimmedName,
        email: trimmedEmail,
        role: 'Member',
        initial,
      },
    ]);
  };

  const removeMember = (memberId) => {
    if (!isOwner) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const leaveList = () => {
    if (isOwner) {
      window.alert('Owner cannot leave the list.');
      return;
    }

    setMembers((prev) => prev.filter((m) => m.id !== currentUserId));
    setHasLeft(true);
  };

  // Items logic

  const toggleItem = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, done: !item.done } : item
      )
    );
  };

  const deleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const addItem = () => {
    const trimmed = newItemName.trim();
    if (!trimmed) return;

    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now().toString(),
        name: trimmed,
        done: false,
      },
    ]);

    setNewItemName('');
  };

  const resolvedCount = items.filter((item) => item.done).length;
  const displayedItems = showOnlyUnresolved
    ? items.filter((item) => !item.done)
    : items;

  if (!list) {
    return (
      <div className="page">
        <p>List with id {id} was not found.</p>
      </div>
    );
  }
  if (hasLeft) {
    return (
      <div className="page">
        <p>You have left this list and no longer have access.</p>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <header className="page-header">
        <div className="page-header-left">
          {isEditingName ? (
            <>
              <input
                className="page-title-input"
                type="text"
                value={editedListName}
                onChange={(e) => setEditedListName(e.target.value)}
              />
              <button
                type="button"
                className="btn-outline"
                onClick={saveEditName}
              >
                Save
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={cancelEditName}
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
                  onClick={startEditName}
                >
                  Edit name
                </button>
              )}
            </>
          )}
        </div>

    <div className="page-header-right">
      <span className="header-meta">List id: {id}</span>
      <span className="header-meta">
        Role: {isOwner ? 'Owner' : 'Member'}
      </span>

      <div className="view-switcher">
        <span className="header-meta">View as:</span>
        <select
          className="view-select"
          value={currentUserId}
          onChange={(e) => setCurrentUserId(e.target.value)}
        >
          <option value="1">Owner (John Doe)</option>
          <option value="2">Member (Jane Smith)</option>
        </select>
      </div>

      {!isOwner && (
        <button
          type="button"
          className="btn-outline leave-btn"
          onClick={leaveList}
        >
          Leave list
        </button>
      )}
    </div>

      </header>

      {/* Members section */}
      <section className="section">
        <div className="section-header">
          <h2>Members</h2>
          {isOwner && (
            <button
              type="button"
              className="btn-outline"
              onClick={inviteMember}
            >
              Invite member
            </button>
          )}
        </div>

        <div className="members-list">
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-left">
                <div className="member-avatar">{member.initial}</div>
                <div>
                  <div className="member-name">{member.name}</div>
                  <div className="member-email">{member.email}</div>
                </div>
                <div className="member-role">{member.role}</div>
              </div>

              {isOwner && member.role === 'Member' && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => removeMember(member.id)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Items section */}
      <section className="section">
        <div className="section-header">
          <h2>Items</h2>

          <div className="items-controls">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showOnlyUnresolved}
                onChange={(e) => setShowOnlyUnresolved(e.target.checked)}
              />
              <span>Show only unresolved</span>
            </label>

            <span className="resolved-info">
              Resolved items: {resolvedCount}
            </span>
          </div>
        </div>

        {/* Add item row */}
        <div className="add-item-row">
          <input
            type="text"
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            className="text-input"
          />
          <button
            type="button"
            className="btn-outline"
            onClick={addItem}
          >
            Add
          </button>
        </div>

        {/* Items table */}
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
                  onChange={() => toggleItem(item.id)}
                />
              </div>
              <div className={item.done ? 'item-name done' : 'item-name'}>
                {item.name}
              </div>
              <div className="items-actions">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => deleteItem(item.id)}
                >
                  ✕ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ListDetailPage;