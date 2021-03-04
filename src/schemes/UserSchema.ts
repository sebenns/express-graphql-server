import {
    GraphQLFieldConfigMap,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString
} from 'graphql';
import {GenderType} from './GenderType';
import {UserDAO} from '../neo4j/UserDAO';

/* Defining graphql User objectType, written in graphQL as:
 type User {
 id: ID!
 username: String
 email: String
 gender: GenderType
 firstName: String
 lastName: String
 }
 */
export const User: GraphQLObjectType = new GraphQLObjectType({
    name  : 'User',
    fields: {
        id       : {
            type       : GraphQLNonNull(GraphQLID),
            description: 'user identifier.'
        },
        username : {
            type       : GraphQLString,
            description: 'name of user.'
        },
        email    : {
            type       : GraphQLString,
            description: "email of user."
        },
        gender   : {
            type       : GenderType,
            description: 'gender of user.'
        },
        firstName: {
            type       : GraphQLString,
            description: 'firstName of user.'
        },
        lastName : {
            type       : GraphQLString,
            description: 'lastName of user.'
        },
    }
});

// GraphQLInputObjectType used in mutations
export const UserInput: GraphQLInputObjectType = new GraphQLInputObjectType({
    name  : 'UserInput',
    fields: {
        username : {type: GraphQLString},
        email    : {type: GraphQLString},
        gender   : {type: GenderType},
        firstName: {type: GraphQLString},
        lastName : {type: GraphQLString}
    }
});

// GraphQL queries: user(id), users
export const UserQueries: GraphQLFieldConfigMap<string, string> = {
    user : {
        type   : User,
        args   : {
            id: {type: GraphQLID}
        },
        resolve: async (root, args) =>
        {
            const {id} = args;
            return await UserDAO.get(id);
        }
    },
    users: {
        type   : new GraphQLList(User),
        resolve: async () =>
        {
            return await UserDAO.getAll();
        }
    }
};

// GraphQL mutations: createUser(props), updateUser(id, props), deleteUser(id)
export const UserMutation: GraphQLFieldConfigMap<string, string> = {
    createUser: {
        type   : User,
        args   : {
            props: {type: UserInput}
        },
        resolve: async (root, args) =>
        {
            const {props} = args;
            return await UserDAO.create(props);
        }
    },
    updateUser: {
        type   : User,
        args   : {
            id   : {type: GraphQLID},
            props: {type: UserInput}
        },
        resolve: async (root, args) =>
        {
            const {id} = args;
            const {props} = args;
            return await UserDAO.update(id, props);
        }
    },
    deleteUser: {
        type   : GraphQLString,
        args   : {
            id: {type: GraphQLID}
        },
        resolve: async (root, args) =>
        {
            const {id} = args;
            await UserDAO.delete(id);
            return `Success message for delete procedure with id: ${id}`;
        }
    }
};
