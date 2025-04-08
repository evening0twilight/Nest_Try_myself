import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 表示这个类对应数据库中的 posts 表
@Entity('posts')
export class PostsEntity {
  // 标记为主列，并且自动生成值
  @PrimaryGeneratedColumn()
  id: number;

  // 文章标题  设置最大长度为50个字符  数据库会创建为 VARCHAR(50) 类型
  @Column({ length: 50 })
  title: string;

  // 文章作者  设置最大长度为50个字符
  @Column({ length: 50 })
  author: string;

  // 文章正文内容  使用 text 类型，适合存储长文本  没有长度限制
  @Column({ type: 'text' })
  content: string;

  // 文章缩略图URL  默认值为空字符串  未指定长度，TypeORM 会使用默认长度
  @Column({ default: '' })
  thumb_url: string;

  // 记录创建时间  使用数据库的 timestamp 类型  默认值为当前时间（CURRENT_TIMESTAMP）
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // 记录最后更新时间  每次数据更新时自动设置为当前时间  MySQL特有的 ON UPDATE CURRENT_TIMESTAMP 语法
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
