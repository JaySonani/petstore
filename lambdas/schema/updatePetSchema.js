const Joi = require('joi');

const schema = Joi.object({
    name: Joi.string(),
    status: Joi.string()
})

module.exports = schema;