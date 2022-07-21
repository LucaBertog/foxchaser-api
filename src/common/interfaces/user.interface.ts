export interface User {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  friends: string[];
  isAdmin: boolean;
  description: string;
}
