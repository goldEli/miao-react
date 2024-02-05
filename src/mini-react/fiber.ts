import { renderDom } from "./react-dom";
import { isArray, isFunction, isReactClassComponent } from "./utils";

export type Fiber = {
  stateNode?: null | HTMLElement; // 对应真实DOM节点
  element: null | any; // 对应React element 虚拟节点
  return?: null | Fiber; // 指向父级
  child?: null | Fiber; // 指向子级
  sibling?: null | Fiber; // 指向右边第一个兄弟
  type?: any;
};

let nextUnitOfWork: Fiber | null | undefined = null;
// 当前的fiber树
let currentRoot: Fiber | null | undefined = null;
// 正在构建的fiber树
let workInProgressRoot: Fiber | null | undefined = null;
export const createRootFiber = (element, container) => {
  workInProgressRoot = {
    element: { props: { children: [element] } },
    stateNode: container,
    return: null,
    sibling: null,
  };

  nextUnitOfWork = workInProgressRoot;

  requestIdleCallback(workLoop);

  console.log("currentRoot", workInProgressRoot);

  return workInProgressRoot;
};

function commitRoot() {
  if (
    workInProgressRoot &&
    workInProgressRoot.child &&
    workInProgressRoot.child
  ) {
    commitWork(workInProgressRoot.child);
  }
}

function commitWork(fiber: Fiber) {
  if (fiber.child) {
    commitWork(fiber.child);
  }

  console.log("fiber", fiber);

  if (fiber?.stateNode) {
    fiber.return?.stateNode?.appendChild(fiber?.stateNode);
  }

  if (fiber.sibling) {
    commitWork(fiber.sibling);
  }
}

function performUnitOfWork(workInProgress: Fiber) {
  /**
   * 构建fiber 创建 dom
   * */
  // 如果没有 stateNode 创建
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = renderDom(
      workInProgress.element,
      workInProgress
    );

    // 如果有stateNode 找到父亲 append
    // if (workInProgress.stateNode) {
    //   let parentFiber = workInProgress.return;
    //   while (!!parentFiber && !parentFiber?.stateNode) {
    //     parentFiber = parentFiber?.return;
    //   }
    //   if (parentFiber?.stateNode) {
    //     parentFiber.stateNode.appendChild(workInProgress.stateNode);
    //   }
    // }
  }

  /**
   * 构建 fiber 树
   * */
  const { element } = workInProgress;
  const { props, type } = element ?? {};
  let { children } = props ?? {};

  if (isFunction(type)) {
    let jsx;
    if (isReactClassComponent(type)) {
      const component = new type(props);
      jsx = component.render();
    } else {
      jsx = type(props);
    }
    children = [jsx];
  }

  if (children) {
    children = isArray(children) ? children : [children];

    let index = 0;
    let prevSibling: Fiber | null = null;

    while (index < children.length) {
      const newFiber: Fiber = {
        element: children[index],
        return: workInProgress,
        stateNode: null,
      };

      if (index === 0) {
        workInProgress.child = newFiber;
      } else {
        if (prevSibling) {
          prevSibling.sibling = newFiber;
        }
      }

      prevSibling = newFiber;

      ++index;
    }
  }

  /**
   * 设置下一个工作单元
   * */
  // 儿子
  if (workInProgress.child) {
    nextUnitOfWork = workInProgress.child;
  } else {
    let nextFiber: Fiber | null | undefined = workInProgress;
    while (nextFiber) {
      // 如果有兄弟
      if (nextFiber.sibling) {
        nextUnitOfWork = nextFiber.sibling;
        return;
      } else {
        // 返回上一级
        nextFiber = nextFiber.return;
      }
    }

    // 返回到顶层
    if (!nextFiber) {
      nextUnitOfWork = null;
    }
  }
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 循环执行工作单元任务
    performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && workInProgressRoot) {
    commitRoot();

    currentRoot = workInProgressRoot;
    workInProgressRoot = null;
  }

  requestIdleCallback(workLoop);
}
