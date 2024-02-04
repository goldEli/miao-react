# miao-vue

## ReactDom

jsx => React.element => real dom

* patch string
* patch number
* patch Array
* patch Component

##### 判断是类组件还是函数组件

type.prototype.isReactComponent

##### children挂载

* 利用 createDocumentFragment 挂载并返回
* 虚拟节点，减少对真实dom的修改

## 更新 dom 属性

处理 props 中的 href style className 等

需要特殊处理 style className 事件

## fiber

老版本的react，通过递归去解析虚拟dom树，递归解析不能被打断，如果递归层级很深，耗时会很长。但是浏览器的机制是单线程的，js执行时，dom渲染，用户的输入 点击都需要等待js执行完成。

如果js执行时间很长，那么用户会感受到卡顿。

所以react16 提出 fiber，fiber 是一种数据结构，可以把它理解成链表，把render任务拆分成块，可以被中断，当有优先级更高的任务时，比如动画渲染，用户输入等，可以打断当前的render任务，让出主线程，先去处理这些优先级更高的任务，等空闲了，再回来继续之前的任务。

fiber 节点中有 sibling、return、child 三个属性，用来描述 dom 树的关系。stateNode 和 element 记录当前阶段的真实dom和虚拟dom

fiber 的节点解析先处理child，如果没有处理sibling，如果child和sibling都处理完了 return 回到上级继续处理

## 创建 rootFiber

当调用 ReactDOM.render 时，先创建 rootFiber

rootFiber 作为整个应用的根节点，通过 rootFiber 开始 fiber 树的构建。

属性包含 element 和 stateNode,

element 表示当前节点的虚拟dom，stateNode 表示当前节点的真实dom。

如果有儿子 创建 children

如果有兄弟 创建 sibling

return 执行父fiber

## 创建 nextUnitOfWork

用于存储当前处理的的filer节点

