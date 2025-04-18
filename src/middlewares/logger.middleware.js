import fs from 'fs';
import path from 'path';

const fsPromise = fs.promises;

const log = async (logData) => {
    try{
        await fsPromise.appendFile(path.join(path.resolve(), 'logs.text'), logData)
    }
    catch(err){
        console.log(err);
    }
}

export const loggerMiddleware = async (req, res, next) => {
    const logData = `\n Time Stamp : ${new Date()} - url : ${JSON.stringify(req.url)}- request body : ${JSON.stringify(req.body)}`;
    try{
        await log(logData);
        next();
    }
    catch(err){
        console.log(err)
    }

}