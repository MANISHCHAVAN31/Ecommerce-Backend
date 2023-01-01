const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

/* 
NOTE:
Virtuals are document properties that you can get and set but that do not get persisted to MongoDB. 
The getters are useful for formatting or combining fields, 
while setters are useful for de-composing a single value into multiple values for storage.
*/

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true,
        },

        lastname: {
            type: String,
            maxlength: 32,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        encry_password: {
            type: String,
            trim: true,
            required: true,
        },

        userinfo: {
            type: String,
            trim: true,
        },

        /*
      WE ARE STORING HASH AND PASSWORD IN DATABASE.
      WHEN ONE USER REGISTER, THE PASSWORD WE WILL ENCRYPT WITH A PARTICULAR SALT.
      THAT SALT WE WILL STORE ALONG WITH PASSWORD IN DB.
      
      SO, WHEN USER WILL LOGIN AGAIN, WE CAN HASH THAT PASSWORD WITH SALT TO CHECK 
      THE STORED PASSWORD IS SAME AS HASHED PASSWORD.
      */

        salt: String,

        role: {
            type: Number,
            default: 0,
        },

        purchases: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

// virtuals
userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.encry_password = this.securePassword(password);
    })
    .get(function () {
        return this._password;
    });

// methods
userSchema.methods = {
    // method 1 - encrypt password during save
    securePassword: function (plainPassword) {
        if (!plainPassword) {
            return ""; // password is not null field, if we send it empty, it will give error
        }

        try {
            return crypto
                .createHmac("sha256", this.salt)
                .update(plainPassword)
                .digest("hex");
        } catch (error) {
            return "";
        }
    },

    // method 2 - authenticate password
    authenticate: function (plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password;
    },
};

module.exports = mongoose.model("user", userSchema);
