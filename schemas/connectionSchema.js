'use strict';
import { gql } from "apollo-server-express";

export default gql`
  type Connection {
    Quantity: Int
    ConnectionTypeID: ConnectionType
    CurrentTypeID: CurrentType
    LevelID: LevelType
  }
`;