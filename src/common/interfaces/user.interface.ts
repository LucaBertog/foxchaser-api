export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  coverPicture: string;
  followers: string[];
  followings: string[];
  isAdmin: boolean;
  description: string;
  emblems: string[];
}
