const Joi = require("joi")

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    categories: Joi.array()
    .items(Joi.string().valid(
      'trending', 'room', 'BeachFronts', 'Tropical',
      'mountain', 'Towers', 'arctic', 'boats',
      'play', 'skiing'
    ))
    .min(1)
    .max(3)
    .required()
  });

  module.exports.reviewSchema = Joi.object({
    comment : Joi.string().required(),
    rating : Joi.number().required().min(1).max(5)
  })
  