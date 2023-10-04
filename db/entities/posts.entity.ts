import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { sharedProp } from './sharedProp.entity';
  import { UsersEntity } from './users.entity';
  
  @Entity({ name: 'posts' })
  export class PostsEntity extends sharedProp {
    constructor(title: string, body: string, userId: number) {
      super();
      this.title = title;
      this.body = body;
      this.userId = userId;
    }
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ type: 'text' })
    body: string;
  
    @Column({ nullable: false, name: 'user_id' })
    userId: number;
  
    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: UsersEntity;
  }
  