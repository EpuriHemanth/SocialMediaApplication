import CommentModel from "./comments.model.js";
import CommentRepository from "./comments.repository.js";

export default class CommentController{
    constructor(){
        this.commentRepository = new CommentRepository();
    }

    async addComment(req, res, next){
        const {postId} = req.params;
        const userId = req.user.id;
        const {comment} = req.body;
        const newComment = new CommentModel(comment, userId, postId);
        try{
            const result = await this.commentRepository.addComment(newComment);
            if(!result){
                return res.status(400).send("No post found")
            }
            res.status(201).send(result)
        }
        catch(err){
            next(err);
        }
    }

    async getPostComments(req, res, next){
        const {postId} = req.params;
        try{
            const comments = await this.commentRepository.getPostComments(postId);
            if(!comments){
                return res.status(400).send("There is no post of this id")
            }
            res.status(200).send(comments);
        }
        catch(err){
            next(err);
        }
    }
    async updateComment(req, res, next){
        const {commentId} = req.params;
        const {comment} = req.body;
        const userId = req.user.id;
        try{
            const result = await this.commentRepository.updateComment(commentId,userId, comment);
            if(result == null){
                return res.status(400).send("There is no comment with this id");
            }
            else if(!result){
                return res.status(403).send("You are can not update this comment.Only post owner or commentor can update the comment");
            }
            else{
                res.status(200).send(result);
            }
        }
        catch(err){
            next(err);
        }
    }

    async deleteComment(req, res, next){
        const commentId = req.params.commentId;
        const userId = req.user.id;
        try{
            const result = await this.commentRepository.deleteComment(commentId,userId);
            if(result == null){
                return res.status(400).send("There is no comment with this id");
            }
            else if(!result){
                return res.status(403).send("You can not delete this comment.Only post owner or commentor can delete the comment");
            }
            else{
                res.status(200).send(result);
            }
            
        }
        catch(err){
            next(err);
        }
    }

    
}