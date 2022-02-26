import { gql } from "apollo-server-core";

export const typeDefs = gql`
    type User {
        id :ID!
        name: String
    }

    type Query {
        users: [User!]!
    }
`;