# miao-vue

## 总结

##### 初始化

* 基于 jsx 返回的 React.element 创建 rootFiber, 并赋值为全局的 currentFiberRoot
* rootFiber 存入 unitOfWork
* loopWork 利用浏览器空闲 循环执行 performUnitOfWork
* performUnitOfWork 处理 unitOfWork
    * 处理 children 
        * 第一个儿子 childFiber
        * 下一个兄弟 siblingFiber 并存入上一个兄弟
    * 更新下一个 unitOfWork
        * 先找儿子
        * 没有儿子找兄弟
        * 没有兄弟找父 返回上级，直到顶层 unitOfWork 为 null
* 当 unitOfWork 为 null 说明所有子节点已经处理完毕，可以更新 dom 了，进入 commit 阶段

##### commit 阶段

* 递归处理 currentFiberRoot, 深度优先，从下到上appendChild, 避免多次挂载导致的重绘和回流

##### update 阶段

* commitRender 生成新的 fiber 树
* 对比新旧fiber树，基于增删查改为fiber打tag
* 在 commit 阶段基于tag 处理 增删查改

##### Component 组件

* Component 
    * 原型上挂载一个属性 区分是类组件还是函数组件
    * 原型上挂载一个setState 方法修改 this.state
    * 原型上挂载 updateProps 方法 更新 props
* updateComponent
    * 第一次 
        * 将instance 存入到 fiber 中
        * render
    * 第二次 (执行 this.setState 触发 commitRender)
        * 直接从 oldFiber 拿到 instance
        * updateProps
        * render

##### Function 组件

* 全局 currentFunctionFiber 存入当前 fiber
* 重置 currentFunctionFiber.hooks = [] 
* 重置 hooksIndex = 0
* 执行 函数组件 方法

useState

* currentFunctionFiber.alternate.hooks 拿到 oldHooks
* hooksIndex 拿到当前的 oldHook
* 初始化 hook
    * state: oldHook.state || initialState
    * queue: [] 因为可能会执行多次 将每次执行存到队列中
* oldHook 中拿到 queue, 循环执行修改 state
* 创建 setState 方法
    * 将新值 push 到 queue 中， 并触发 commitRender
* 将 hook 存入currentFunctionFiber.hooks
* 返回 hook.state 和 setState





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


##### 创建 nextUnitOfWork

用于存储当前处理的的filer节点

##### 创建 rootFiber

当调用 ReactDOM.render 时，先创建 rootFiber

```js
const rootFiber = {
    stateNode: container,
    element: {props: [element]}
    return: null,
    child: null,
    sibling: null
} 
```

##### 创建 workInProgress

```js
// 执行当前工作单元并设置下一个要执行的工作单元
function performUnitOfWork(workInProgress) {
    // 如果没有stateNode 创建
    // 如果有父亲和stateNode 挂载
}

performUnitOfWork(nextUnitOfWork)
```

##### 流程

利用浏览器api  requestIdleCallbac

当空闲时执行 performUnitOfWork, 执行完更新 nextUnitOfWork 用于下次执行

workLoop -> performUnitOfWork(nextUnitOfWork)

**performUnitOfWork**

* 创建 dom，如果有父亲则 append
* 创建fiber树，如果有儿子 处理 child 和 sibling
* 设置下一个执行单元
    * 找儿子
    * 没有儿子兄弟
    * 没有兄弟返回父亲，父亲没有兄弟返回父亲，直到根节点

rootFiber 
    - deep1-box
        - classComponent
            - class-component
                - this is a class Component
                - this value is: 
                    - 66

## render 和  commit 分离

performUnitOfWork 执行，会因为浏览器高优先级任务而暂停，导致页面渲染展示不完全，所以需要将 render 和 commit 分离

render 阶段负责创建 fiber 树，commit 阶段负责渲染 fiber 树

nextUnitOfWork 为 null 时，表示 fiber 树创建完毕，可以进行 commit 阶段

- commit
    - commit root
    - commit work
        - 深度优先，从叶子节点开始挂载，最后统一挂载到根节点，避免重绘的回流

## 更新

##### currentRoot 和 workInProgressRoot

currentRoot 表示当前的 fiber 树，workInProgressRoot 表示正在构建的 fiber 树

对比这两个树的差异，更新 dom

##### 为 fiber 打 tag

* Placement 添加
    * 如果需要添加的位置，原来的节点存在 则加到该节点前面
    * 不存在直接加到最后
* Update 更新属性
* Deletion 删除

数据改变，jsx 改变，触发render函数生成新的 workInProgressRoot

这个过程为fiber 打上 tag，收集需要删除的节点（deletions）


## React.component

* Component 有个属性用于区分类组件和函数组件
* Component 原型上挂载一个updateProps 方法用于更新 props
* this.setState 挂载到原型上，用于更新 state， 触发setState 执行 commitRender

updateClassComponent

* 第一次执行 将 Component 存到 fiber中

* 第二次执行 直接在 oldFiber 中拿到 Component 执行 updateProps 更新 props
* 执行 render

## Function Component

updateFunctionComponent

* fiber 存到全局 currentFiber
* 重置 全局 hookIndex = 0
* 清空 currentFiber.hooks = []
* 执行 render

setState

* 从 oldFiber 中拿到 oldHooks
* 基于 hookIndex 在 oldHooks 取到道歉的 oldHook
* 初始化 hook
    * state 如果oldHook存在，则取到 oldHook.state,反之取用户初始值
    * queue = []
* 循环执行hook.queue数组 为 state 赋值
* setState 方法 触发 push 到queue 中，因为可以能会执行多次，执行commitRender




