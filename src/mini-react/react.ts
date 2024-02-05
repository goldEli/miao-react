import { commitRender, getCurrentFunctionFiber, getHookIndex } from "./fiber";

export class Component {
  props: any;
  state: any;
  constructor(props) {
    this.props = props;
  }
}

// @ts-ignore
Component.prototype.isReactComponent = true;

// @ts-ignore
Component.prototype.setState = function (newState) {
  this.state = {
    ...this.state,
    ...newState,
  };
  commitRender();
};

// @ts-ignore
Component.prototype._UpdateProps = function (props) {
  this.props = props;
};

// export function useState(initial) {
//   const currentFunctionFiber = getCurrentFunctionFiber();
//   const hookIndex = getHookIndex();
//   // 取当前执行的函数组件之前的 hook
//   const oldHook = currentFunctionFiber?.alternate?.hooks?.[hookIndex];

//   // oldHook存在，取之前的值，否则取现在的值
//   const hook: any = {
//     state: oldHook ? oldHook.state : initial,
//     queue: [], // 一次函数执行过程中可能调用多次 setState，将其放进队列一并执行
//   };

//   const actions: any = oldHook ? oldHook.queue : [];
//   actions.forEach((action) => {
//     hook.state = action(hook.state);
//   });

//   const setState = (action: any) => {
//     if (typeof action === "function") {
//       hook.queue.push(action);
//     } else {
//       hook.queue.push(() => {
//         return action;
//       });
//     }
//     commitRender();
//   };
//   currentFunctionFiber.hooks.push(hook);
//   return [hook.state, setState];
// }

export function useState(initialValue) {
  const currentFunctionFiber = getCurrentFunctionFiber();
  const hookIndex = getHookIndex();

  // 去之前的hook
  const oldHook = currentFunctionFiber.alternate?.hooks?.[hookIndex];

  // oldHook 存在取之前的值  不存在用 初始化的值
  const hook: any = {
    state: oldHook ? oldHook.state : initialValue,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (newState) => {
    hook.queue.push(() => {
      return newState;
    });
    commitRender();
  };

  currentFunctionFiber.hooks.push(hook);

  return [hook.state, setState];
}
