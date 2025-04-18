import mongoose from "mongoose";
import { commentsModel } from "./comments.schema.js";
import ApplicationError from "../middlewares/errorHandler.js";
import { ObjectId } from "mongodb";
import { postModel } from "../posts/post.schema.js";
export default class CommentRepository {

    async addComment(commentData) {
        try {
            const post = await postModel.findById(commentData.postId);
            if (!post) {
                return null
            }
            //adding the comment 
            const newComment = new commentsModel(commentData);
            await newComment.save();
            //incrementing the comments of the post
            await postModel.updateOne(
                {
                    _id: new ObjectId(commentData.postId)
                },
                {
                    $inc: { totalComments: 1 },
                    $push: { comments: newComment._id }
                }
            );
            return "comment created successfully"
        }
        catch (err) {
            console.log(err);
            if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    async getPostComments(postId) {
        try {
            const comments = await postModel.aggregate([
                // Step 1: Match the post
                {
                    $match: { _id: new ObjectId(postId) }
                },
                // Step 2: Lookup comments on this post
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "postId",
                        as: "postComments"
                    }
                },
                // Step 3: Unwind comments to get each comment separately
                {
                    $unwind: "$postComments"
                },
                // Step 4: Lookup user info for each commentor
                {
                    $lookup: {
                        from: "users",
                        localField: "postComments.commentor",
                        foreignField: "_id",
                        as: "commentorInfo"
                    }
                },
                // Step 5: Unwind the user info (each comment has one user)
                {
                    $unwind: "$commentorInfo"
                },
                // Step 6: Project the final structure
                {
                    $project: {
                        _id: 0,
                        postCaption: "$caption",
                        comment: "$postComments.comment",
                        commentedBy: "$commentorInfo.name"
                    }
                },
                // Optional: Group by post caption to get all comments together
                {
                    $group: {
                        _id: "$postCaption",
                        comments: {
                            $push: {
                                comment: "$comment",
                                commentedBy: "$commentedBy"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        postCaption: "$_id",
                        comments: 1
                    }
                }


            ])
            return comments;
        }
        catch (err) {
            console.log(err)
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    async updateComment(commentId, userId, comment) {
        try {
            const isCommentPresent = await commentsModel.findOne({ _id: new ObjectId(commentId) });
            if (!isCommentPresent) {
                return null;
            }
            const postOwner = await postModel.findOne(
                {
                    _id: new ObjectId(isCommentPresent.postId),
                    userId: new ObjectId(userId)
                }
            );
            if (isCommentPresent.commentor != userId && !postOwner) {
                return false;
            }
            isCommentPresent.comment = comment;
            await isCommentPresent.save();
            return "commented updated successfully"
        }
        catch (err) {
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    async deleteComment(commentId, userId) {
        try {
            const isCommentPresent = await commentsModel.findOne({ _id: new ObjectId(commentId) });
            if (!isCommentPresent) {
                return null;
            }
            const postOwner = await postModel.findOne(
                {
                    _id: new ObjectId(isCommentPresent.postId),
                    userId: new ObjectId(userId)
                }
            );
            if (isCommentPresent.commentor != userId && !postOwner) {
                return false;
            }
            await commentsModel.deleteOne({ _id: new ObjectId(commentId) });

            await postModel.updateOne(
                {
                    _id: new ObjectId(isCommentPresent.postId)
                },
                {
                    $pull: { comments: new ObjectId(commentId) },
                    $inc: { totalComments: -1 }
                }
            )
            return "commented deleted successfully"
        }
        catch (err) {
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }



}