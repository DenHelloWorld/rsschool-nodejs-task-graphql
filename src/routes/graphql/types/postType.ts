import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLScalarType,
} from 'graphql';
import { UUIDType } from './uuid.js';

interface IPostType {
  name: string;
  fields: {
    id: GraphQLNonNull<GraphQLScalarType<string | undefined, string>>;
    title: GraphQLNonNull<GraphQLScalarType<string, string>>;
    content: GraphQLNonNull<GraphQLScalarType<string, string>>;
  };
}

export const PostType = new GraphQLObjectType<IPostType>({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});
