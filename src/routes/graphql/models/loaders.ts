import { User, Profile, Post, MemberType as PrismaMemberType } from '@prisma/client';
import DataLoader from 'dataloader';

interface Loaders {
  subscribedToUserLoader: DataLoader<string, User[]>;
  memberTypeLoader: DataLoader<string, PrismaMemberType | null>;
  postLoader: DataLoader<string, Post | null>;
  userLoader: DataLoader<string, User | null>;
  userSubscribedToLoader: DataLoader<string, User[]>;
  profileLoader: DataLoader<string, Profile | null>;
  postsByAuthorIdLoader: DataLoader<string, Post[]>;
}
export default Loaders;
