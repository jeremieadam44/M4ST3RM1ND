export interface User {
  id: number;
  email: string;
  username: string;
  profilePicture?: string | null;
}

export interface AuthSession {
  user: User;
  token: string;
}
