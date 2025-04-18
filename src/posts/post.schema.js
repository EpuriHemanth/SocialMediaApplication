import mongoose, { Schema } from 'mongoose';

const postSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    caption: {
        type: String
    },
    imageUrl: {
        type: mongoose.Schema.Types.String
    },
    createdOn: {
        type: mongoose.Schema.Types.Date
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'comments'
        }
    ],
    totalComments : {
        type : Number,
        default : 0
    },

    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'likes'
        }
    ],
    totalLikes : {
        type : Number,
        default : 0
    }
});

export const postModel = mongoose.model("posts", postSchema);