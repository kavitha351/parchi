import { useContext, useState } from "react";
import Parchi from "./Parchis/Parchi";
import parchiContext from "../context/parchi/ParchiContext";

const ParchiExpanded = ({ parchi }) => {
  const [newItem, setNewItem] = useState('');
  const { addItemToParchi } = useContext(parchiContext);

  const { updateItem } = useContext(parchiContext);
  const { deleteItem } = useContext(parchiContext);
  const [editingId, setEditingId ] = useState(null);
  const [storeValue, setStoreValue ] = useState('');

  const handleAddItem = async () => {
    console.log('button clicked.');
    if(!newItem.trim()) return;

    await addItemToParchi(parchi._id, newItem);
    setNewItem('');
  }

  const handleSave = async (itemId) => {
    if(!storeValue.trim()) return;

    await updateItem(itemId, { storeName: storeValue });
    setEditingId(null);
  }

  const handleDeleteItem = async (itemId) => {
    if(!window.confirm('Are you sure you want to delete this item?')) return;
    await deleteItem(itemId);
  }

  return (

    <div className="mt-4 border-t pt-4 bg-white/40 rounded-lg p-3 space-y-4">

      {/* 🔹 Title Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-green-700">
          {parchi.title}
        </h3>
        <button className="text-purple-500 text-sm">
          ✏️ Edit Title
        </button>
      </div>
      {/* 🔹 Items Section */}
      {parchi.items.map((item) => {
  return (
    <div
  key={item._id}
  className="flex flex-col md:flex-row md:items-center gap-2 bg-white/60 p-3 rounded-md border"
>

  {/* 🟢 Item Name */}
  <div className="text-sm font-medium text-gray-800 md:w-1/3">
    {item.name}
  </div>

  {/* 🟡 Store + Status (grouped on mobile) */}
  <div className="flex flex-col sm:flex-row gap-2 md:w-2/3">

    {/* Store */}
    <input
      value={item.storeName}
      onChange={(e) => updateItem(item._id, { storeName: e.target.value })}
      className="border px-2 py-1 rounded text-sm w-full sm:w-1/2"
      placeholder="Store"
    />

    {/* Status */}
    <select
      value={item.status}
      onChange={(e) => updateItem(item._id, { status: e.target.value })}
      className="border px-2 py-1 rounded text-sm w-full sm:w-1/2"
    >
      <option value="pending">⏳ Pending</option>
      <option value="found">✔ Found</option>
      <option value="not_found">❌ Not Found</option>
    </select>

  </div>

  {/* 🔴 Delete Button */}
  <div className="flex justify-end md:justify-start">
    <button
      onClick={() => handleDeleteItem(item._id)}
      className="text-red-500 text-sm"
    >
      🗑️
    </button>
  </div>

</div>
  );
})}
      {/* 🔹 Add Item Section */}
      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
          className="border px-2 py-1 rounded w-full"
        />
        <button onClick={handleAddItem} className="bg-green-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </div>

    </div>
  );
};

export default ParchiExpanded;