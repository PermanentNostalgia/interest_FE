import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import './styles/global.css'
import App from './App.jsx'
import UnitPage from './pages/UnitPage'
import MockInvestPage from './pages/MockInvestPage'
import LearnPage from './pages/LearnPage'
import RecordsPage from './pages/RecordsPage'
import UnitDetailPage from './pages/UnitDetailPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="units/:unitName" element={<UnitPage />} />
        <Route path="units/:unitName/terms" element={<UnitDetailPage />} />
        <Route path="learn/:chapterName" element={<LearnPage />} />
        <Route path="mock-invest" element={<MockInvestPage />} />
        <Route path="records" element={<RecordsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
