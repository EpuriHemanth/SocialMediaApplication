
import { commentsModel } from "../comments/comments.schema.js";
import ApplicationError from "../middlewares/errorHandler.js";
import { postModel } from "../posts/post.schema.js";
import { likesModel } from "./like.schema.js";
import mongoose from 'mongoose';
import { ObjectId } from "mongodb";

export default class LikeRepository {
    //liking and disliking
    async toogleLike(likeData) {

        try {
            // if type is comment
            if (likeData.types == 'comments') {
                console.log(likeData)
                const reqComment = await commentsModel.findOne({ _id: new ObjectId(likeData.likedOne) });

                if (!reqComment) {
                    return null;
                }

                const likeIsPresent = await likesModel.findOne({
                    likedOne: new ObjectId(likeData.likedOne),
                    userId: new ObjectId(likeData.userId)
                });

                if (likeIsPresent) {
                    await likesModel.deleteOne({
                        _id: new ObjectId(likeIsPresent._id)
                    });

                    await commentsModel.updateOne(
                        { _id: new ObjectId(likeData.likedOne) },
                        {
                            $pull: { likes: likeIsPresent._id },
                            $inc: { totalLikes: -1 }
                        }
                    );

                    return "You removed the comment from your likes";
                } else {

                    const newLike = new likesModel(likeData);
                    const savedLike = await newLike.save();
                    await commentsModel.updateOne(
                        { _id: new ObjectId(likeData.likedOne) },
                        {
                            $push: { likes: new ObjectId(savedLike._id) },
                            $inc: { totalLikes: 1 }
                        }
                    );
                    return "you liked the comment";
                }
            }

            // if type is post
            else if (likeData.types == 'posts') {
                const reqPost = await postModel.findOne({ _id: new ObjectId(likeData.likedOne) });

                if (!reqPost) {
                    return null;
                }

                const likeIsPresent = await likesModel.findOne({
                    likedOne: new ObjectId(likeData.likedOne),
                    userId: new ObjectId(likeData.userId)
                });

                if (likeIsPresent) {
                    await likesModel.deleteOne({
                        _id: new ObjectId(likeIsPresent._id)
                    });

                    await postModel.updateOne(
                        { _id: new ObjectId(likeData.likedOne) },
                        {
                            $pull: { likes: likeIsPresent._id },
                            $inc: { totalLikes: -1 }
                        }
                    );

                    return "you removed the post from your likes";
                } else {
                    const newLike = new likesModel(likeData);
                    const savedLike = await newLike.save();
                    await postModel.updateOne(
                        { _id: new ObjectId(likeData.likedOne) },
                        {
                            $push: { likes: new ObjectId(savedLike._id) },
                            $inc: { totalLikes: 1 }
                        }
                    );

                }
            }


        } catch (err) {
            console.log(err);
            if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the database");
        }
    }
    //getting the likes of the post or comment
    async getLikes(id, type) {
        try {

            if (type == 'posts') {
                const post = await postModel.findById(id);
                if (!post) {
                    return null;
                }

                const likesOfPost = await postModel.aggregate([
                    //get the post
                    {
                        $match: { _id: new ObjectId(id) }
                    },
                    //get all the likes of this post
                    {
                        $lookup: {
                            from: 'likes',
                            foreignField: 'likedOne',
                            localField: '_id',
                            as: 'postLikes'
                        }
                    },
                    //get the user details who liked the post
                    {
                        $lookup: {
                            from: 'users',
                            foreignField: '_id',
                            localField: 'postLikes.userId',
                            as: 'userInfo'
                        }
                    },
                    //unwind the user info and post info
                    {
                        $unwind: '$userInfo'
                    },

                    //project the required details
                    {
                        $project: {
                            _id: 0,
                            postCaption: '$caption',
                            postImage: '$imageUrl',
                            likedBy: "$userInfo.name"
                        }
                    },
                    // Group by post details
                    {
                        $group: {
                            _id: {
                                postCaption: '$postCaption',
                                postImage: '$postImage'
                            },
                            likedBy: { $push: '$likedBy' }
                        }
                    },
                    // Format final output
                    {
                        $project: {
                            _id: 0,
                            postCaption: '$_id.postCaption',
                            postImage: '$_id.postImage',
                            likedBy: 1
                        }
                    }

                ])
                return likesOfPost;
            }
            if (type == 'comments') {
                const comment = await commentsModel.findById(id);

                if (!comment) {
                    return null;
                }
                const likesOfComment = await commentsModel.aggregate([
                    //match the comment
                    {
                        $match : {_id : new ObjectId(id)}
                    },
                    //get the comment likes
                    {
                        $lookup : {
                            from : 'likes',
                            localField : '_id',
                            foreignField : 'likedOne',
                            as : 'commentLikes'
                        }
                    },
                    //unwind the comment likes
                    {
                        $unwind : '$commentLikes'
                    },
                    //get the userInfo who liked it
                    {
                        $lookup : {
                            from : 'users',
                            localField : 'commentLikes.userId',
                            foreignField : '_id',
                            as : 'userInfo'
                        }
                    },
                    //unwind the userInfo
                    {
                        $unwind : '$userInfo'
                    },
                    //group the comment
                    {
                        $group : {
                            _id : {
                                comment : '$comment',
                                commentor : '$commentor'
                            },
                            likedBy : {
                                $push : '$userInfo.name'
                            }
                        }
                    },
                    //get the final op
                    {
                        $project : {
                            _id : 0,
                            comment : '$_id.comment',
                            commentor : '$_id.commentor',
                            likedBy : 1
                        }
                    }

                   
                ])

                return likesOfComment;
            }
        }
        catch (err) {
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database");
        }
    }
}
