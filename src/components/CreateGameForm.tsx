import { useState } from 'react'
import type { FormEvent } from 'react'
import { createGame } from '../api/game'
import type { Game } from '../types/game'

interface CreateGameFormProps {
	token: string
	onCreated: (game: Game) => void
}

export default function CreateGameForm({ token, onCreated }: CreateGameFormProps) {
	const [emails, setEmails] = useState([''])
	const [difficulty, setDifficulty] = useState('medium')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		const invitedEmails = emails.map((email) => email.trim()).filter(Boolean)
		setLoading(true)
		setError(null)
		try {
			const game = await createGame(token, { difficulty, invitedEmails })
			setEmails([''])
			onCreated(game)
		} catch (requestError) {
			setError(requestError instanceof Error ? requestError.message : 'Impossible de créer la partie.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form className="create-game-form" onSubmit={handleSubmit}>
			<div className="form-heading"><div><p className="eyebrow">Nouvelle partie</p><h2>Inviter des adversaires</h2></div></div>
			<label> Difficulté
				<select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
					<option value="easy">Facile</option><option value="medium">Moyenne</option><option value="hard">Difficile</option>
				</select>
			</label>
			<div className="email-list">
				{emails.map((email, index) => <label key={index}>Email du joueur {index + 1}
					<input type="email" value={email} onChange={(event) => setEmails(emails.map((value, i) => i === index ? event.target.value : value))} placeholder="joueur@exemple.com" />
				</label>)}
			</div>
			<div className="form-actions">
				<button className="secondary-button" type="button" onClick={() => setEmails([...emails, ''])}>+ Ajouter un joueur</button>
				<button className="primary-button" type="submit" disabled={loading}>{loading ? 'Création...' : 'Créer la partie'}</button>
			</div>
			{error && <p className="form-error" role="alert">{error}</p>}
		</form>
	)
}
