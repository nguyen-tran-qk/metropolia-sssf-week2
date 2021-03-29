'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    ConnectionTypeID: { type: Schema.Types.ObjectId, ref: 'ConnectionType' },
    LevelID: { type: Schema.Types.ObjectId, ref: 'Level' },
    CurrentTypeID: { type: Schema.Types.ObjectId, ref: 'CurrentType' },
    quantity: Number,
});

const connectionTypeSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    FormalName: String,
    Title: String,
});

const currentTypeSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    Description: String,
    Title: String,
});

const levelSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    Comments: String,
    Title: String,
    IsFastChargeCapable: Boolean,
});

const stationSchema = new Schema({
    // _id: Schema.Types.ObjectId,
    Title: String,
    AddressLine1: String,
    Town: String,
    StateOrProvince: String,
    Postcode: String,
    Location: {
        type: {
            type: String,
            enum: [ 'Point' ],
            required: true
        },
        coordinates: {
            type: [ Number ],
            required: true
        }
    },
    Connections: [ { type: Schema.Types.ObjectId, ref: 'Connection' } ]
});

module.exports = {
    connectionModel: mongoose.model('Connection', connectionSchema),
    connectionTypeModel: mongoose.model('ConnectionType', connectionTypeSchema),
    currentTypeModel: mongoose.model('CurrentType', currentTypeSchema),
    levelModel: mongoose.model('Level', levelSchema),
    stationModel: mongoose.model('Station', stationSchema),
};