const Joi = require('joi');

const schema = Joi.object({
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

module.exports = schema;