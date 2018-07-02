# Change Log

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