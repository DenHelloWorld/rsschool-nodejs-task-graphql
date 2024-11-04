import { GraphQLError } from 'graphql';

const handleGraphQLError = (error: unknown): GraphQLError => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  console.error('GraphQL Error:', errorMessage);
  return new GraphQLError(errorMessage);
};
export default handleGraphQLError;
