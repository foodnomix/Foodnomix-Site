import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ByteValue from './pages/ByteValue'
import './App.css'

/* Resets scroll to top on every route change so a new page always
   opens at its hero, not at whatever scroll position the previous
   page was left at. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bytevalue" element={<ByteValue />} />
      </Routes>
    </BrowserRouter>
  )
}
