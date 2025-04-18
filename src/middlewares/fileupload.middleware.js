import multer from "multer";
import path from 'path';
const storageConf = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, path.join(path.resolve(), 'public'))
    },
    filename : (req, file, cb) => {
        const fileName = Date.now()+"-"+file.originalname;
        cb(null, fileName);
    }
});

export const upload = multer({storage : storageConf});