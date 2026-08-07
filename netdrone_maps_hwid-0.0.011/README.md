adcui.json 配置说明

```
{
  "type": "project", //工程类型 默认project
  "origin": "http://10.40.58.179:8080", //ows域名
  "javascriptLibraryDependencies": []  //引入第三方jslib
}
```

## 主要工具介绍

| 工具名                  | 作用                                       |
| ----------------------- | ------------------------------------------ |
| vue v3                  | data binding                               |
| vue-router v4           | vue 路由                                   |
| vue cli v5              | 本地发开、打包发布                         |
| axios                   | 处理 get/post                              |
| mockjs                  | 制造模拟数据                               |
| nodemon                 | 修改 node 代码不需要重启监听，一直运行就好 |

## 功能介绍

### 开发

1. koa 模拟数据接口，从而使前后端分离。
2. sourcemap，很好定位。
3. eslint，stylelint 代码规则。
4. 热替换。
5. nodemon 让改 node 代码变得更加顺滑。
6. less/stylus

### 发布

1. 将 css 代码分为两份，一份为基础代码，即上线后几乎不变，另一份为迭代代码，从而充分利用浏览器缓存。
2. 发布以后的所有文件会加 md5 后缀，从而充分利用浏览器缓存。
3. tree shaking。
4. dynamic import，代码不会打包到一个 js 文件里，而会分成 n 个按需加载 js。

## 使用方法

### 开发

`npm run dev`

### 发布

`npm run build`
