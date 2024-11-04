interface IUser {
  id: string;
  name: string;
  balance: number;
  userSubscribedTo?: { authorId: string }[];
  subscribedToUser?: { subscriberId: string }[];
}
export default IUser;
