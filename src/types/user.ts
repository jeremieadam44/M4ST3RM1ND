export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
