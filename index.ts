"use strict"
import * as Hapi from '@hapi/hapi'
import { ResponseToolkit, Request } from 'hapi'
import 'colors'
import { get } from "node-emoji"
import { userController, postsController, authController , manageuserController} from './controllers';
import { Connection } from 'typeorm';
import { validateJWT, validateBasic, validateRole } from './auth';
import {initDb} from './db'
import { ServerRoute } from '@hapi/hapi'

const init = async () => {
    const server: Hapi.Server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
    // server.route({
    //     method:'GET',
    //     path:'/',
    //     handler:(request: Request, h: ResponseToolkit, err?: Error) =>{
    //        return {msg: 'Hello world'}
    //     }
    // })

    // await initDb().then(()=> console.log(get('dvd'),`DB Init -> done!` , get('dvd')));
    // await server.start().then();
    // console.log(
    //     get("rocket"),
    //     `Server running on ${server.info.uri}`.green, 
    //     get("rocket")
    // );
    await server.register(require('hapi-auth-jwt2'));
    await server.register(require('@hapi/basic'));
    const con: Connection = await initDb();
    server.auth.strategy('simple', 'basic', { validate: validateBasic(con) });
    server.auth.strategy('jwt', 'jwt', {
    key: 'getMeFromEnvFile', // Never Share your secret key
    validate: validateJWT(con), // validate function defined above
  });
  //server.auth.strategy('role', 'role', { validate: validateRole(con) });
  console.log(get('dvd'), 'DB init -> Done!'.green, get('dvd'));
  server.route([
    ...userController(con),
    ...postsController(con),
    ...authController(con),
    ...manageuserController(con),
  ] as Array<ServerRoute>);
  await server.start();
  console.log(
    get('rocket'),
    `Server running on ${server.info.uri}`.green,
    get('rocket')
  );
}

process.on('unhandledRejection', (err)=>{
   console.error(err)
   process.exit(1);
})
init();
