import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRoom } from '../api.js'

const inputClass =
  'w-full rounded-lg border border-line bg-white px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ink'
const buttonClass =
  'rounded-lg bg-ink px-5 py-3 font-semibold text-white transition hover:bg-ink/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink disabled:opacity-50'

export default function Home() {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const room = await createRoom(question)
      localStorage.setItem(`pulseboard:host:${room.code}`, room.hostKey)
      navigate(`/room/${room.code}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function handleJoin(e) {
    e.preventDefault()
    const clean = code.trim().toUpperCase()
    if (clean) navigate(`/room/${clean}`)
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-display text-5xl font-extrabold leading-tight sm:text-6xl">
          Ask one question.
          <br />
          Watch the room answer.
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink/70">
          Create a room, share the code, and see everyone's 1-5 rating build up live.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-semibold">Create a room</h2>
        <form onSubmit={handleCreate} className="mt-4 space-y-3">
          <label htmlFor="question" className="block text-sm font-medium">
            Your question
          </label>
          <input
            id="question"
            className={inputClass}
            placeholder="How confident are you about today's topic?"
            value={question}
            maxLength={300}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button className={buttonClass} disabled={busy}>
            {busy ? 'Creating...' : 'Create room'}
          </button>
          {error && <p role="alert" className="text-sm font-medium text-pulse">{error}</p>}
        </form>
      </section>

      <section className="rounded-2xl border border-line p-6">
        <h2 className="font-display text-2xl font-semibold">Join a room</h2>
        <form onSubmit={handleJoin} className="mt-4 flex gap-3">
          <label htmlFor="code" className="sr-only">Room code</label>
          <input
            id="code"
            className={`${inputClass} uppercase tracking-widest`}
            placeholder="Room code"
            value={code}
            maxLength={8}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button className={buttonClass}>Join</button>
        </form>
      </section>
    </div>
  )
}
