const feedback = [
  {
    title: "Bien placee",
    description: "La couleur est presente et se trouve au bon endroit.",
    className: "feedback-exact",
  },
  {
    title: "Mal placee",
    description: "La couleur est presente, mais elle doit etre deplacee.",
    className: "feedback-partial",
  },
  {
    title: "Absente",
    description: "La couleur ne fait pas partie du code secret.",
    className: "feedback-empty",
  },
];

export default function Rules() {
  return (
    <main className="page-shell rules-page">
      <header className="page-title">
        <div>
          <p className="eyebrow">M4ST3RM1ND</p>
          <h1>Regles du jeu</h1>
          <p className="intro">
            Trouvez le code secret en utilisant les indices fournis apres chaque
            tentative.
          </p>
        </div>
      </header>

      <div className="content-grid rules-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Le but</h2>
          </div>
          <p>
            Une combinaison de couleurs est choisie en secret. Votre objectif
            est de retrouver les couleurs et leur ordre avant d&apos;avoir
            utilise toutes vos tentatives.
          </p>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Une partie en 4 etapes</h2>
          </div>
          <ol className="rules-steps">
            <li>Composez une combinaison avec les couleurs disponibles.</li>
            <li>Validez votre proposition.</li>
            <li>Analysez les indices obtenus.</li>
            <li>Ameliorez votre prochaine tentative.</li>
          </ol>
        </section>

        <section className="panel rules-feedback-panel">
          <div className="panel-heading">
            <h2>Lire les indices</h2>
          </div>
          <p>
            Les indices vous renseignent sur votre proposition, sans reveler
            directement la combinaison secrete.
          </p>
          <div className="rules-feedback-list">
            {feedback.map((item) => (
              <div className="rules-feedback-item" key={item.title}>
                <span
                  aria-hidden="true"
                  className={`rules-feedback-peg ${item.className}`}
                />
                <span>
                  <strong>{item.title}</strong> : {item.description}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Fin de partie</h2>
          </div>
          <div className="rules-outcomes">
            <p>
              <strong>Victoire :</strong> toutes les couleurs sont correctes et
              bien placees.
            </p>
            <p>
              <strong>Defaite :</strong> toutes les tentatives sont utilisees
              sans trouver le code.
            </p>
          </div>
        </section>
      </div>

      <aside className="rules-tip" aria-label="Conseil de jeu">
        <strong>Conseil :</strong> notez les couleurs deja testees et utilisez
        chaque indice pour eliminer les combinaisons impossibles.
      </aside>
    </main>
  );
}
