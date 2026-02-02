const Joi =require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  country: Joi.string().required(),
  price: Joi.number().required().min(0),
  image: Joi.string().allow("", null)
}).required()
});

// module.exports=listingSchema;  asa kelaya peksha 


const reviewSchema=Joi.object({
  review:Joi.object({
    rating:Joi.number().required(),
    comment:Joi.string().required()

  }).required()
})

module.exports={listingSchema,reviewSchema};

//etha asa kelya ver require pan asach karava laegl