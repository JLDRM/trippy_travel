const graphql = require("graphql");

const RecordModel = require("../models/Record");

// Define the SCHEMA to pass as a parameter at the graphqlHTTP function
// this will describe the data on this kind of graph
// describe the object types and the relation between this object types
// how to query, receive, mutate and change the data

// Grab some properties from graphql as tools
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull // Add required fields within the mutations
} = graphql;

const RecordType = new GraphQLObjectType({
  name: "Record",
  fields: () => ({
    id: { type: GraphQLID },
    nickname: { type: GraphQLString },
    scoreTime: { type: GraphQLString },
    description: { type: GraphQLString },
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    record: {
      type: RecordType,
      args: { id: { type: GraphQLID } }, // args allow us to pass data to resolve function
      resolve(parent, args) {
        return RecordModel.findById(args.id);
      }
    },
    records: {
      type: new GraphQLList(RecordType),
      resolve(parent, args) {
        return RecordModel.find();
      }
    }
  }
});

// What are mutations?
// Is what allow us mutate or change our data: adding data, deleting data...
// We must explicitly declare what data could be added, deleted, updated...
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addRecord: {
      type: RecordType,
      args: {
        nickname: { type: new GraphQLNonNull(GraphQLString) },
        scoreTime: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let record = new RecordModel({
          nickname: args.nickname,
          scoreTime: args.scoreTime,
          description: args.description,
        });
        return record.save();
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
