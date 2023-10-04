
import { faker } from '@faker-js/faker';
import { Connection, Repository } from 'typeorm';
import { UsersEntity, UserType } from '../entities';
import 'colors';
import { get } from 'node-emoji';
import { genSalt, hash } from 'bcrypt';

export const fakeUsers = async (con: Connection, count: number = 50) => {
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  for (const _ of Array.from({ length: count })) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const birthOfDate = faker.date.past();
    const email = faker.internet.email();
    const type: UserType = faker.helpers.arrayElement(['admin', 'user']);
    const salt = await genSalt();
    const password = await hash('secret', salt);
    const u: Partial<UsersEntity> = new UsersEntity(
      firstName,
      lastName,
      email,
      password,
      salt,
      birthOfDate,
      type
    );
    await userRepo.save<Partial<UsersEntity>>(u);
  }
  const emoji = get('white_check_mark');
  console.log(emoji, `Created ${count} users`.magenta.bold, emoji);
};
