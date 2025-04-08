import { Module } from '@nestjs/common';
// PostsService 实现核心业务逻辑
import { PostsService } from './posts.service';
// PostsController 处理客户端请求
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// PostsEntity 定义了文章的数据结构
import { PostsEntity } from './entities/post.entity';

@Module({
  // 注册该模块需要使用的 TypeORM 实体
  // TypeOrmModule.forFeature() 方法使指定的实体在模块内可用
  // 这里注册了 PostsEntity，表示这个模块会操作文章数据表
  // 注册后可以在 PostsService 中通过 @InjectRepository() 注入该实体的 Repository
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  // 声明该模块包含的控制器
  // PostsController 将处理所有与文章相关的 HTTP 请求
  // 控制器中定义的路由将以 /post 为前缀（根据控制器装饰器 @Controller('post')）
  controllers: [PostsController],
  // 注册该模块的服务提供者
  // PostsService 包含所有与文章相关的业务逻辑
  // 通过依赖注入，可以在本模块的控制器和其他服务中使用
  providers: [PostsService],
})
export class PostsModule {}
