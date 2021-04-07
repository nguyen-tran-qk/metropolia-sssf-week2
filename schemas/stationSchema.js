import { gql } from "apollo-server-express";

export default gql`
  type Station {
    id: ID
    Title: String
    Town: String
    AddressLine1: String
    StateOrProvince: String
    Postcode: String
    Location: Location
    Connections: [Connection]
  }

  type Location {
    type: String
    coordinates: [Float]
  }

  input LatLng {
    lat: Float
    lng: Float
  }

  input Bounds {
    _southWest: LatLng
    _northEast: LatLng
  }

  input NewConnection {
    ConnectionTypeID: String
    CurrentTypeID: String
    LevelID: String
    Quantity: Int
  }

  input NewLocation {
    coordinates: [Float]
  }

  type Query {
    station(id: ID): Station
    stations(start: Int = 0, limit: Int = 5, bounds: Bounds): [Station]
  }
  
  type Mutation {
    addStation(
      Connections: [NewConnection]
      Postcode: String
      Title: String
      AddressLine1: String
      StateOrProvince: String
      Town: String
      Location: NewLocation
    ): Station
    modifyStation(
      id: ID!
      Connections: [NewConnection]
      Postcode: String
      Title: String
      AddressLine1: String
      StateOrProvince: String
      Town: String
    ): Station
    deleteStation(id: ID): ID
  }
`;