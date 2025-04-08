import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

// 自定义接口
interface ExceptionResponse {
  message?: string | string[];
  error?: string;
  [key: string]: any; // 其他可能的属性
}

// 指定这个过滤器只捕获 HttpException 类型的异常
@Catch(HttpException)
// 实现了 NestJS 的 ExceptionFilter 接口
export class HttpExceptionFilter implements ExceptionFilter {
  // 这是必须实现的方法，用于处理捕获的异常
  // exception：捕获到的异常对象
  // host：提供访问请求和响应对象的能力
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取请求上下文
    const ctx = host.switchToHttp();
    // 获取请求上下文中的 response对象
    // 明确指出返回类型为Response,避免发生any类型警告
    const response: Response = ctx.getResponse();
    // 获取异常状态码
    const status = exception.getStatus();
    // 获取异常中的响应信息（可能是字符串或对象）
    const exceptionResponse = exception.getResponse() as
      | string
      | ExceptionResponse;
    // 构建错误消息
    let validMessage = '';

    // 检查异常响应是否是对象 如果是对象，提取 message 字段  如果 message 是数组，取第一个元素
    if (typeof exceptionResponse === 'object') {
      validMessage =
        typeof exceptionResponse.message === 'string'
          ? exceptionResponse.message
          : (exceptionResponse.message?.[0] ?? '');
    }
    // 默认消息处理 如果异常有 message 否则根据状态码生成默认消息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    // 构建统一响应格式
    // data：空对象（可扩展）
    // message：错误消息
    // code：自定义错误码（这里固定为 -1）
    const errorResponse = {
      code: -1,
      message: validMessage || message,
      data: {},
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
