'use strict';

import { connectionTypeModel } from "../model.js";

export default {
    Query: {
        ConnectionType: () => connectionTypeModel.find(),
    },
    Connection: {
        ConnectionTypeID: (parent) => connectionTypeModel.findById(parent.ConnectionTypeID),
    },
};