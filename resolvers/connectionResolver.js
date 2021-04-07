'use strict';

import { connectionModel } from "../model.js";

export default {
    Station: {
        Connections: (parent) => parent.Connections.map((id) => {
            console.log(connectionModel.findById(id))
            return connectionModel.findById(id)
        }),
    },
};