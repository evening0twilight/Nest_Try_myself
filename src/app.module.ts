import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { PostsEntity } from './posts/entities/post.entity';
// envConfig 的作用是为 NestJS 的 ConfigModule 提供环境配置文件路径
import envConfig from '../config/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    // 数据库模块 (TypeOrmModule)的配置，通过异步方式注入数据库连接信息
    TypeOrmModule.forRootAsync({
      // 导入ConfigModule以使用ConfigService
      imports: [ConfigModule],
      // 注入ConfigService来获取环境变量
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [PostsEntity], // 数据表实体，synchronize为true时，自动创建表，生产环境建议关闭
        host: configService.get('DB_HOST'), // 数据库主机
        port: configService.get<number>('DB_PORT'), // 数据库端口号
        username: configService.get('DB_USER'), // 数据库用户名
        password: configService.get('DB_PASSWD'), // 数据库密码
        database: configService.get('DB_DATABASE'), // 数据库名称
        timezone: '+08:00', // 时区设置
        synchronize: true, // 是否自动同步数据库结构，生产环境建议关闭
      }),
    }),
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
