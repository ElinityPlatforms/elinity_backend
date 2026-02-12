import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPersonById } from './networkService'
import type { Person, Message } from './types'
import './Network.css'

export default function RelationshipPage() {
  const { personId } = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState<Person | undefined>()
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')

  useEffect(() => { if (personId) load() }, [personId])

  async function load() {
    const p = await getPersonById(personId || '')
    setPerson(p)
    // mock messages
    setMessages([
      { id: 'm1', fromId: 'me', toId: personId || '', text: 'Hey — how are you?', timestamp: new Date().toISOString() },
      { id: 'm2', fromId: personId || 'p?', toId: 'me', text: 'All good! Looking forward to our meetup.', timestamp: new Date().toISOString() }
    ])
  }

  function sendMessage() {
    if (!draft.trim()) return
    const msg: Message = { id: `m${Math.random()}`, fromId: 'me', toId: person?.id || '', text: draft.trim(), timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, msg])
    setDraft('')
  }

  if (!person) return <div className="relationship-page"><button className="back-button" onClick={() => navigate(-1)}>Back</button><p>Loading...</p></div>

  return (
    <div className="relationship-page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',gap:16,alignItems:'center'}}>
          <img src={person.avatar || '/assets/default-avatar.png'} className="header-avatar" alt={person.name} />
          <div>
            <h2>{person.name}</h2>
            <div className="bio">{person.relation} • {person.bio}</div>
          </div>
        </div>
        <div>
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>

      <section style={{marginTop:20}}>
        <h3>Relationship Health</h3>
        <p>Score: {person.metrics?.healthScore ?? '—'}</p>
        <p>Positive interactions: {person.metrics?.positiveInteractions ?? 0}</p>
      </section>

      <section style={{marginTop:20}}>
        <h3>History</h3>
        <ul>
          {person.history?.map(h => <li key={h.id}>{h.date} — {h.note}</li>)}
        </ul>
      </section>

      <section style={{marginTop:20}}>
        <h3>Messages</h3>
        <div className="messages-container">
          {messages.map(m => (
            <div key={m.id} className={`message ${m.fromId === 'me' ? 'sent' : 'received'}`}>
              <div className="message-bubble">{m.text}</div>
              <div style={{fontSize:11,color:'#b0b0d9'}}>{new Date(m.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="message-input-group">
          <input className="message-input" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a message" />
          <button className="send-btn" onClick={sendMessage}>Send</button>
        </div>
      </section>
    </div>
  )
}
