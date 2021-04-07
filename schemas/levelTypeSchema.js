
'use strict';
import { gql } from "apollo-server-express";

export default gql`
  type LevelType {
    id: ID
    Title: String
    Comments: String
    IsFastChargeCapable: Boolean
  }

  extend type Query {
    LevelType: [LevelType]
  }
`;