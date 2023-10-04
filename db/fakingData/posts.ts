import { faker } from '@faker-js/faker';
import { Connection, Repository } from 'typeorm';
import { PostsEntity, UsersEntity } from '../entities';
import 'colors';
import { get } from 'node-emoji';

export const fakePosts = async (con: Connection, count: number = 50) => {
  const postRepo: Repository<PostsEntity> = con.getRepository(PostsEntity);
  const userRepo: Repository<UsersEntity> = con.getRepository(UsersEntity);
  const users: Array<UsersEntity> = await userRepo.find(); // pass { take: number }
  for (const user of users) {
    const shouldWeCreate: boolean = faker.helpers.arrayElement([false, true]);
    if (shouldWeCreate) {
      const title = faker.person.jobTitle();
      const body = faker.lorem.paragraphs();
      const title2 = faker.person.jobTitle();
      const body2 = faker.lorem.paragraphs();
      const p: Partial<PostsEntity> = new PostsEntity(title, body, user.id);
      p.user = user;
      const p2: Partial<PostsEntity> = new PostsEntity(title2, body2, user.id);
      p2.user = user;
      await postRepo.save<Partial<PostsEntity>>(p);
      await postRepo.save<Partial<PostsEntity>>(p2);
    }
  }
  const emoji = get('white_check_mark');
  console.log(emoji, `Created ${count} posts`.magenta.bold, emoji);
};
