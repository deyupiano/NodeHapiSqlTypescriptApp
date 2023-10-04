import { Request, ResponseToolkit } from '@hapi/hapi';
import { Connection, Repository } from 'typeorm';
import { UsersEntity } from './db/entities';
import { compare, hash, genSalt } from 'bcrypt';
import { number } from '@hapi/joi';

export const validateJWT = (con: Connection) => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return async (
    { id } : Partial<UsersEntity>,
    request: Request,
    h: ResponseToolkit
  ): Promise<{ isValid: boolean; credentials?: undefined; } | { isValid: boolean; credentials: { user: UsersEntity; }; }> => {
    const user: UsersEntity = await userRepo.findOneBy({ id: id });
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: { user } };
  };
};

export const validateBasic = (con: Connection) => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return async (
    request: Request,
    username: string,
    password: string,
    h: ResponseToolkit
  ) => {
    const user: UsersEntity = await userRepo.findOneBy({ email: username });
    if (!user) {
      return { credentials: null, isValid: false };
    }
    const isValid = (await hash(password, user.salt)) === user.password;
    delete user.password;
    delete user.salt;
    // credentials - a credentials object passed back to the application in `request.auth.credentials`.
    return { isValid: isValid, credentials: user };
  };
};


export const validateRole = (con: Connection) => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  return async (
    request: Request,
    username: string,
    password: string,
    h: ResponseToolkit
  ) => {
    const user: UsersEntity = await userRepo.findOneBy({ email: username });
    if (!user) {
      return { credentials: null, isValid: false };
    }
    const isAdmin = user.type == "admin"? true: false;
    return { isValid: isAdmin};
  };
};
