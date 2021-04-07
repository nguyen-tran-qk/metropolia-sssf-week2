'use strict';
import { gql } from "apollo-server-express";

export default gql`
  type Connection {
    quantity: Int
    ConnectionTypeID: ConnectionType
    CurrentTypeID: CurrentType
    LevelID: LevelType
  }
`;