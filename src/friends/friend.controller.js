import FriendRepository from "./friend.repository.js";

export default class FriendController{
    constructor(){
        this.friendRepository = new FriendRepository();
    }

    async sendFriendRequest(req, res, next){
        const friendId = req.params.id;
        const senderId = req.user.id;
        if(friendId == senderId){
            return res.status(400).send("you can not send friend request to your self");
        }
        try{
            const result = await this.friendRepository.sendFriendRequest(friendId, senderId);
            if(!result){
                return res.status(400).send("There is no user with the id")
            }
            res.status(200).send(result)
        }
        catch(err){
            next(err);
        }
    }

    async getPendingRequests(req, res, next){
        const userId = req.user.id;
        try{
            const allRequests = await this.friendRepository.getPendingFriendRequests(userId);
            res.status(200).send(allRequests);
        }
        catch(err){
            next(err);
        }
    }
    async toogleFriendShip(req, res, next){
        const friendId = req.params.friendId;
        const userId = req.user.id;
        try{
            const result = await this.friendRepository.toogleFriend(friendId, userId)
            res.status(200).send(result)
        }
        catch(err){
            next(err);
        }
    }
    async respondToRequest(req, res, next){
        const userId = req.user.id;
        const friendId = req.params.friendId;
        const {response} = req.body;
        try{
            const result = await this.friendRepository.respondToRequest(friendId, userId, response);
            if(!result){
                return res.status(400).send("There are no friend requests from the person")
            }
            res.status(200).send(result)
        }
        catch(err){
            next(err);
        }
    }

    async getFriendsOfUser(req, res, next){
        const userId = req.params.userId;
        try{
            const result = await this.friendRepository.getUserFriends(userId);
            if(!result){
                return res.status(400).send("Invalid userId")
            }
            res.status(200).send(result);
        }
        catch(err){
            next(err);
        }
    }
}