import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface ResponseFormat<T = any> {
  data: T;
  code: number;
  msg: string;
}

// 表示这个类可以被 NestJS 依赖注入系统管理
@Injectable()
// 实现了 NestJS 的拦截器接口
export class TransformInterceptor implements NestInterceptor {
  // 用于拦截请求和响应
  // context：提供访问请求上下文的能力
  // next：代表下一个处理程序（通常是控制器方法）
  // 返回一个 Observable（RxJS 的可观察对象）
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat> {
    // next.handle()：调用下一个处理程序并获取其返回的 Observable
    // .pipe(map(...))：使用 RxJS 的 map 操作符转换响应数据
    return next.handle().pipe(
      map((data: unknown) => ({
        code: 0,
        msg: '请求成功',
        data,
      })),
    );
  }
}
