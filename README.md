# miao-vue

## ReactDom

* patch string
* patch number
* patch Array
* patch Component

### 判断是类组件还是函数组件

type.prototype.isReactComponent

### children挂载

* 利用 createDocumentFragment 挂载并返回
* 虚拟节点，减少对真实dom的修改
