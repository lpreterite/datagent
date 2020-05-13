# Change Log

## 2.0.0-beta.1

- 增加`agent`类提供统一处理数据对象方法的调用，提供`before`,`after`,`error`事件做额外处理
- 数据对象(`Model`)移除`field`设置
- 数据对象(`Model`)的钩子设置支持自定义执行顺序，移除`before`和`after`执行函数列表
- 数据对象(`Model`)调用方法不再支持动态增加钩子函数
- `format`,`filter`钩子函数必须设置数据模型(`Schema`)，不再支持默认使用数据对象(`Model`)的`field`设置
- 构建环境从`webpack`改用`rollup`，项目使用[`sao-esmodule-mold`](https://github.com/lpreterite/sao-esmodule-mold)模板基于[`sao`](https://github.com/saojs/sao)生成
- 更新所有代码编码方式，移除class改用function方式定义
- 更新说明文档和API文档，提供可访问地址：https://lpreterite.github.io/datagent/
- 更新测试内容

## 1.1.4

- 构建工具从webpack改为rollup
- 为了让webpack优先价值esm模式代码，package.json已移除browser设置。

## 1.1.3

- 修复当`id`等于`null`时会作为id加至`POST`请求链接上的问题

## 1.1.2

- 修复在`save:before`的钩子下处理传入参数时，把最后参数作为处理的数据对象进行格式化。

## 1.1.1

- 添加`getField`的钩子处理方法
- 修复format函数在处理null值时会转换的问题

## 1.1.0

- find与destroy方法改为接受params参数（不再只是id）。
- fieldSet默认值default支持使用函数：`{ type: Date, default: Date.now }`。
- 修改format规则：当字段值与默认值一致时，不作任何处理直接输出原有的值。
- 文档加上`mapSendHook`与`mapReceiveHook`例子。

## 1.0.3

- 修复判断对象是否为新对象的方法逻辑，当`id`为`0`,`null`,`undefined`都判断为新对象。

## 1.0.2

- 修复数据模型方法调用时设置的after hooks会在数据模型定义的after hooks前被调用的问题 #3

## 1.0.1

- 修复`DataModel.prototype.delete`调用卡死问题(#2)
- 调试项目命令行去掉`--debug`参数(#1)
- 说明文档添加简单使用例子，更新引用钩子方法的使用