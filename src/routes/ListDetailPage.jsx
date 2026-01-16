import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { updateShoppingList } from "../api/shoppingListsApi";
import { sendInvite } from "../api/invitesApi";
import ListHeader from "../components/ListHeader";
import MembersSection from "../components/MembersSection";
import ItemsSection from "../components/ItemsSection";
import ItemsStatsChart from "../components/ItemsStatsChart";

const INITIAL_MEMBERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    initial: "J",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Member",
    initial: "J",
  },
];

function ListDetailPage({ shoppingLists, setShoppingLists, status, error, t }) {
  const { id } = useParams();
  const listId = id;

  const list = shoppingLists.find((l) => l.id === listId);

  const [listName, setListName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedListName, setEditedListName] = useState("");

  const [members, setMembers] = useState(INITIAL_MEMBERS);

  const [items, setItems] = useState([]);

  const [newItemName, setNewItemName] = useState("");
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const isOwner = list?.isOwner ?? false;

  useEffect(() => {
    if (!list) return;
    const name = list.name ?? "My Shopping List";
    setListName(name);
    setEditedListName(name);
    setItems(list.items ?? []);
  }, [list]);

async function persistChanges(partialData) {
  if (!list) return;

  let dataToSave = { ...partialData };

  if (Object.prototype.hasOwnProperty.call(partialData, "items")) {
    const items = partialData.items ?? [];
    dataToSave.itemsCount = items.length;
    dataToSave.unresolvedCount = items.filter((i) => !i.done).length;
  }
  try {
    setIsSaving(true);
    setSaveError(null);

    const updated = await updateShoppingList(list.id, dataToSave);

    if (!updated) {
      setSaveError(t("updateFailed"));
      return;
    }

    // update global state
    setShoppingLists((prev) =>
      prev.map((l) => (l.id === list.id ? updated : l))
    );

    // sync local state
    const updatedName = updated.name ?? "My Shopping List";
    setListName(updatedName);
    setEditedListName(updatedName);
    setItems(updated.items ?? []);
  } catch (err) {
    console.error(err);
    setSaveError(t("updateFailed"));
  } finally {
    setIsSaving(false);
  }
}
  // list name logic (only owner can change)

  const startEditName = () => {
    if (!isOwner) return;
    setEditedListName(listName);
    setIsEditingName(true);
  };

  const cancelEditName = () => {
    setIsEditingName(false);
  };

  const saveEditName = async () => {
    const trimmed = editedListName.trim();
    if (!trimmed) return;

    await persistChanges({ name: trimmed });
    setIsEditingName(false);
  };

  // members logic (without API)

  const inviteMember = async () => {
    if (!isOwner) return;

    const email = window.prompt(t("enterMemberEmail"));
    if (!email) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    try {
      setIsSaving(true);
      await sendInvite({
        listId,
        email: trimmedEmail,
        baseUrl: window.location.origin,
      });
      window.alert(t("inviteSent"));
    } catch (err) {
      console.error(err);
      window.alert(t("inviteFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const removeMember = (memberId) => {
    if (!isOwner) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  // items logic (via API)

  const toggleItem = async (itemId) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    setItems(newItems);
    await persistChanges({ items: newItems });
  };

  const deleteItem = async (itemId) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    await persistChanges({ items: newItems });
  };

  const addItem = async () => {
    const trimmed = newItemName.trim();
    if (!trimmed) return;

    const newItems = [
      ...items,
      {
        id: Date.now().toString(),
        name: trimmed,
        done: false,
      },
    ];

    setItems(newItems);
    setNewItemName("");
    await persistChanges({ items: newItems });
  };

  // global loading/error

  if (status === "pending") {
    return (
      <div className="page">
        <p>{t("loadingList")}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="page">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  // not found

  if (!list) {
    return (
      <div className="page">
        <p>{t("listNotFound", { id })}</p>
      </div>
    );
  }

  const resolvedCount = items.filter((i) => i.done).length;
  const unresolvedCount = items.length - resolvedCount;

  // render
  return (
    <div className="page">

      <ListHeader
        listId={id}
        listName={listName}
        isOwner={isOwner}
        isSaving={isSaving}
        onStartEditName={startEditName}
        isEditingName={isEditingName}
        editedListName={editedListName}
        onChangeEditedListName={setEditedListName}
        onSaveEditName={saveEditName}
        onCancelEditName={cancelEditName}
        t={t}
      />

      {isSaving && <div>{t("saving")}</div>}
      {saveError && <div style={{ color: "red" }}>{saveError}</div>}

      <ItemsStatsChart
        resolvedCount={resolvedCount}
        unresolvedCount={unresolvedCount}
        t={t}
      />

      <MembersSection
        members={members}
        isOwner={isOwner}
        isSaving={isSaving}
        onInvite={inviteMember}
        onRemove={removeMember}
        t={t}
      />

      <ItemsSection
        items={items}
        isSaving={isSaving}
        newItemName={newItemName}
        onChangeNewItemName={setNewItemName}
        onAddItem={addItem}
        onToggleItem={toggleItem}
        onDeleteItem={deleteItem}
        showOnlyUnresolved={showOnlyUnresolved}
        onChangeShowOnlyUnresolved={setShowOnlyUnresolved}
        t={t}
      />
    </div>
  );
}
export default ListDetailPage;
