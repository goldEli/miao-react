import { Fiber, createFiber } from "./fiber";
import { updateAttributes } from "./updateAttributes";
import {
  isArray,
  isBoolean,
  isEmpty,
  isFunction,
  isNumber,
  isReactClassComponent,
  isString,
} from "./utils";

function renderDom(element, fiber?: Fiber | null) {
  // console.log("renderDom", element);
  // const { element } = fiber;
  let dom: any = null;
  // not element
  if (!element && element !== 0) {
    dom = null;
  } else if (isBoolean(element)) {
    dom = document.createDocumentFragment();
  } else if (isString(element)) {
    // string
    dom = patchString(element);
  } else if (isNumber(element)) {
    // number
    dom = patchNumber(element);
  } else if (isString(element.type)) {
    // element type string
    dom = patchHTMLElement(element);
  } else if (isFunction(element.type)) {
    // element type function
    // element type class
    dom = patchComponent(element, fiber);
  }

  const { props } = element ?? {};
  const { children } = props ?? {};
  if (children) {
    if (isArray(children)) {
      let temp = fiber?.child;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childDom = renderDom(child, temp);
        temp = temp?.sibling;
        if (!isEmpty(childDom)) {
          dom.appendChild(childDom);
        }
      }
    } else {
      dom.appendChild(renderDom(children, fiber?.child));
    }
  }

  if (fiber) {
    fiber.stateNode = dom;
  }

  return dom;
}

function patchComponent(element, fiber) {
  const {
    type,
    props: { children },
  } = element;
  let ele;
  if (isReactClassComponent(type)) {
    const { props, type: Comp } = element;
    const instance = new Comp(props);
    ele = instance.render();
  } else {
    const { props, type: fn } = element;
    ele = fn(props);
  }

  const dom = renderDom(ele, fiber);

  // if (children) {
  //   appendChildren(children, dom);
  // }

  return dom;
}

function patchHTMLElement(element) {
  const {
    type,
    props: { children, ...attributes },
  } = element;
  const dom = document.createElement(type);

  updateAttributes(dom, attributes);
  // appendChildren(children, dom);

  return dom;
}

function patchNumber(element) {
  const dom = document.createTextNode(String(element));
  return dom;
}
function patchString(element) {
  const dom = document.createTextNode(element);
  return dom;
}
function patchArray(element, fiber) {
  // return element.map((el) => {
  //   return renderDom(el);
  // });
  const dom = document.createDocumentFragment();
  // appendChildren(element, dom, fiber);
  return dom;
}
// function appendChildren(children, parentDom) {
//   if (isArray(children)) {
//     children.forEach((el) => {
//       const dom = renderDom(el);
//       if (!isEmpty(dom)) {
//         parentDom.appendChild(dom);
//       }
//     });
//   } else {
//     const dom = renderDom(children);
//     if (!isEmpty(dom)) {
//       parentDom.appendChild(dom);
//     }
//   }
// }

let nextUnitOfWork: Fiber | null = null;

function render(element: any, container: HTMLDivElement) {
  const rootFiber = createFiber(element, null);
  const dom = renderDom(element, rootFiber);
  nextUnitOfWork = rootFiber;

  console.log("element", element);
  console.log("dom", dom);
  console.log("rootFiber", rootFiber);
  rootFiber.stateNode = dom;
  container.appendChild(dom);
}
const ReactDOM = {
  render,
};

export default ReactDOM;
