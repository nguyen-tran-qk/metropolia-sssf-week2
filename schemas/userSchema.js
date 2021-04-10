'use strict';

import { gql } from "apollo-server-core";

export default gql`
  type User {
    username: String!
    id: ID!
    token: String
  }
  extend type Query {
    login(username: String!, password: String!): User
  }
  extend type Mutation {
    register(username: String!, password: String!): User
  }
`;