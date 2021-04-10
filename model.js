'use strict';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    ConnectionTypeID: { type: Schema.Types.ObjectId, ref: 'ConnectionType' },
    LevelID: { type: Schema.Types.ObjectId, ref: 'Level' },
    CurrentTypeID: { type: Schema.Types.ObjectId, ref: 'CurrentType' },
    Quantity: Number,
});

const connectionTypeSchema = new Schema({
    FormalName: String,
    Title: String,
});

const currentTypeSchema = new Schema({
    Description: String,
    Title: String,
});

const levelSchema = new Schema({
    Comments: String,
    Title: String,
    IsFastChargeCapable: Boolean,
});

const stationSchema = new Schema({
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

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    full_name: String,
  });

export const connectionModel = mongoose.model('Connection', connectionSchema);
export const connectionTypeModel = mongoose.model('ConnectionType', connectionTypeSchema);
export const currentTypeModel = mongoose.model('CurrentType', currentTypeSchema);
export const levelModel = mongoose.model('Level', levelSchema);
export const stationModel = mongoose.model('Station', stationSchema);
export const userModel = mongoose.model('User', userSchema);
