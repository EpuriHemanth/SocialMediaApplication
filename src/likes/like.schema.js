import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        
        ref : 'users',
        required : [true, 'user id is required']
    },
    likedOne : {
        type : mongoose.Schema.Types.ObjectId,
        refPath : 'types',
        required : [true, 'likedOne is required']
    },
    types : {
        type : String,
        enum : {values : ['comments', 'posts'], message : "{VALUE} is not permitted"},
        required : [true, 'you should specify which one you are liking comment or post']
    }
});

export const likesModel = mongoose.model('likes', likeSchema);