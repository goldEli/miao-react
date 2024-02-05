import { Fiber, createRootFiber } from "./fiber";
import { updateAttributes } from "./updateAttributes";
import {
  isBoolean,
  isFunction,
  isNumber,
  isString,
} from "./utils";

export function renderDom(element, workInProgress) {
  // console.log("renderDom", element);
  // const { element } = fiber;
  let dom: any = null;
  // not element
  if (!element && element !== 0) {
    dom = null;
    workInProgress.type = ''
  } else if (isBoolean(element)) {
    dom = document.createDocumentFragment();
    workInProgress.type = 'boolean'
  } else if (isFunction(element.type)) {
    dom = document.createDocumentFragment();
    workInProgress.type = 'function'
  } else if (isString(element)) {
    // string
    dom = patchString(element);
    workInProgress.type = 'string'
  } else if (isNumber(element)) {
    // number
    dom = patchNumber(element);
    workInProgress.type = 'number'
  } else if (isString(element.type)) {
    // element type string
    dom = patchHTMLElement(element);
    workInProgress.type = 'element'
  }
 

  return dom;
}

// function patchComponent(element, fiber) {
//   const {
//     type,
//     props: { children },
//   } = element;
//   let ele;
//   if (isReactClassComponent(type)) {
//     const { props, type: Comp } = element;
//     const instance = new Comp(props);
//     ele = instance.render();
//   } else {
//     const { props, type: fn } = element;
//     ele = fn(props);
//   }

//   const dom = renderDom(ele, fiber);

//   return dom;
// }

function patchHTMLElement(element) {
  const {
    type,
    props: { children, ...attributes },
  } = element;
  const dom = document.createElement(type);

  updateAttributes(dom, attributes);

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

function render(element: any, container: HTMLDivElement) {
  createRootFiber(element, container);

  // const dom = renderDom(element, rootFiber.child);

  // console.log("element", element);
  // console.log("rootFiber", rootFiber);
  // console.log("dom", dom);
  // container.appendChild(dom);
}
const ReactDOM = {
  render,
};

export default ReactDOM;
