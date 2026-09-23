import './App.css'
import { useEffect, useState } from 'react'
import GameList from './pages/GameList'
import History from './pages/History'

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const token = localStorage.getItem('token') ?? localStorage.getItem('accessToken')
  const userId = localStorage.getItem('userId') ?? undefined
  useEffect(() => { const onPopState = () => setPath(window.location.pathname); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState) }, [])
  if (!token) return <main className="auth-required"><p className="eyebrow">Mastermind</p><h1>Connexion requise</h1><p>Connectez-vous pour accéder à vos parties.</p></main>
  const navigate = (destination: string) => { window.history.pushState({}, '', destination); setPath(destination) }
  return <><header className="site-header"><a className="brand" href="/games" onClick={(event) => { event.preventDefault(); navigate('/games') }}>M4ST3RM1ND</a><nav><a className={path === '/history' ? 'nav-link active' : 'nav-link'} href="/history" onClick={(event) => { event.preventDefault(); navigate('/history') }}>Historique</a><a className={path === '/games' ? 'nav-link active' : 'nav-link'} href="/games" onClick={(event) => { event.preventDefault(); navigate('/games') }}>Parties</a></nav></header>{path === '/history' ? <History token={token} userId={userId} /> : path.startsWith('/games/') ? <main className="auth-required"><p className="eyebrow">Partie</p><h1>Partie {path.split('/').pop()}</h1><p>Le plateau de jeu sera disponible ici.</p></main> : <GameList token={token} userId={userId} />}</>
}

export default App
