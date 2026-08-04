// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Historico } from './pages/Historico'
import { Locais } from './pages/Locais'
import { Splits } from './pages/Splits'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* A rota pai aplica o layout em todas as filhas */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="locais" element={<Locais />} />
          <Route path="splits" element={<Splits />} />
          <Route path="historico" element={<Historico />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
