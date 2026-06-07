import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className='py-4 px-4 md:px-12 sticky top-0 z-50'>

      <div className='bg-white/30 flex justify-between items-center py-3 px-4 md:px-8 rounded-lg shadow backdrop-blur-3xl'>

        {/* Logo */}
        <NavLink to="/">
          <h2 className='text-xl font-semibold'>Parchi</h2>
        </NavLink>

        {/* Desktop Links */}
        <div className='hidden md:flex gap-6'>
          <NavLink to="/newlist">New List</NavLink>
          <NavLink to="/misseditems">Missed Items</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </div>

        {/* Right Buttons */}
        <div className='hidden md:flex gap-2'>
          <button className='bg-slate-700 text-white px-4 py-2 rounded-full'>Login</button>
          <button className='bg-slate-700 text-white px-4 py-2 rounded-full'>P</button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mt-2 bg-white shadow-md rounded-lg flex flex-col items-center gap-4 py-4 md:hidden">
          <NavLink to="/newlist" onClick={()=>setMenuOpen(false)}>New List</NavLink>
          <NavLink to="/misseditems" onClick={()=>setMenuOpen(false)}>Missed Items</NavLink>
          <button className='bg-slate-700 text-white px-4 py-2 rounded-full'>Login</button>
        </div>
      )}
    </nav>
  )
}

export default Navbar;