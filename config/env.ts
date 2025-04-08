import * as fs from 'fs';
import * as path from 'path';

// 打包到 docker 后是没有NODE_ENV这个变量的，可能需要自己增加，这边先反着判断
const isProd = process.env.NODE_ENV === 'test';

function parseEnv() {
  // 定义了两个环境文件路径：测试环境文件(.env.test)和生产环境文件(.env.prod)
  const localEnv = path.resolve('.env.test');
  const prodEnv = path.resolve('.env.prod');

  // 检查至少有一个环境配置文件存在
  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('缺少环境变量文件');
  }

  // 如果是生产环境且生产环境文件存在 → 使用生产环境文件,否则 → 使用测试环境文件
  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  // 返回包含文件路径的对象,立即执行函数并导出结果
  return { path: filePath };
}

export default parseEnv();
