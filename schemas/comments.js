const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const commentsSchema = new mongoose.Schema ({

    content: {
        type: String,
        require: true,
    },

    nickname: {
        type: String,
        require: true,
    },

    postId: {
        type: String,
        require: true,
    }
});

commentsSchema.plugin(AutoIncrement, {inc_field: 'commentId'});

module.exports = mongoose.model("Comment", commentsSchema);