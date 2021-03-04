import {GraphQLObjectType, GraphQLSchema} from 'graphql';
import {UserMutation, UserQueries} from './UserSchema';

// Merging all queries with spread operator
const Queries: GraphQLObjectType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        ...UserQueries,
    }
});

// Merging all mutations with spread operator
const Mutation: GraphQLObjectType = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
        ...UserMutation
   }
});

// Creating schema const for endpoint usage
export const schema: GraphQLSchema = new GraphQLSchema({
    query: Queries,
    mutation: Mutation
});
