export type Color =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "cyan"
  | "magenta"
  | "orange"
  | "purple";

export type Difficulty = "easy" | "medium" | "hard";

export type Tips = "red" | "white" | "empty";

export interface Attempt {
  guess: Color[];
  feedback?: Feedback;
}

export interface Feedback {
  pose?: Tips[];
  white?: number;
  red?: number;
}

export interface GameState {
  difficulty: Difficulty;
  attempts: Attempt[];
  masterId: number;
}

export interface EndData {
	revealedCode: Color[];
	winnerId: number;
}
