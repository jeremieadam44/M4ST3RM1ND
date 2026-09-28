# M4ST3RM1ND

Application de Mastermind multijoueur au tour par tour. Le frontend est réalisé
avec React, TypeScript et Vite. Le backend est un serveur REST Deno utilisant
SQLite pour les utilisateurs et les parties.

Le projet est pédagogique et fonctionne en local : le serveur ne connaît pas
les règles du Mastermind. Il stocke l'état de la partie et son résultat sous
forme de chaînes JSON gérées par le frontend.

## Sommaire

- [Fonctionnement](#fonctionnement)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Routes frontend](#routes-frontend)
- [API backend](#api-backend)
- [Arborescence complète](#arborescence-complète)
- [Scripts](#scripts)
- [Limites actuelles](#limites-actuelles)
- [Sécurité](#sécurité)

## Fonctionnement

Le créateur d'une partie choisit un code secret. Le décodeur propose des
combinaisons de couleurs et reçoit un indice pour chaque proposition :

- rouge : couleur correcte et bien placée ;
- blanc : couleur correcte mais mal placée ;
- vide : couleur absente du code.

Les difficultés disponibles sont définies dans
`src/game/constants.ts` :

| Difficulté | Emplacements | Tentatives |
| ---------- | -----------: | ---------: |
| Facile     |            4 |         12 |
| Moyenne    |            6 |         12 |
| Difficile  |            6 |         10 |

Les huit couleurs disponibles sont `red`, `blue`, `green`, `yellow`, `cyan`,
`magenta`, `orange` et `purple`.

## Fonctionnalités

- inscription et connexion par email et mot de passe ;
- restauration de la session frontend ;
- création d'une partie avec un nombre minimum et maximum de joueurs ;
- invitation d'un joueur par email ;
- démarrage d'une partie et gestion du joueur actif ;
- sauvegarde de l'état Mastermind dans le backend ;
- affichage des parties en cours et terminées non consultées ;
- plateau de jeu avec choix des couleurs et validation des tours ;
- affichage du résultat et de l'historique ;
- page de règles accessible depuis la navigation ;
- gestion des chargements et des erreurs réseau.

## Installation

### Prérequis

- Node.js et npm pour le frontend ;
- Deno 2.9 ou supérieur pour le backend, notamment pour `node:sqlite`.

### Backend

Dans un terminal :

```sh
cd game-server
deno task dev
```

Le serveur écoute sur `http://localhost:8000`. La base `game.db` est créée
automatiquement dans `game-server/`.

Le serveur peut aussi être lancé sans rechargement automatique :

```sh
deno task start
```

### Frontend

Dans un second terminal :

```sh
cd M4ST3RM1ND
npm install
npm run dev
```

Vite affiche généralement l'application sur `http://localhost:5173`.

L'URL du backend peut être configurée dans un fichier `.env.local` placé à la
racine du frontend :

```dotenv
VITE_API_URL=http://localhost:8000
```

Si la variable est absente, cette même URL est utilisée par défaut.

## Routes frontend

| Route                   | Accès       | Page                         |
| ----------------------- | ----------- | ---------------------------- |
| `/login`                | Public      | Connexion                    |
| `/register`             | Public      | Création de compte           |
| `/games`                | Authentifié | Liste et création de parties |
| `/games/:gameId`        | Authentifié | Plateau de jeu               |
| `/games/:gameId/result` | Authentifié | Résultat d'une partie        |
| `/history`              | Authentifié | Historique                   |
| `/rules`                | Authentifié | Règles du Mastermind         |
| `/`                     | Authentifié | Redirection vers `/games`    |

La barre de navigation affiche les liens des pages principales pour un
utilisateur connecté. `ProtectedRoute.tsx` redirige les utilisateurs non
connectés vers `/login`.

## API backend

Toutes les routes suivantes, sauf l'inscription et la connexion, nécessitent
un en-tête `Authorization: Bearer <token>`.

| Méthode | Route               | Description                           |
| ------- | ------------------- | ------------------------------------- |
| `POST`  | `/auth/signup`      | Créer un compte et ouvrir une session |
| `POST`  | `/auth/login`       | Ouvrir une session                    |
| `POST`  | `/games`            | Créer une partie                      |
| `POST`  | `/games/:id/invite` | Inviter un joueur                     |
| `POST`  | `/games/:id/start`  | Démarrer une partie                   |
| `GET`   | `/games/mine`       | Lister les parties de l'utilisateur   |
| `GET`   | `/games/:id`        | Récupérer une partie                  |
| `PUT`   | `/games/:id/state`  | Mettre à jour ou terminer une partie  |
| `POST`  | `/games/:id/seen`   | Marquer un résultat comme vu          |
| `GET`   | `/games/history`    | Récupérer l'historique                |

La documentation détaillée des corps de requête et des réponses se trouve dans
[`game-server/README.md`](../game-server/README.md), ainsi que dans
[`game-server/openapi.yaml`](../game-server/openapi.yaml). Une fois le serveur
lancé, Swagger est disponible sur `http://localhost:8000/docs`.

## Arborescence complète

Les dossiers `node_modules/`, `dist/` et la base SQLite locale ne sont pas du
code source et ne sont pas inclus dans l'arborescence fonctionnelle.

```text
M4ST3RM1ND/
├── index.html                 # Point d'entrée HTML Vite
├── package.json               # Dépendances et scripts frontend
├── vite.config.ts             # Configuration Vite
├── tsconfig.json              # Configuration TypeScript globale
├── tsconfig.app.json          # TypeScript de l'application
├── tsconfig.node.json         # TypeScript de la configuration Node
├── .oxlintrc.json             # Configuration Oxlint
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.tsx               # Montage React dans #root
    ├── App.tsx                # Routeur, providers et routes
    ├── App.css                # Styles de l'application
    ├── index.css              # Variables et styles globaux
    ├── api/
    │   ├── client.ts          # Client HTTP générique et erreurs API
    │   ├── auth.ts            # Appels d'inscription et de connexion
    │   └── game.ts            # Appels liés aux parties
    ├── assets/
    │   ├── hero.png           # Image utilisée par les écrans d'authentification
    │   ├── react.svg
    │   └── vite.svg
    ├── components/
    │   ├── CreateGameForm.tsx # Formulaire de création de partie
    │   ├── DifficultySelector.tsx
    │   ├── ErrorMessage.tsx   # Affichage des erreurs et relance
    │   ├── Loading.tsx        # Affichage du chargement
    │   ├── NavBar.tsx         # Navigation principale
    │   └── ProtectedRoute.tsx # Protection des routes authentifiées
    ├── context/
    │   ├── AuthContext.tsx    # Session, connexion et déconnexion
    │   └── GameContext.tsx    # État et reducer d'une partie
    ├── game/
    │   ├── constants.ts       # Paramètres par difficulté
    │   ├── mastermindLogic.ts  # Victoire et fin de partie
    │   ├── mockData.ts        # Données de démonstration
    │   ├── secretStorage.ts   # Stockage local du code secret
    │   └── serialization.ts   # Conversion état/résultat vers JSON
    ├── hooks/
    │   └── useAsyncData.ts    # Hook de chargement asynchrone
    ├── pages/
    │   ├── GameBoard.tsx      # Plateau et gestion des tours
    │   ├── GameList.tsx       # Parties de l'utilisateur
    │   ├── GameResult.tsx     # Présentation d'un résultat
    │   ├── GameResultPage.tsx  # Page de résultat connectée à l'API
    │   ├── History.tsx        # Historique des parties
    │   ├── Login.tsx          # Connexion
    │   ├── NotFound.tsx       # Route inconnue
    │   ├── Register.tsx       # Inscription
    │   └── Rules.tsx          # Règles du jeu
    └── types/
        ├── game.ts            # Types correspondant à l'API des parties
        ├── mastermind.ts      # Types du jeu et de ses couleurs
        └── user.ts            # Types utilisateur et session

game-server/
├── main.ts                    # Démarrage du serveur HTTP
├── http.ts                    # Réponses HTTP, CORS et routage de base
├── auth.ts                    # Inscription, connexion et tokens
├── games.ts                   # Création et évolution des parties
├── db.ts                      # Connexion et requêtes SQLite
├── docs.ts                    # Service de la documentation OpenAPI
├── deno.json                  # Tâches Deno
├── deno.lock                  # Verrouillage des dépendances Deno
├── openapi.yaml               # Spécification OpenAPI
├── routes.md                  # Résumé des routes
└── README.md                  # Documentation détaillée du serveur
```

## Scripts

Depuis le dossier frontend :

```sh
npm run dev       # Serveur Vite de développement
npm run build     # Vérification TypeScript et build de production
npm run lint      # Analyse statique avec Oxlint
npm run preview   # Servir le build de production localement
```

Depuis `game-server/` :

```sh
deno task dev     # Serveur avec rechargement automatique
deno task start   # Serveur sans mode watch
```

Une vérification complète du frontend peut être effectuée avec :

```sh
npm run lint && npm run build
```

## Limites actuelles

- Le backend stocke l'état JSON sans le valider : le frontend reste responsable
  de la cohérence des règles.
- Le code secret est conservé localement côté client pour le rôle de créateur.
- Le parcours de jeu est fonctionnel mais reste un projet pédagogique, sans
  tests automatisés ni mécanisme anti-triche côté serveur.
- Les erreurs et certains textes peuvent encore être harmonisés dans les vues.

## Sécurité

Le serveur est prévu pour un usage local. Le CORS est volontairement ouvert et
les mots de passe sont hashés avec SHA-256 salé, plutôt qu'avec Argon2 ou
bcrypt. Ne déployez pas cette configuration telle quelle sur un réseau public
ou en production.
