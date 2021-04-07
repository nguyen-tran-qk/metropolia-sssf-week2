'use strict';

import { connectionModel } from "../model.js";

export default {
    Station: {
        Connections: (parent) => parent.Connections.map((id) => connectionModel.findById(id)),
    },
};