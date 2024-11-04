import DataLoader from 'dataloader';
import { PrismaClient, User, Profile, Post, MemberType } from '@prisma/client';

const setLoaders = (prisma: PrismaClient) => {
  return {
    userLoader: new DataLoader<string, User | null>(async (ids) => {
      const userArr = await prisma.user.findMany({
        where: { id: { in: ids as string[] } },
      });
      return ids.map(
        (id) => new Map(userArr.map((user) => [user.id, user])).get(id) || null,
      );
    }),

    profileLoader: new DataLoader<string, Profile | null>(async (userIds) => {
      const profileArr = await prisma.profile.findMany({
        where: { userId: { in: userIds as string[] } },
      });
      return userIds.map(
        (userId) =>
          new Map(profileArr.map((profile) => [profile.userId, profile])).get(userId) ||
          null,
      );
    }),

    postsByAuthorIdLoader: new DataLoader<string, Post[]>(async (authorIds) => {
      const postArr = await prisma.post.findMany({
        where: { authorId: { in: authorIds as string[] } },
      });
      return authorIds.map(
        (authorId) =>
          postArr
            .reduce((map, post) => {
              if (!map.has(post.authorId)) {
                map.set(post.authorId, []);
              }
              map.get(post.authorId)!.push(post);
              return map;
            }, new Map<string, Post[]>())
            .get(authorId) || [],
      );
    }),

    userSubscribedToLoader: new DataLoader<string, User[]>(async (userIds) => {
      const subscriptionArr = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: userIds as string[] } },
        include: { author: true },
      });
      return userIds.map(
        (userId) =>
          subscriptionArr
            .reduce((map, sub) => {
              if (!map.has(sub.subscriberId)) {
                map.set(sub.subscriberId, []);
              }
              map.get(sub.subscriberId)!.push(sub.author);
              return map;
            }, new Map<string, User[]>())
            .get(userId) || [],
      );
    }),

    subscribedToUserLoader: new DataLoader<string, User[]>(async (userIds) => {
      const subscriberArr = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: userIds as string[] } },
        include: { subscriber: true },
      });
      return userIds.map(
        (userId) =>
          subscriberArr
            .reduce((map, sub) => {
              if (!map.has(sub.authorId)) {
                map.set(sub.authorId, []);
              }
              map.get(sub.authorId)!.push(sub.subscriber);
              return map;
            }, new Map<string, User[]>())
            .get(userId) || [],
      );
    }),

    memberTypeLoader: new DataLoader<string, MemberType | null>(async (ids) => {
      const memberTypeArr = await prisma.memberType.findMany({
        where: { id: { in: ids as string[] } },
      });
      return ids.map(
        (id) => new Map(memberTypeArr.map((mt) => [mt.id, mt])).get(id) || null,
      );
    }),

    postLoader: new DataLoader<string, Post | null>(async (ids) => {
      const postArr = await prisma.post.findMany({
        where: { id: { in: ids as string[] } },
      });
      return ids.map(
        (id) => new Map(postArr.map((post) => [post.id, post])).get(id) || null,
      );
    }),
  };
};

export default setLoaders;
