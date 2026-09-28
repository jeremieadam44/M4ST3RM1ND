interface LoadingProps {
	label?: string
}

export default function Loading({ label = 'Chargement...' }: LoadingProps) {
	return <p className="state-message" role="status">{label}</p>
}
