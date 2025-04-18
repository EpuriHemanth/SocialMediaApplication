import mongoose, {Schema} from "mongoose";

const commentsSchema = new Schema({
    comment : {
        type : String,
        req : [true, 'comment is required']
    },
    commentor: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'posts'

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
export const commentsModel = mongoose.model('comments', commentsSchema);