'use strict';

const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean,
    GraphQLNonNull,
} = require('graphql');

const rectangleBounds = require('../rectagleBounds');
const { stationModel, connectionModel, connectionTypeModel, currentTypeModel, levelModel } = require('../model');

const geoJSONType = new GraphQLObjectType({
    name: 'geoJSON',
    fields: () => ({
        type: { type: GraphQLString },
        coordinates: { type: new GraphQLList(GraphQLFloat) },
    }),
});

const connectiontypeType = new GraphQLObjectType({
    name: 'connectiontype',
    fields: () => ({
        id: { type: GraphQLID },
        FormalName: { type: GraphQLString },
        Title: { type: GraphQLString },
    }),
});

const currenttypeType = new GraphQLObjectType({
    name: 'currenttype',
    fields: () => ({
        id: { type: GraphQLID },
        Description: { type: GraphQLString },
        Title: { type: GraphQLString },
    }),
});

const levelType = new GraphQLObjectType({
    name: 'level',
    fields: () => ({
        id: { type: GraphQLID },
        Comments: { type: GraphQLString },
        IsFastChargeCapable: { type: GraphQLBoolean },
        Title: { type: GraphQLString },
    }),
});

const stationType = new GraphQLObjectType({
    name: 'station',
    fields: () => ({
        id: { type: GraphQLID },
        Connections: {
            type: new GraphQLList(connectionType),
            resolve(parent, args) {
                return connectionModel.find({ _id: { $in: parent.Connections } });
            },
        },
        Title: { type: GraphQLString },
        AddressLine1: { type: GraphQLString },
        Town: { type: GraphQLString },
        StateOrProvince: { type: GraphQLString },
        Postcode: { type: GraphQLString },
        Location: { type: geoJSONType },
    }),
});

const connectionType = new GraphQLObjectType({
    name: 'connection',
    fields: () => ({
        id: { type: GraphQLID },
        ConnectionTypeID: {
            type: connectiontypeType,
            resolve(parent, args) {
                return connectionTypeModel.findById(parent.ConnectionTypeID);
            },
        },
        LevelID: {
            type: levelType,
            resolve(parent, args) {
                return levelModel.findById(parent.LevelID);
            },
        },
        CurrentTypeID: {
            type: currenttypeType,
            resolve(parent, args) {
                return currentTypeModel.findById(parent.CurrentTypeID);
            },
        },
        Quantity: { type: GraphQLInt },
    }),
});

const LatLng = new GraphQLInputObjectType({
    name: 'LatLng',
    description: 'Object containing latitude and longitude',
    fields: () => ({
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat },
    }),
});

const Bounds = new GraphQLInputObjectType({
    name: 'Bounds',
    description: 'Opposite corners of rectangular area on map',
    fields: () => ({
        _southWest: { type: LatLng },
        _northEast: { type: LatLng },
    }),
});

const InputConnection = new GraphQLInputObjectType({
    name: 'InputConnection',
    description: 'Connection type, level, current and quantity',
    fields: () => ({
        ConnectionTypeID: { type: new GraphQLNonNull(GraphQLID) },
        LevelID: { type: new GraphQLNonNull(GraphQLID) },
        CurrentTypeID: { type: new GraphQLNonNull(GraphQLID) },
        Quantity: { type: new GraphQLNonNull(GraphQLInt) },
    }),
});

const ModifyConnection = new GraphQLInputObjectType({
    name: 'ModifyConnection',
    description: 'Connection type, level, current and quantity',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        ConnectionTypeID: { type: GraphQLID },
        LevelID: { type: GraphQLID },
        CurrentTypeID: { type: GraphQLID },
        Quantity: { type: GraphQLInt },
    }),
});

const InputGeoJSONType = new GraphQLInputObjectType({
    name: 'Location',
    description: 'Location as array, longitude first',
    fields: () => ({
        type: { type: GraphQLString, defaultValue: 'Point' },
        coordinates: { type: new GraphQLNonNull(new GraphQLList(GraphQLFloat)) },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        station: {
            type: stationType,
            description: 'Get station by id',
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return stationModel.findById(args.id);
            },
        },
        stations: {
            type: new GraphQLList(stationType),
            description: 'Get all stations',
            args: {
                bounds: { type: Bounds },
                limit: { type: GraphQLInt, defaultValue: 10 },
                start: { type: GraphQLInt },
            },
            resolve: (parent, args) => {
                if (args.bounds) {
                    const mapBounds = rectangleBounds(args.bounds._northEast,
                        args.bounds._southWest);
                    return stationModel.find(({
                        Location: {
                            $geoWithin: { 
                                $geometry: mapBounds,
                            },
                        },
                    }));
                } else {
                    return stationModel.find().skip(args.start).limit(args.limit);
                }
            },
        },
        connectiontypes: {
            type: new GraphQLList(connectiontypeType),
            description: 'Connection types for connections',
            resolve: (parent, args) => {
                return connectionTypeModel.find();
            },
        },
        currenttypes: {
            type: new GraphQLList(currenttypeType),
            description: 'Current types for connections',
            resolve: (parent, args) => {
                return currentTypeModel.find();
            },
        },
        leveltypes: {
            type: new GraphQLList(levelType),
            description: 'Level types for connections',
            resolve: (parent, args) => {
                return levelModel.find();
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'MutationType',
    fields: () => ({
        addStation: {
            type: stationType,
            description: 'Add station',
            args: {
                Connections: {
                    type: new GraphQLNonNull(new GraphQLList(InputConnection)),
                },
                Title: { type: new GraphQLNonNull(GraphQLString) },
                AddressLine1: { type: new GraphQLNonNull(GraphQLString) },
                Town: { type: new GraphQLNonNull(GraphQLString) },
                StateOrProvince: { type: GraphQLString },
                Postcode: { type: new GraphQLNonNull(GraphQLString) },
                Location: { type: InputGeoJSONType },
            },
            resolve: async (parent, args, { req, res }) => {
                try {
                    const conns = await Promise.all(args.Connections.map(async conn => {
                        let newConnection = new connectionModel(conn);
                        const result = await newConnection.save();
                        return result._id;
                    }));

                    let newStation = new stationModel({
                        ...args,
                        Connections: conns,
                    });
                    return newStation.save();
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
        modifyStation: {
            type: stationType,
            description: 'Modify station',
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                Connections: {
                    type: new GraphQLList(ModifyConnection),
                },
                Title: { type: GraphQLString },
                AddressLine1: { type: GraphQLString },
                Town: { type: GraphQLString },
                StateOrProvince: { type: GraphQLString },
                Postcode: { type: GraphQLString },
            },
            resolve: async (parent, args, { req, res }) => {
                try {
                    const conns = await Promise.all(args.Connections.map(async conn => {
                        const result = await connectionModel.findByIdAndUpdate(conn.id, conn,
                            { new: true });
                        return result;
                    }));

                    let newStation = {
                        Title: args.Title,
                        AddressLine1: args.AddressLine1,
                        Town: args.Town,
                        StateOrProvince: args.StateOrProvince,
                        Postcode: args.Postcode,
                    };
                    return await stationModel.findByIdAndUpdate(args.id, newStation,
                        { new: true });
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
        deleteStation: {
            type: stationType,
            description: 'Delete station',
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve: async (parent, args, { req, res }) => {
                try {
                    const stat = await stationModel.findById(args.id);
                    const delResult = await Promise.all(
                        stat.Connections.map(async (conn) => {
                            return await connectionModel.findByIdAndDelete(conn._id);
                        }));
                    console.log('delete result', delResult);
                    const result = await stationModel.findByIdAndDelete(args.id);
                    console.log('delete result', result);
                    return result;
                }
                catch (err) {
                    throw new Error(err);
                }
            },
        },
    }),
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
