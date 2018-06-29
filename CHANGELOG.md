# Change Log

## 1.0.3

- 修复判断对象是否为新对象的方法逻辑，当`id`为`0`,`null`,`undefined`都判断为新对象。

## 1.0.2

- 修复数据模型方法调用时设置的after hooks会在数据模型定义的after hooks前被调用的问题 #3

## 1.0.1

- 修复`DataModel.prototype.delete`调用卡死问题(#2)
- 调试项目命令行去掉`--debug`参数(#1)
- 说明文档添加简单使用例子，更新引用钩子方法的使用