export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  followers: string[];
  followings: string[];
  friends: string[];
  isAdmin: boolean;
  description: string;
}
