const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");    //automaticallyu adds a username and passport in db 

// ✅ handle ESM default export
const passportLocalMongoose = plm.default || plm;    //there was a problem of js ka version iss liye this is used >>>



const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  }
});

// ✅ plugin BEFORE model
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;