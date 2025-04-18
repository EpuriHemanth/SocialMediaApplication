export default class PostModel{
    constructor(userId,caption, imageUrl, createdOn){
        this.userId = userId;
        this.caption = caption;
        this.imageUrl = imageUrl;
        this.createdOn = createdOn;
    }
}