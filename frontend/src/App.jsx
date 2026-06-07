import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Navbar from './Components/Navbar/Navbar'
import Newlist from './Components/Newlist/Newlist'
import Misseditems from './Components/Misseditems/Misseditems'
import Home from './Components/Home/Home'
import ParchiState from './context/parchi/ParchiState'
import Signup from './Components/Auth/Signup'

const App = () => {
  return (
    <ParchiState>
      <BrowserRouter>
        <div>
          <Navbar />
          {/* routes */}
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/newlist' element={<Newlist />}></Route>
            <Route path='/misseditems' element={<Misseditems />}></Route>
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ParchiState>
  )
}

export default App
