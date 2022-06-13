const Joi = require('joi');

const schema = Joi.object({
    config: {
        validate: {
            params: {
                status: Joi.string().required(),
            },
        }
    }
})

module.exports = schema;
