export interface RequestUser {
  userId: number;
  username: string;
}

export interface RequestWithUser extends Request {
  user: RequestUser;
}
