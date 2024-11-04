import { GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { MemberType, MemberTypeIdEnum } from './memberType.js';
import { PostType } from './postType.js';
import ProfileType from './profileType.js';
import UserType from './userType.js';
import { UUIDType } from './uuid.js';
import Context from '../models/context.js';

export const QueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_parent, _args, context: Context) => {
        try {
          const memberTypes = await context.prisma.memberType.findMany();
          return memberTypes;
        } catch (error) {
          console.error('Error in memberTypes resolver:', error);
          throw error;
        }
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, context) => {
        return context.prisma.user.findUnique({ where: { id } });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (_parent, _args, context: Context, info) => {
        const parsedInfo = parseResolveInfo(info);
        if (!parsedInfo?.fieldsByTypeName.User) {
          return context.prisma.user.findMany();
        }

        const fields = parsedInfo.fieldsByTypeName.User;

        const include = {
          profile: false,
          posts: false,
          userSubscribedTo: false,
          subscribedToUser: false,
        };
        if (fields['profile']) {
          include.profile = true;
        }
        if (fields['posts']) {
          include.posts = true;
        }
        if (fields['userSubscribedTo']) {
          include.userSubscribedTo = true;
        }
        if (fields['subscribedToUser']) {
          include.subscribedToUser = true;
        }

        const users = await context.prisma.user.findMany({ include });
        users.forEach((user) => {
          context.loaders.userLoader.prime(user.id, user);
        });
        return users;
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (_parent, _args, context) => {
        const posts = await context.prisma.post.findMany();
        posts.forEach((post) => {
          context.loaders.postLoader.prime(post.id, post);
        });
        return posts;
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.prisma.memberType.findUnique({ where: { id } });
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, context) => {
        return context.prisma.post.findUnique({ where: { id } });
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, context: Context) => {
        return context.prisma.profile.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: async (_parent, _args, context) => {
        const profiles = await context.prisma.profile.findMany();
        profiles.forEach((profile) => {
          context.loaders.profileLoader.prime(profile.id, profile);
        });
        return profiles;
      },
    },
  },
});
