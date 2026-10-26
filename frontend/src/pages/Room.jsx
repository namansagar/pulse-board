import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { castVote, closeRoom, getRoom } from '../api.js'

const SCORES = [1, 2, 3, 4, 5]

function Chart({ room }) {
  const max = Math.max(1, ...Object.values(room.counts))
  return (
    <div>
      <div className="flex h-48 items-end gap-3" role="img" aria-label="Vote distribution">
        {SCORES.map((s) => {
          const count = room.counts[s] || 0
          const height = count === 0 ? 4 : Math.max(8, (count / max) * 100)
          return (
            <div key={s} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-sm font-semibold">{count}</span>
              <div
                className="w-full rounded-t-md bg-pulse transition-all duration-500"
                style={{ height: `${height}%`, opacity: count === 0 ? 0.25 : 1 }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-3">
        {SCORES.map((s) => (
          <span key={s} className="flex-1 text-center font-display text-lg font-semibold">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Room() {
  const { code } = useParams()
  const roomCode = code.toUpperCase()
  const hostKey = localStorage.getItem(`pulseboard:host:${roomCode}`)

  const [room, setRoom] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [nickname, setNickname] = useState(localStorage.getItem('pulseboard:nickname') || '')
  const [myScore, setMyScore] = useState(null)
  const [actionError, setActionError] = useState('')

  const refresh = useCallback(async () => {
    try {
      setRoom(await getRoom(roomCode))
      setLoadError('')
    } catch (err) {
      setLoadError(err.status === 404 ? 'We could not find that room. Check the code and try again.' : err.message)
    }
  }, [roomCode])

  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, 2000)
    return () => clearInterval(timer)
  }, [refresh])

  async function vote(score) {
    setActionError('')
    if (!nickname.trim()) {
      setActionError('Enter a nickname before voting.')
      return
    }
    try {
      localStorage.setItem('pulseboard:nickname', nickname.trim())
      setRoom(await castVote(roomCode, nickname.trim(), score))
      setMyScore(score)
    } catch (err) {
      setActionError(err.message)
    }
  }

  async function handleClose() {
    setActionError('')
    try {
      setRoom(await closeRoom(roomCode, hostKey))
    } catch (err) {
      setActionError(err.message)
    }
  }

  if (loadError && !room) {
    return (
      <p role="alert" className="text-lg">
        {loadError} <Link className="underline" to="/">Go home</Link>
      </p>
    )
  }
  if (!room) return <p className="text-lg text-ink/60">Loading room...</p>

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-ink/60">Room code</p>
        <p className="font-display text-5xl font-extrabold tracking-widest text-pulse">{room.code}</p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-snug">{room.question}</h1>
      </section>

      {room.closed ? (
        <p className="rounded-lg bg-ink px-4 py-3 font-medium text-white">
          Voting is closed. These are the final results.
        </p>
      ) : (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <label htmlFor="nickname" className="block text-sm font-medium">Your nickname</label>
          <input
            id="nickname"
            className="mt-1 w-full rounded-lg border border-line px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ink"
            value={nickname}
            maxLength={30}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="e.g. Sam"
          />
          <p className="mt-5 text-sm font-medium">Pick a score from 1 (low) to 5 (high)</p>
          <div className="mt-2 flex gap-3">
            {SCORES.map((s) => (
              <button
                key={s}
                onClick={() => vote(s)}
                aria-pressed={myScore === s}
                className={`flex-1 rounded-lg border py-4 font-display text-2xl font-semibold transition focus-visible:ring-2 focus-visible:ring-ink ${
                  myScore === s
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-white hover:border-ink'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {myScore && (
            <p className="mt-3 text-sm text-ink/70">
              You voted {myScore}. Pick another score to change your vote.
            </p>
          )}
        </section>
      )}

      {actionError && <p role="alert" className="text-sm font-medium text-pulse">{actionError}</p>}

      <section className="rounded-2xl border border-line p-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-ink/60">Average</p>
            <p className="font-display text-5xl font-extrabold">{room.total ? room.average.toFixed(1) : '-'}</p>
          </div>
          <p className="text-sm font-medium text-ink/60">
            {room.total} {room.total === 1 ? 'vote' : 'votes'}
          </p>
        </div>
        <Chart room={room} />
      </section>

      {hostKey && !room.closed && (
        <button
          onClick={handleClose}
          className="rounded-lg border border-ink px-5 py-3 font-semibold transition hover:bg-ink hover:text-white focus-visible:ring-2 focus-visible:ring-ink"
        >
          Close voting
        </button>
      )}
    </div>
  )
}
