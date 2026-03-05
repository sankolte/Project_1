const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//now  we will set cloud configrations 

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'come_and_live',
    // format: async (req, file) => 'png', // supports promises as well
    allowedFormats:["png","jpg","jpeg"],
    public_id: (req, file) => 'computed-filename-using-request',
  },
});  //sidhar copy from documentation >> like pehele uper ka bhi copy kiya then cloudinary.config({})set kiya

//then export karr denge 

module.exports ={cloudinary,storage};
