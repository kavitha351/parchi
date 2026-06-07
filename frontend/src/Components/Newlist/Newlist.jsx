import React, { useState, useContext, useEffect } from 'react'
import parchiContext from '../../context/parchi/ParchiContext';
import { useNavigate } from 'react-router-dom';

const NewList =  () => {
    const [title, setTitle ] = useState('');
    const { addParchi } = useContext(parchiContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (!localStorage.getItem('token')) {
        navigate('/login');
      }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title.trim()) return;
        await addParchi({ title });
        setTitle('');
        console.log('list created');
        navigate('/');
    };
  return (
    <div className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>
        Create a New List
      </h2>
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder='Enter list title...'
               className='border px-3 py-2 rounded w-full'
        />
        <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>
            Create
        </button>
      </form>
    </div>
  )
}

export default NewList

