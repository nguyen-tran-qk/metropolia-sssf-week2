'use strict';

import { currentTypeModel } from "../model.js";

export default {
    Query: {
        CurrentType: () => currentTypeModel.find({}),
    },
    Connection: {
        CurrentTypeID: (parent) => currentTypeModel.findById(parent.CurrentTypeID),
    },
};