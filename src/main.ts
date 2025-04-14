import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor } from './core//interceptor/transform/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // 设置swagger文档
  const config = new DocumentBuilder()
    // 设置文档标题
    .setTitle('管理后台')
    // 设置文档描述
    .setDescription('管理后台接口文档')
    // 设置API版本
    .setVersion('1.0')
    // 添加Bearer Token认证支持
    .addBearerAuth()
    // 构建配置
    .build();
  // 根据应用实例和配置生成Swagger规范文档  会自动扫描所有路由和控制器
  const document = SwaggerModule.createDocument(app, config);
  // 将生成的文档挂载到 /docs 路径 访问方式：http://localhost:3000/docs
  SwaggerModule.setup('docs', app, document);

  // 注册全局管道
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
