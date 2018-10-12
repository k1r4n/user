import mongoose from 'mongoose';
import Bluebird from 'bluebird';

import config from '../config';
import { getClient } from './winston';

Promise = Bluebird as any || Promise;

(<any>mongoose).Promise = Promise;
const connection: any = {};
export default async function createDatabase(id: number, dbName: string): Promise<any> {
    const logger = getClient();
    return new Promise(async (resolve, reject) => {
        connection[`mongoose${id}`] = await mongoose.createConnection(`${config.mongoUrl}/${dbName === '' ? `user${id}` : dbName}`, {useNewUrlParser: true});
        // .then(() => {
        //     logger.info(`MongoDB Database ${dbName === '' ? `user${id}` : dbName} successfully`);
        // }).catch((error: any) => {
        //     logger.error(`${error.message} \nExiting!!!`);
        //     reject(error.message);
        // });
        // console.log(Object.keys(connection[`mongoose${id}`]));

        const dbSchema = new mongoose.Schema({
            id: Number,
            name: String,
        }, { collection: 'dbList' });
        const userSchema = new mongoose.Schema({
            id: Number,
            name: String,
            username: String,
            email: String,
            avatar: String,
            address: {
                street: String,
                suite: String,
                city: String,
                zipcode: String,
                geo: {
                    lat: String,
                    lang: String,
                },
            },
            phone: String,
            website: String,
            compant: {
                name: String,
                catchPhrase: String,
                bs: String,
            },
            posts: [{
                userId: Number,
                id: Number,
                title: String,
                body: String,
                comments: [{
                    postId: Number,
                    id: Number,
                    name: String,
                    email: String,
                    body: String,
                }],
            }],
            default: String,
        }, { collection: `user${id}` });

        const client = await connection[`mongoose${id}`].model((dbName !== '') ? 'dbList' : `User${id}`, (dbName !== '') ? dbSchema : userSchema);
        resolve(client);
    });
}