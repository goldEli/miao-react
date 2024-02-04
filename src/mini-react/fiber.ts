import { isArray } from "./utils";

export interface Fiber {
  stateNode: null | HTMLElement; // 对应真实DOM节点
  element: null | any; // 对应React element 虚拟节点
  return?: null | Fiber; // 指向父级
  child?: null | Fiber; // 指向子级
  sibling?: null | Fiber; // 指向右边第一个兄弟
}

export const createFiber = (element, fatherFiber?: Fiber | null) => {
  const fiber: Fiber = {
    element,
    stateNode: null,
    return: fatherFiber,
  };
  const {
    props,
  } = element;
  
  const { children } = props ?? {}

  if (children) {
    if (isArray(children)) {
      const childFiber = createFiber(children[0], fiber);
      fiber.child = childFiber;
      let temp = childFiber;
      for (let i = 1; i < children.length; i++) {
        const child = children[i];
        const childFiber = createFiber(child, fiber);
        temp.sibling = childFiber;
        temp = childFiber;
      }
    } else {
      const childFiber = createFiber(children, fiber);
      fiber.child = childFiber;
    }
  }
  return fiber;
};
