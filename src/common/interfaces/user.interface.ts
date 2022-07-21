export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  friends: string[];
  isAdmin: boolean;
  description: string;
}
