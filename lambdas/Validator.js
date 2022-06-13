const Joi = require('joi');

const pet = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    category: {
        id: Joi.number(),
        name: Joi.string()
    },
    photoUrls: Joi.array().items(Joi.string()),
    tags: Joi.array().items({
        id: Joi.number(),
        name: Joi.string()
    }),
    status: Joi.string()
})

const updatingPet = Joi.object({
    name: Joi.string(),
    status: Joi.string()
})

const status = Joi.object({
    status: Joi.string().required()
})

const petId = Joi.object({
    petId: Joi.number().required()
})

module.exports = {
    pet,
    updatingPet,
    status,
    petId
}