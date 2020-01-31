# Datagent

[![npm version](https://img.shields.io/npm/v/datagent.svg)](https://www.npmjs.com/package/datagent)
[![NPM downloads](http://img.shields.io/npm/dm/datagent.svg)](https://www.npmjs.com/package/datagent)
[![build status](https://travis-ci.org/lpreterite/datagent.svg?branch=master)](https://travis-ci.org/lpreterite/datagent)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flpreterite%2Fdatagent.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Flpreterite%2Fdatagent?ref=badge_shield)

`Datagent`是一个用于模块化管理前端请求的工具，提供数据格式化、多服务源切换、语义化数据定义等功能。在 React,Vue,Angular 等现代 JavaScript 框架下，UI 显示均以数据驱动为中心，服务端提供的数据不是所有场合都能符合 UI 所需的结构。格式化数据、转义数据的代码往往不可避免的写在UI组件、业务逻辑代码或是页面等各个地方，导致冗余代码、逻辑复杂又难以维护等问题。面对这类情况可使用`Datagent`解决这类问题，不单只能统一调取后端服务和格式化从服务端获得的数据，定义一些处理后还能用于所有场景，让你更方便同步UI状态。

![datagent-run](./docs/assets/images/datagent-run.png)

> 你可以马上尝试在`codepen`上的[例子](https://codepen.io/packy1980/pen/OEpNWW/)。

## 安装

```sh
npm install -S datagent
//or
yarn add datagent
```

目前正式版本为`1.x`，下面是安装`2.0`版本尝尝鲜。

```sh
npm install -S datagent@next
// or
yarn add datagent@next
```

## 文档

- [介绍](https://lpreterite.github.io/datagent/#/?id=介绍)
  - [什么是 datagent.js](https://lpreterite.github.io/datagent/#/?id=什么是-datagentjs)
  - [开始](https://lpreterite.github.io/datagent/#/?id=开始)
  - [管理你的服务](https://lpreterite.github.io/datagent/#/?id=管理你的服务)
  - [定义数据字段](https://lpreterite.github.io/datagent/#/?id=定义数据字段)
  - [数据处理](https://lpreterite.github.io/datagent/#/?id=数据处理)
  - [统一调用](https://lpreterite.github.io/datagent/#/?id=统一调用)
- [深入了解](https://lpreterite.github.io/datagent/#/?id=深入了解)
  - [远端与axios](https://lpreterite.github.io/datagent/#/?id=远端与axios)
  - [自定义字段类型](https://lpreterite.github.io/datagent/#/?id=自定义字段类型)
  - [方法与钩子](https://lpreterite.github.io/datagent/#/?id=方法与钩子)
  - [自定义钩子](https://lpreterite.github.io/datagent/#/?id=自定义钩子)
- [迁移](https://lpreterite.github.io/datagent/#/?id=迁移)
  - [从 1.x 迁移](https://lpreterite.github.io/datagent/#/?id=从-1x-迁移)

## License

Datagent是根据[MIT协议](/LICENSE)的开源软件

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Flpreterite%2Fdatagent.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Flpreterite%2Fdatagent?ref=badge_large)
