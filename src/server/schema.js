
import {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: { type: GraphQLString },
  }),
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: UserType,
      resolve: () => ({
        name: 'Guillaume',
      }),
    },
  }),
})

export default new GraphQLSchema({ query: QueryType })
