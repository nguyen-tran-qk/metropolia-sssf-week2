'use strict';

import { connectionModel, stationModel } from "../model.js";
import { UserInputError } from "apollo-server-errors";
import rectangelBounds from "../rectagleBounds.js";

export default {
    Query: {
        station: (parent, args) => {
            return stationModel.findById(args.id);
        },
        stations: async (parent, args) => {
            try {
                let res;
                const { start, limit, bounds } = args;
                if (bounds) {
                    const limitedArea = rectangelBounds(
                        bounds._southWest,
                        bounds._northEast
                    );
                    res = await stationModel.find({}).skip(start).where("Location").within(limitedArea).limit(limit);
                } else {
                    res = await stationModel.find({}).skip(start).limit(limit);
                }
                return res;
            } catch (error) {
                throw new UserInputError(
                    `Getting stations failed: ${error.message}`
                );
            }
        },
    },
    Mutation: {
        addStation: async (parents, args) => {
            try {
                const { Connections, ...data } = args;
                const addConnections = await Promise.all(
                    Connections.map(async (conn) => {
                        try {
                            const newConnection = new connectionModel(conn);
                            await newConnection.save();
                            return newConnection._id;
                        } catch (error) {
                            throw new UserInputError(
                                `Failed to create connections: ${error.message}`
                            );
                        }
                    })
                );

                const newStation = new stationModel({
                    ...data,
                    Connections: addConnections,
                });
                newStation.save();
                return data;
            } catch (error) {
                throw new UserInputError(
                    `Failed to create station: ${error.message}`
                );
            }
        },
        modifyStation: async (parents, args) => {
            try {
                const { id, Connections, ...data } = args;
                const stationUpdateData = await stationModel.findByIdAndUpdate(
                    id,
                    { ...data },
                    {
                        new: true,
                        upsert: true,
                    }
                );
                if (Connections) {
                    await Promise.all(
                        Connections.map(async (newConnections) => {
                            try {
                                const { id, ...data } = newConnections;
                                await connectionModel.findByIdAndUpdate(
                                    id,
                                    { ...data },
                                    {
                                        new: true,
                                        upsert: true,
                                    }
                                );
                            } catch (error) {
                                throw new UserInputError(
                                    `Failed to modify station: ${error.message}`
                                );
                            }
                        })
                    );
                }
                return stationUpdateData.save();
            } catch (error) {
                throw new UserInputError(
                    `Failed to modify station: ${error.message}`
                );
            }
        },
        deleteStation: async (_, args) => {
            try {
                const { id } = args;
                await stationModel.findByIdAndDelete(id);
                return id;
            } catch (error) {
                throw new UserInputError(
                    `Failed to delete station: ${error.message}`
                );
            }
        },
    },
};