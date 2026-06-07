import React, { useContext, useEffect, useState } from 'react'
import parchiContext from '../../context/parchi/ParchiContext'
import Parchi  from '../Parchis/Parchi';

const Home = () => {
  const {parchi, getParchi , loading} = useContext(parchiContext);
  const [expandedId, setExpandedId] = useState(null);
  
useEffect(() => {
    if (localStorage.getItem('token')) {
        getParchi();
    }
}, []);


  return (
    <div className="p-6">
      <h2 className='text-2xl font-bold text-black mb-6'>
        Your Lists
      </h2>
      {/* loading list */}
      {
        loading && (<div className="text-center text-gray-500 mb-6">
          loading your lists...
        </div>
        )
      }
      {/* empty state */}
      {
        !loading && parchi.length === 0 && (
          <div className='text-center mt-10'>
            <h3 className='text-lg text-gray-600'>No lists yet 🌿</h3>
            <p className='text-sm text-gray-400'>Create your first parchi!</p>
          </div>
        )
      }
      {/* data display */}
      {!loading && parchi.length > 0 && (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start'>
        {parchi.map((p) => {
          return <Parchi key={p._id} parchi={p} expandedId={expandedId} setExpandedId = {setExpandedId}/>
        })}
      </div>
      )}
    </div>
  )
}

export default Home