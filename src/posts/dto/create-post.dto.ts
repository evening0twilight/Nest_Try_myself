import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// 处理文章创建时的输入数据
export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题不能为空' })
  readonly title: string;

  @ApiPropertyOptional({ description: '文章作者' })
  @IsNotEmpty({ message: '文章作者不能为空' })
  readonly author: string;

  @ApiPropertyOptional({ description: '文章内容' })
  @IsNotEmpty({ message: '文章内容不能为空' })
  readonly content: string;
  // DTO 的 cover_url 对应实体的 thumb_url（需要转换）

  @ApiPropertyOptional({ description: '文章封面图片URL' })
  readonly cover_url: string;
}

// readonly是表示该属性不可重新赋值（TypeScript 编译时检查） 不决定字段是否可选
// @IsOptional() 表示验证时允许字段缺失/undefined 通常与 TypeScript 的 ? 一起使用
// @IsOptional()
// readonly cover_url?: string;

// ApiProperty和ApiPropertyOptional的区别:
// 1.默认值不同ApiProperty为true, ApiPropertyOptional为false
// 2.是否必填ApiProperty为必填, ApiPropertyOptional为非必填
