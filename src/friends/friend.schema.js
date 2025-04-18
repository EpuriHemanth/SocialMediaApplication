import  mongoose, {Schema} from 'mongoose';

const friendRequestSchema = new Schema({
    sentBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    sentTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    status : {
        type : "String",
        enum : ["pending", "accepted", "rejected"],
        default : "pending"
    }
});

export const friendRequestModel = mongoose.model('friendRequests', friendRequestSchema);