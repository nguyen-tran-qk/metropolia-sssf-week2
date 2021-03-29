'use strict';

const express = require('express');
const router = express.Router();
const { stationModel, connectionModel } = require('./model');
const rectangleBounds = require('./rectagleBounds');

router.route('/')
    .get(async (req, res) => {
        if (req.query.topRight && req.query.bottomLeft) {
            const polygon = rectangleBounds(JSON.parse(req.query.topRight), JSON.parse(req.query.bottomLeft));
            res.send(await stationModel.find().where('Location').within(polygon).limit(parseInt(req.query.limit) || 10));
        } else {
            res.send(await stationModel.find()
                .populate({
                    path: 'Connections',
                    populate: [
                        {
                            path: 'ConnectionTypeID'
                        },
                        {
                            path: 'LevelID'
                        },
                        {
                            path: 'CurrentTypeID'
                        } ]
                }).limit(parseInt(req.query.limit) || 10));
        }
    })
    .post(async (req, res) => {
        let connections = [];
        for (const connection of req.body.Connections) {
            connections.push(await connectionModel.create(connection));
        }
        const station = await stationModel.create({
            ...req.body.Station,
            Connections: connections,
            Location: { type: 'Point', coordinates: req.body.Station.Location.coordinates }
        });
        res.send(station);
    });

router.route('/:id')
    .get(async (req, res) => {
        res.send(await stationModel.find().where('_id', req.params.id).populate({
            path: 'Connections',
            populate: [
                {
                    path: 'ConnectionTypeID'
                },
                {
                    path: 'LevelID'
                },
                {
                    path: 'CurrentTypeID'
                } ]
        }));
    });

module.exports = router;
