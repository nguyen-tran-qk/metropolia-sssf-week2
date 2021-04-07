'use strict';
import { levelModel } from "../model.js";

export default {
    Query: {
        LevelType: () => levelModel.find({}),
    },
    Connection: {
        LevelID: (parent) => levelModel.findById(parent.LevelID),
    },
};