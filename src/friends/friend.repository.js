import mongoose from "mongoose";
import { userModel } from "../users/user.schema.js";
import { friendRequestModel } from "./friend.schema.js";
import ApplicationError from "../middlewares/errorHandler.js";
import { ObjectId } from "mongodb";
export default class FriendRepository {

    async sendFriendRequest(friendId, senderId) {

        const user = await userModel.findById(friendId);
        if (!user) {
            return null;
        }
        try {
            const newFriendRequest = new friendRequestModel({
                sentBy: senderId,
                sentTo: friendId
            });

            const savedFriendRequest = await newFriendRequest.save();
            ////adding the sender to the receipent followers
            await userModel.updateOne(
                {
                    _id: new ObjectId(friendId)
                },
                {
                    $push : {friendRequests : savedFriendRequest._id}
                }
            );
            //adding recipent to the sender following
            await userModel.updateOne(
                {
                    _id : new ObjectId(senderId)
                },
                {
                    $push : {following : new ObjectId(friendId)},
                    $inc : {totalFollowing: 1}
                }
            )
          
            return "sent friend request successfully."
        }
        catch (err) {
            console.log(err);
            if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            }
            throw new ApplicationError(500, "something went wring in the database");
        }
    }

    async getPendingFriendRequests(userId) {
        try {
            const pendingRequests = await friendRequestModel.find({ sentTo: new ObjectId(userId), status : "pending" })
                .populate("sentBy", "name -_id")
                .select("-_id -sentTo")
            return pendingRequests;
        }
        catch (err) {
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database")
        }


    }

    async toogleFriend(friendId, userId) {
        
        try {
            const friendRequest = await friendRequestModel.findOne({ sentBy: new ObjectId(friendId), sentTo : new ObjectId(userId)});
            
            if (!friendRequest || friendRequest.status == 'pending') {
                return "The mentioned person is not friend to you."
            }
            if (friendRequest.status == 'accepted') {
                friendRequest.status = 'rejected';
                await friendRequest.save();
                await userModel.updateOne(
                    {
                        _id: new ObjectId(userId)
                    },
                    {
                        $pull: { friends: new ObjectId(friendId) },
                        $inc: { totalFriends: -1 }
                    }
                );
               
                return "you toogled the friendship status from accepted to rejected"
            }
            else if (friendRequest.status == 'rejected') {
                friendRequest.status = 'accepted';
                await friendRequest.save();
                await userModel.updateOne(
                    {
                        _id: new ObjectId(userId)
                    },
                    {
                        $push: { friends: new ObjectId(friendId)},
                        $inc: { totalFriends: 1 }
                    }
                );
                
                return "you toogled the friendship status from rejected to accepted"
            }
            else{
                return "you have to accept or reject the request first to toogle it"
            }
            
            
        }
        catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the database");
        }
    }

    async respondToRequest(friendId, userId, response){
        try{
            const friendRequest = await friendRequestModel.findOne({sentBy : new ObjectId(friendId), sentTo : new ObjectId(userId)});
            if(!friendRequest){
                return null;
            }
            if(friendRequest.status == 'pending'){

                if(response == 'accepted'){
                     //change the status of the request
                     friendRequest.status = 'accepted';
                     await friendRequest.save();
                    //add to the friends list and increment total friends
                    await userModel.updateOne(
                        {
                            _id : new ObjectId(userId)
                        },
                        {
                            $push : {friends : new ObjectId(friendId)},
                            $inc : {totalFriends : 1}
                        }
                    )
                    return "added to your friends list."
                }
                if(response == 'rejected'){
                   //change the status of the request
                    friendRequest.status = 'rejected';
                    await friendRequest.save();
                    
                    return "you rejected the friends request sent by user."
                }
            }
           else{
            return "you already responded to this request .If we want change please access toogling friend feature"
           }
            
        }
        catch(err){
            console.log(err);
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    async getUserFriends(userId){
        try{
           const [friends] = await userModel.aggregate([
                //get the user
                {
                    $match : {_id : new ObjectId(userId)}
                },
                
                //get the friends
                {
                    $lookup : {
                        from : 'users',
                        foreignField : '_id',
                        localField : 'friends',
                        as : "friendsInfo"
                    }
                },
                //project the required
                {
                    $project : {
                        _id : 0,
                        user : "$name",
                        userFriends : "$friendsInfo.name"
                    }
                }
                

            ]);

            return friends;

        } 
        catch(err){
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }
}  
