import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './pages/Navbar'
import Footer from './pages/Footer'
import Layout from './Layout'
import CreateEquipment from './pages/Equipment/CreateEquipment'
import EquipmentList from './pages/Equipment/EquipmentTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <EquipmentList />
    </>
  )
}

export default App
