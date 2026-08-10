import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ByteValue from './pages/ByteValue'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bytevalue" element={<ByteValue />} />
      </Routes>
    </BrowserRouter>
  )
}
