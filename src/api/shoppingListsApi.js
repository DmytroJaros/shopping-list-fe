import { initialShoppingLists } from "../data/initialShoppingLists";

// In–memory mocked backend data
let shoppingLists = [...initialShoppingLists];

const SIMULATED_LATENCY_MS = 300;

function simulateDelay(result) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), SIMULATED_LATENCY_MS);
  });
}

//GET /shopping-lists
export async function getShoppingLists() {
  return simulateDelay([...shoppingLists]);
}

//GET /shopping-lists/:id
export async function getShoppingListById(id) {
  const numericId = Number(id);
  const list = shoppingLists.find((l) => l.id === numericId) ?? null;
  return simulateDelay(list);
}

//POST /shopping-lists
export async function createShoppingList(data) {
  const maxId =
    shoppingLists.length > 0
      ? Math.max(...shoppingLists.map((l) => l.id))
      : 0;

  const newList = {
    id: maxId + 1,
    name: data?.name ?? "New list",
    description: data?.description ?? "",
    isArchived: data?.isArchived ?? false,
    isOwner: data?.isOwner ?? true,
    items: data?.items ?? [],
  };

  shoppingLists.push(newList);
  return simulateDelay(newList);
}
  
//PUT /shopping-lists/:id
export async function updateShoppingList(id, data) {
  const numericId = Number(id);
  const index = shoppingLists.findIndex((l) => l.id === numericId);

  if (index === -1) {
    return simulateDelay(null);
  }

  const updated = {
    ...shoppingLists[index],
    ...data,
  };

  shoppingLists[index] = updated;
  return simulateDelay(updated);
}

//DELETE /shopping-lists/:id
export async function deleteShoppingList(id) {
  const numericId = Number(id);
  const index = shoppingLists.findIndex((l) => l.id === numericId);

  if (index === -1) {
    return simulateDelay(false);
  }

  shoppingLists.splice(index, 1);
  return simulateDelay(true);
}
