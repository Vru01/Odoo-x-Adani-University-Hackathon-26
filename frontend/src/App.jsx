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
import DashBoard from './pages/DashBoard'
import WorkCenter from './pages/WorkCenter'
import TeamsPage from './pages/TeamPage'
import EquipmentTable from './pages/Equipment/EquipmentTable'
import EquipmentCategory from './pages/Equipment/EquipmentCategory'
import AdminDashboard from './pages/AdminDashboard'
import RequestForm from './pages/RequestForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Layout> */}
      <DashBoard></DashBoard>
      <CreateEquipment></CreateEquipment>
      <WorkCenter></WorkCenter>
      <TeamsPage></TeamsPage>
      <EquipmentTable></EquipmentTable>
      <EquipmentCategory></EquipmentCategory>
      <AdminDashboard></AdminDashboard>
      <RequestForm></RequestForm>
      {/* </Layout> */}
      
    </>
  )
}

export default App
