import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Room from './pages/Room.jsx'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-2xl font-extrabold">
      <svg width="34" height="18" viewBox="0 0 34 18" fill="none" aria-hidden="true">
        <polyline
          points="0,9 8,9 11,2 16,16 20,6 23,9 34,9"
          stroke="#FF4F6D"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      PulseBoard
    </Link>
  )
}

export default function App() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-5 py-6">
      <header className="mb-10">
        <Logo />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:code" element={<Room />} />
          <Route
            path="*"
            element={
              <p className="text-lg">
                That page doesn't exist. <Link className="underline" to="/">Go home</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
