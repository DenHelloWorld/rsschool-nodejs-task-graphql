import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import IUser from '../models/user.js';
import { UUIDType } from './uuid.js';
import ProfileType from './profileType.js';
import Context from '../models/context.js';
import { PostType } from './postType.js';

const UserType: GraphQLObjectType<IUser> = new GraphQLObjectType<IUser>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (parent: IUser, _args, context: Context) => {
        const { profileLoader } = context.loaders;
        return profileLoader.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent: IUser, _args, context: Context) => {
        const { postsByAuthorIdLoader } = context.loaders;
        return postsByAuthorIdLoader.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent: IUser, _args, context: Context) => {
        if (parent.userSubscribedTo) {
          const authorIds = parent.userSubscribedTo.map((sub) => sub.authorId);
          const authors = await context.loaders.userLoader.loadMany(authorIds);
          return authors;
        }
        const { userSubscribedToLoader } = context.loaders;
        return userSubscribedToLoader.load(parent.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent: IUser, _args, context: Context) => {
        if (parent.subscribedToUser) {
          const subscriberIds = parent.subscribedToUser.map((sub) => sub.subscriberId);
          const subscribers = await context.loaders.userLoader.loadMany(subscriberIds);
          return subscribers;
        }
        const { subscribedToUserLoader } = context.loaders;
        return subscribedToUserLoader.load(parent.id);
      },
    },
  }),
});
export default UserType;
