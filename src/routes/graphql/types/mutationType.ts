import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import UserType from './userType.js';
import { UUIDType } from './uuid.js';
import {
  ChangePostInputType,
  ChangeProfileInputType,
  ChangeUserInputType,
  CreatePostInputType,
  CreateProfileInputType,
  CreateUserInputType,
  IChangePostInputTypeFields,
  IChangeProfileInputTypeFields,
  IChangeUserInputFields,
  ICreatePostInputTypeFields,
  ICreateProfileInputTypeFields,
  ICreateUserInputTypeFields,
} from './inputTypes.js';
import Context from '../models/context.js';
import { PostType } from './postType.js';
import ProfileType from './profileType.js';

const MutationType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (
        _parent,
        { id, dto }: { id: string; dto: IChangeUserInputFields },
        context: Context,
      ) => {
        const user = await context.prisma.user.update({
          where: { id },
          data: dto,
        });
        context.loaders.userLoader.clear(id).prime(id, user);
        return user;
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (
        _parent,
        { id, dto }: { id: string; dto: IChangeProfileInputTypeFields },
        context,
      ) => {
        const profile = await context.prisma.profile.update({
          where: { id },
          data: dto,
        });
        context.loaders.profileLoader
          .clear(profile.userId)
          .prime(profile.userId, profile);
        return profile;
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (
        _parent,
        { id, dto }: { id: string; dto: IChangePostInputTypeFields },
        context,
      ) => {
        const post = await context.prisma.post.update({
          where: { id },
          data: dto,
        });
        context.loaders.postLoader.clear(id).prime(id, post);
        return post;
      },
    },
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (_parent, { dto }: { dto: ICreateUserInputTypeFields }, context) => {
        const user = await context.prisma.user.create({
          data: dto,
        });
        context.loaders.userLoader.prime(user.id, user);
        return user;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (
        _parent,
        { dto }: { dto: ICreateProfileInputTypeFields },
        context,
      ) => {
        const profile = await context.prisma.profile.create({
          data: dto,
        });
        context.loaders.profileLoader.prime(profile.id, profile);
        return profile;
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (parent, { dto }: { dto: ICreatePostInputTypeFields }, context) => {
        const post = await context.prisma.post.create({
          data: dto,
        });
        context.loaders.postsByAuthorIdLoader.clear(dto.authorId);
        return post;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }: { id: string }, context) => {
        await context.prisma.user.delete({
          where: { id },
        });
        context.loaders.userLoader.clear(id);
        return `User ${id} deleted successfully.`;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { id }: { id: string }, context) => {
        await context.prisma.post.delete({
          where: { id },
        });
        return `Post ${id} deleted successfully.`;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, context) => {
        await context.prisma.profile.delete({
          where: { id },
        });
        context.loaders.profileLoader.clear(id);
        return `Profile ${id} deleted successfully.`;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) => {
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
        context.loaders.userSubscribedToLoader.clear(userId);
        context.loaders.subscribedToUserLoader.clear(authorId);
        return `Subscribed successfully`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        context.loaders.userSubscribedToLoader.clear(userId);
        context.loaders.subscribedToUserLoader.clear(authorId);
        return `Unsubscribed successfully`;
      },
    },
  },
});
export default MutationType;