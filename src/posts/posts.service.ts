import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
import { PostsEntity } from './entities/post.entity';

// 定义文章列表查询的返回类型
export interface PostsRo {
  list: PostsEntity[];
  count: number;
  totalPages: number;
  currentPage: number;
}

@Injectable()
export class PostsService {
  constructor(
    // 注入 TypeORM 的 PostsEntity 仓库，用于数据库操作
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  // 创建文章
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    // 检查是否有标题
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    // 检查标题是否已存在
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    // 保存后的文章实体
    return await this.postsRepository.save(post);
  }

  // 获取文章列表(分页获取文章列表)
  // page: 当前页码(默认1) pageSize: 每页数量(默认10)
  async findAll(page: number = 1, pageSize: number = 10): Promise<PostsRo> {
    const [posts, totalCount] = await this.postsRepository.findAndCount({
      // skip: 计算跳过的记录数
      skip: (page - 1) * pageSize, // 分页偏移量
      // take: 每页获取的记录数
      take: pageSize, // 每页显示的记录数
      // 排序: 按创建时间降序排列
      order: { createdAt: 'DESC' },
    });

    return {
      list: posts,
      count: totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // 计算总页数
      currentPage: page, // 当前页
    };
  }

  // 获取指定文章(根据ID获取单篇文章)
  async findById(id: number): Promise<PostsEntity> {
    // 因为findById可能会返回空 并且方法的返回类型被定义为 Promise<PostsEntity>，所以需要判断 防止null的情况发生
    const postsID = await this.postsRepository.findOne({ where: { id } });
    if (!postsID) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return postsID;
  }

  // 更新文章(更新指定ID的文章)
  async updateById(id: number, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    // 检查文章是否存在
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    // 合并现有文章和更新内容 保存更新
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章(删除指定ID的文章)
  async remove(id: number) {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    // 先检查文章是否存在
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    // 删除后的文章实体
    return await this.postsRepository.remove(existPost);
  }
}
