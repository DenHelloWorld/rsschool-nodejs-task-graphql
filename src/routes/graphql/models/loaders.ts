import { User, Profile, Post, MemberType as PrismaMemberType } from '@prisma/client';
import DataLoader from 'dataloader';

interface Loaders {
  userLoader: DataLoader<string, User | null>;
  profileLoader: DataLoader<string, Profile | null>;
  postsByAuthorIdLoader: DataLoader<string, Post[]>;
  userSubscribedToLoader: DataLoader<string, User[]>;
  subscribedToUserLoader: DataLoader<string, User[]>;
  memberTypeLoader: DataLoader<string, PrismaMemberType | null>;
  postLoader: DataLoader<string, Post | null>;
}
export default Loaders;
