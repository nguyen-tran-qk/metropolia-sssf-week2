'use strict';
// catController
const catModel = require('../models/catModel');

const cat_list_get = async (req, res) => {
    res.send(
        await catModel.find()
            .where('gender').equals(req.query.gender)
            .where('age').gt(req.query.age)
            .where('weight').gt(req.query.weight)
    );
};

const cat_get = async (req, res) => {
    res.send(await catModel.findById(req.params.id));
};

const cat_post = async (req, res) => {
    console.log(req);
    const cat = await catModel.create({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        color: req.body.color,
        weight: req.body.weight,
    });
    res.send(`A new cat named ${cat.name} has been created with id: ${cat._id}`)
};

const cat_put = async (req, res) => {
    const cat = await catModel.updateOne({ _id: req.params.id }, { name: req.body.name });
    res.status(200).send(`The cat has been successfully renamed at ${cat.nModified}`);
};

const cat_delete = async (req, res) => {
    const del = await catModel.deleteOne({ _id: req.params.id });
    res.send(`Deleted ${del.deletedCount} cat`);
};

module.exports = {
    cat_list_get,
    cat_get,
    cat_post,
    cat_put,
    cat_delete,
};