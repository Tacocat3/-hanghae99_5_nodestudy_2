const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)

const articlesSchema = new mongoose.Schema ({

    subject: {
        type: String,
        require: true,
    },

    content: {
        type: String,
        require: true,
    },

    nickname: {
        type: String,
        require: true,
    },

    category: {
        type: String,
    },
});

articlesSchema.plugin(AutoIncrement, {inc_field: 'postId'});

module.exports = mongoose.model("Article", articlesSchema);