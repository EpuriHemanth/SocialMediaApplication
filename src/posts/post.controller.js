import PostModel from "./post.model.js";
import PostRepository from "./post.repository.js";

export default class PostController{
    constructor(){
        this.postRepository = new PostRepository()
    }

    async createPost(req, res, next){
        const caption = req.body.caption;
        const imageUrl = req.file.filename;
        const userId = req.user.id;
        try{
            const newPost = new PostModel(userId, caption, imageUrl, new Date().toISOString());
            await this.postRepository.createPost(newPost);
            res.status(201).send("created post successfully")
        }
        catch(err){
            next(err);
        }
    }

    async getAllposts(req, res, next){
        try{
          const posts = await this.postRepository.getAllPosts();
          res.status(200).send(posts);  
        }
        catch(err){
            next(err);
        }
    }
    async getPostById(req, res, next){
        const postId = req.params.postId;
        try{
            const post = await this.postRepository.getPostById(postId);
            if(!post){
                return res.status(400).send("Threre is no post with this id")
            }
            res.status(200).send(post);
        }
        catch(err){
            next(err);
        }
    }
    async getPostsOfUser(req, res, next){
        const id = req.user.id;
        try{
            const userPosts = await this.postRepository.getPostsOfUser(id);
            res.status(200).send(userPosts);
        }
        catch(err){
            next(err);
        }
    }
    async deletePost(req, res, next){
        const postId = req.params.postId;
        const userId = req.user.id;
        console.log(userId);
        try{
            const result = await this.postRepository.deletePost(postId, userId);
            if(result == null){
                return res.status(400).send('There is no post with this id')
            }
            if(result == false){
                return res.status(403).send("You can not delete other users posts.")
            }
            res.status(200).send("deleted successfully");
        }
        catch(err){
            next(err);
        }
    }
    async updatePost(req, res, next){
        const {postId} = req.params
        const {caption} = req.body;
        const imageUrl = req.file.filename;
       
        try{
            const updatedPost = await this.postRepository.updatePost(postId, caption, imageUrl, req.user.id);
           
            if(!updatedPost){
                return res.status(400).send("There are no posts with this id or there is no permission for you to delete this post")
            }
            res.status(200).send(updatedPost);
        }
        catch(err){
            next(err);
        }
    }
  
}