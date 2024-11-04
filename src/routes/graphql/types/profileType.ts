import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './memberType.js';
import IProfile from '../models/profile.js';
import Context from '../models/context.js';

const ProfileType = new GraphQLObjectType<IProfile>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (parent: IProfile, _args, context: Context) => {
        const { memberTypeLoader } = context.loaders;
        return memberTypeLoader.load(parent.memberTypeId);
      },
    },
  }),
});

export default ProfileType;
