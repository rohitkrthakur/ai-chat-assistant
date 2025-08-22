export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  createdAt: string;
}

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}