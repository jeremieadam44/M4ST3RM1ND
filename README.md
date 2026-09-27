# M4ST3RM1ND

Application de Mastermind multijoueur au tour par tour, développée avec React,
TypeScript et un serveur REST Deno. Les joueurs créent un compte, s'affrontent
autour d'un code secret et consultent les résultats de leurs parties.

> Projet pédagogique réalisé dans le cadre d'un devoir sur React et TypeScript.

## Sommaire

- [Le jeu](#le-jeu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation et démarrage](#installation-et-démarrage)
- [API](#api)
- [Scripts et vérifications](#scripts-et-vérifications)
- [État de l'intégration](#état-de-lintégration)
- [Sécurité](#sécurité)

## Le jeu

Une partie oppose deux rôles : le **créateur** choisit une combinaison secrète
et le **décodeur** tente de la retrouver. Après chaque proposition, le créateur
indique, pour chaque pion, si la couleur est correcte et bien placée, correcte
mais mal placée, ou incorrecte.

| Difficulté | Pions par combinaison | Tentatives maximales |
| ---------- | --------------------: | -------------------: |
| Facile     |                     4 |                   12 |
| Moyenne    |                     6 |                   12 |
| Difficile  |                     6 |                   10 |

La palette comprend huit couleurs : rouge, bleu, vert, jaune, cyan, magenta,
orange et violet. Le décodeur gagne s'il trouve la combinaison avant d'avoir
épuisé ses tentatives.

## Fonctionnalités

Le projet est composé d'un frontend React et d'un backend indépendant. Le
serveur fournit l'inscription et la connexion, la création de parties,
l'invitation de joueurs, le démarrage d'une partie, la gestion du tour, la
consultation des parties en cours et l'historique des parties terminées.

Le frontend contient les formulaires d'inscription et de connexion, les
composants de création et de liste des parties, une vue d'historique, une
première interface de jeu et la logique de base du Mastermind. L'état
d'authentification et l'état de jeu sont structurés avec la Context API et des
reducers. Les appels asynchrones prévoient des états de chargement et de gestion
d'erreur dans les vues concernées.

## Architecture

```text
M4ST3RM1ND/
  src/
    api/          clients HTTP d'authentification et de jeu
    components/   navigation, formulaires et composants partagés
    context/      contextes et reducers d'authentification et de partie
    game/         règles, niveaux de difficulté et stockage du code secret
    pages/        écrans de connexion, jeu, historique et résultats
    types/        modèles TypeScript

game-server/
  auth.ts         inscription, connexion et authentification
  games.ts        opérations sur les parties et les tours
  db.ts           accès à SQLite
  openapi.yaml    contrat OpenAPI du serveur
```

Le serveur est générique : il connaît les joueurs, le statut d'une partie et
l'identifiant du joueur dont c'est le tour, mais ne connaît pas les règles du
Mastermind. Le frontend sérialise l'état du jeu et les résultats en JSON ; le
backend les stocke comme des chaînes opaques. Lorsqu'un tour est joué, le client
doit transmettre l'identifiant du joueur suivant.

## Installation et démarrage

### Prérequis

- Node.js et npm pour le frontend.
- Deno 2.9 ou supérieur pour le backend, requis par l'utilisation de
  `node:sqlite`.

### 1. Démarrer le backend

Dans un premier terminal, depuis le dossier `game-server` :

```sh
deno task dev
```

Le serveur démarre sur `http://localhost:8000`. La base SQLite `game.db` est
créée au premier lancement. La documentation interactive est disponible sur
[`http://localhost:8000/docs`](http://localhost:8000/docs), et le contrat brut
sur [`openapi.yaml`](../game-server/openapi.yaml).

### 2. Configurer et démarrer le frontend

Dans un second terminal, depuis le dossier `M4ST3RM1ND` :

```sh
npm install
npm run dev
```

Le serveur de développement Vite indique l'URL locale, généralement
`http://localhost:5173`. Créez un fichier `.env.local` à la racine du frontend
pour pointer vers le backend local :

```dotenv
VITE_API_URL=http://localhost:8000
```

Cette variable est utilisée par les clients d'authentification et de jeu. Elle
doit désigner l'origine du serveur, sans ajouter `/api`.

## API

Toutes les routes de jeu nécessitent un jeton transmis dans l'en-tête
`Authorization: Bearer <token>`. L'inscription et la connexion renvoient un
jeton de session.

| Méthode | Route                | Rôle                                                    |
| ------- | -------------------- | ------------------------------------------------------- |
| `POST`  | `/auth/signup`       | Créer un compte et ouvrir une session                   |
| `POST`  | `/auth/login`        | Ouvrir une session                                      |
| `POST`  | `/games`             | Créer une partie                                        |
| `POST`  | `/games/{id}/invite` | Inviter un joueur à une partie en attente               |
| `POST`  | `/games/{id}/start`  | Démarrer la partie et désigner le premier joueur        |
| `GET`   | `/games/mine`        | Lister ses parties en cours ou terminées non consultées |
| `GET`   | `/games/{id}`        | Consulter l'état d'une partie                           |
| `PUT`   | `/games/{id}/state`  | Mettre à jour l'état ou terminer la partie              |
| `POST`  | `/games/{id}/seen`   | Marquer une partie terminée comme consultée             |
| `GET`   | `/games/history`     | Consulter l'historique des parties terminées            |

Le détail des formats de requête, réponses et erreurs se trouve dans la
[documentation du backend](../game-server/README.md) et la
[spécification OpenAPI](../game-server/openapi.yaml).

## Scripts et vérifications

Depuis le dossier frontend :

```sh
npm run dev       # lancer Vite en développement
npm run build     # vérifier TypeScript et construire l'application
npm run lint      # analyser le code avec Oxlint
npm run preview   # prévisualiser le build de production
```

Depuis le dossier backend :

```sh
deno task dev     # démarrer avec rechargement automatique
deno task start   # démarrer sans mode watch
```

## État de l'intégration

Les services du backend et plusieurs vues du frontend sont présents, mais le
parcours multijoueur n'est pas encore intégré de bout en bout. L'application
principale raccorde actuellement l'inscription, la connexion et une page
d'accueil protégée ; les vues de parties et d'historique ne sont pas encore
reliées à cette navigation. Le plateau utilise encore des données de
démonstration. De plus, le formulaire frontend de création envoie actuellement
des champs différents de ceux attendus par `POST /games` côté backend.

Ces points doivent être alignés avant de considérer le parcours de création,
d'invitation, de jeu tour par tour et de consultation des résultats comme
validé.

## Sécurité

Ce backend est destiné au développement local et à un usage pédagogique. Sa
configuration CORS autorise toutes les origines et les mots de passe sont
hashés avec SHA-256 salé, plutôt qu'avec un algorithme dédié tel qu'Argon2 ou
bcrypt. Ne l'exposez pas tel quel sur un réseau public ou en production.
