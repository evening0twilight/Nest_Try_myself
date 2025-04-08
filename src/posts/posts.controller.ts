// 编写控制器文件，控制器也是接口地址的入口，接口传参，路由规则都是在这里
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService, PostsRo } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('文章')
// 定义基础路由路径为 /post
@Controller('posts')
// 注入 PostsService 用于业务逻辑处理
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 路由: POST /post/create
  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建文章' })
  @Post('/create')
  // 使用 CreatePostDto 接收请求体，自动验证数据格式
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post);
  }

  // 路径: GET /post/findAll
  /**
   * 获取所有文章
   */
  @ApiOperation({ summary: '获取所有文章' })
  @Get('/findAll')
  // 参数: 接收查询参数(如分页、过滤条件)
  async findAll(@Query() query): Promise<PostsRo> {
    // 返回值: 返回 PostsRo 类型(可能是包含分页信息的响应对象)
    return await this.postsService.findAll(query);
  }

  // 路径: GET /post/:id (如 /post/123)
  /**
   * 获取指定文章
   * @param id
   */
  @ApiOperation({ summary: '获取指定文章' })
  @Get(':id')
  // 从路径参数获取文章ID
  async findById(@Param('id') id) {
    return await this.postsService.findById(id);
  }

  // 路径: PUT /post/:id
  /**
   * 更新文章
   * @param id
   * @param post
   */
  @ApiOperation({ summary: '更新文章' })
  @Put(':id')
  // 参数: 从路径获取ID  从请求体获取更新内容
  async update(@Param('id') id, @Body() post) {
    return await this.postsService.updateById(id, post);
  }

  // 路径: DELETE /post/id
  /**
   * 删除
   * @param id
   */
  @ApiOperation({ summary: '删除文章' })
  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.postsService.remove(id);
  }
}
