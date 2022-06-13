const Joi = require('joi');

const schema = Joi.object({
    id: Joi.number,
    name: Joi.string,
    category: Joi.object,
    photoUrls: Joi.array,
    tags: Joi.array,
    status: Joi.string
})

module.exports = schema;