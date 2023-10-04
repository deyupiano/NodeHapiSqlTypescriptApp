import 'reflect-metadata'
import { Connection, createConnection } from 'typeorm'
import { UsersEntity, PostsEntity } from './entities';
import { fakeUsers, fakePosts } from './fakingData';
import 'colors';

export const initDb = async (): Promise<Connection> => {
    const entities = [UsersEntity, PostsEntity];
    //const fakeFuncs = [fakeUsers, fakePosts];
    const con = await createConnection({
         type:'sqlite',
         database:'./hapi.db',
         entities,
         logger: 'advanced-console',
         logging: ['error'],
    });
    await con.synchronize(true);
    entities.forEach(entity => console.log(`Created ${entity.name}`.blue));
    // console.log('Creating fake Data...'.yellow.bold);
    // for (const fun of fakeFuncs) await fun(con);
    return con;
}