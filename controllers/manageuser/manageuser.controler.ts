import { Connection, Repository } from 'typeorm';
import { ResponseToolkit, ServerRoute, Request } from '@hapi/hapi';
import { UsersEntity, UserType } from '../../db/entities/users.entity';
import { PostsEntity } from '../../db/entities/posts.entity';

export const manageuserController = (con: Connection): Array<ServerRoute> => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return [
    {
      method: 'PATCH',
      path: '/manageuser/roletouser/{id}/role/{role}',
      handler: async (
        { params: { id }, params: { role }, payload }: Request,
        h: ResponseToolkit,
        err?: Error
      ) => {
       
        const u = await userRepo.findOneBy({ id: id });
        if(role === "admin"){
         
          await userRepo
          .createQueryBuilder()
          .update(u)
          .set({ type: "admin"})
          .where("id = :id", { id: id })
          .execute();
        }else{
          await userRepo
          .createQueryBuilder()
          .update(u)
          .set({ type: "user"})
          .where("id = :id", { id: id })
          .execute();
        }
      
          const upd = await userRepo.findOneBy({ id: id });
          delete upd.password;
            delete upd.salt;
            return upd;
    },
    options: {
      auth: {
        strategy: 'jwt',
        scope: ['admin'] 
      },
    },
    },
    
  ];
};
