const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const usersSchema = new mongoose.Schema ({

    nickname: {
        type: String,
        require: true,
        unique: true,
    },

    password: {
        type: String,
        require: true,
    },

});

usersSchema.virtual("userId").get(function () {
    return this._id.toHexString();
});
usersSchema.set("toJSON", {
    virtuals: true,
});

usersSchema.plugin(AutoIncrement, {inc_field: 'userId'});

module.exports = mongoose.model("User", usersSchema);