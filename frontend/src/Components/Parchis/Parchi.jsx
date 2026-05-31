import React, { useContext, useState } from 'react'
import ParchiExpanded from '../ParchiExpanded';
import ParchiContext from '../../context/parchi/ParchiContext';

const Parchi = ({ parchi, expandedId, setExpandedId }) => {

  const totalItems = parchi.items.length;
  const foundCount = parchi.items.filter(i => i.status === "found").length;
  const notFoundCount = parchi.items.filter(i => i.status === "not found").length;
  const pendingCount = parchi.items.filter(i => i.status === "pending").length;
  const isExpanded = expandedId === parchi._id;

  const toggleExpand = () => {
    setExpandedId(isExpanded ? null : parchi._id);
  }
  console.log(parchi._id, expandedId);
  const { deleteParchi } = useContext(ParchiContext);
  // Delete the whole parchi
  const handleDeleteParchi = async () => {
    if(window.confirm('Delete this entire Parchi?')) {
      await deleteParchi(parchi._id);
      setExpandedId(null);
    }
  }


  return (
    <div className="bg-white/30 shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition">

      <h3 className="text-lg font-semibold text-green-700">
        {parchi.title}
      </h3>

      <p className='text-sm text-gray-500'>
        {totalItems} items
      </p>

      <div className="flex gap-4 mt-2 text-sm">
        <span className="text-green-600">✔ {foundCount} found</span>
        <span className="text-red-400">❌ {notFoundCount} missing</span>
        <span className="text-yellow-500">⏳ {pendingCount} pending</span>
      </div>

      <p className="text-gray-600 mt-2 text-sm">
        {parchi.items.slice(0, 3).map(i => i.name).join(", ")}
        {parchi.items.length > 3 && "..."}
      </p>

      <div className='flex gap-2'>
        <button className="px-2 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 transition text-xs mt-4" onClick={toggleExpand}>
          {isExpanded ? "Hide" : "Expand"}
        </button>
        <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs mt-4" onClick={handleDeleteParchi}>
          Delete
        </button>
      </div>
      {isExpanded && <ParchiExpanded parchi={parchi} />}
    </div>
  )
}

export default Parchi;