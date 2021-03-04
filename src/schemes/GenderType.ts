import {GraphQLEnumType} from 'graphql';

export const GenderType: GraphQLEnumType = new GraphQLEnumType({
    name  : 'Gender',
    values: {
        'non_specified': {value: 0},
        'female'       : {value: 1},
        'male'         : {value: 2},
        'non_binary'   : {value: 3}
    }
});
