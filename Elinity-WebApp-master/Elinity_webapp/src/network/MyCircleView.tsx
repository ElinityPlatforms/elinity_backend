import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNetworkPeople, searchPeople } from './networkService'
import type { Person } from './types'
import './Network.css'

export default function MyCircleView() {
  const [people, setPeople] = useState<Person[]>([])
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchPeople() }, [])

  async function fetchPeople() {
    const res = await getNetworkPeople()
    setPeople(res)
  }

  async function doSearch(q: string) {
    setQuery(q)
    if (!q) { fetchPeople(); return }
    const res = await searchPeople(q)
    setPeople(res)
  }

  return (
    <div className="circle-view">
      <div className="circle-header">
        <h1>My Circle</h1>
        <p>People close to you — relationship health at a glance</p>
        <div style={{marginTop:12}}>
          <input placeholder="Search people or relation" value={query} onChange={e => doSearch(e.target.value)} />
        </div>
      </div>

      <div className="people-grid">
        {people.map(p => (
          <div key={p.id} className="person-card" onClick={() => navigate(`/network/${p.id}`)}>
            <div className="person-card-header">
              <img src={p.avatar || '/assets/default-avatar.png'} className="person-avatar" alt={p.name} />
              <div className="person-info">
                <h3>{p.name}</h3>
                <div className="person-bio">{p.relation} — {p.bio}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
