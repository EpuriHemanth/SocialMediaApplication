

import LikeModel from "./like.model.js";

import LikeRepository from "./likes.repository.js";

export default class LikeController {
    constructor() {
        this.likeRepository = new LikeRepository();
    }

    async toogleLike(req, res, next) {
        const userId = req.user.id;
        const { id } = req.params
        const { types } = req.body;
        try {
            const newLike = {
                userId,
                likedOne: id,
                types
            };
            if(types != 'comments' && types != 'posts'){
                return res.status(400).send("type should be either comments or posts")
            }
            const result = await this.likeRepository.toogleLike(newLike);
            if(result == null){
                return res.status(400).send(`There are no ${types} with the mentioned id`)
            }
            res.status(200).send(result)
        }
        catch (err) {
            next(err);
        }
    }

    async getLikes(req, res, next) {
        
        const id = req.params.id;
        const type = req.body.type;
        try{
            const result = await this.likeRepository.getLikes(id, type);
            if(type != 'comments' && type != 'posts'){
                return res.status(400).send("type should be either comments or posts")
            }
            if(!result){
                return res.status(400).send(`There is no ${type} with this id`);
            }
            res.status(200).send(result);
        }
        catch(err){
            next(err);
        }
    }
}