import {
  isArray,
  isEmpty,
  isFunction,
  isNumber,
  isReactClassComponent,
  isString,
} from "./utils";

function renderDom(element) {
  console.log("renderDom", element);
  let dom: any = null;
  // not element
  if (!element && element !== 0) return dom;
  // string
  if (isString(element)) {
    return patchString(element);
  }
  // number
  if (isNumber(element)) {
    return patchNumber(element);
  }
  // array
  if (isArray(element)) {
    return patchArray(element);
  }
  // element type string
  if (isString(element.type)) {
    return patchHTMLElement(element);
  }
  // element type function
  // element type class
  if (isFunction(element.type)) {
    return patchComponent(element);
  }

  return dom;
}

function patchComponent(element) {
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

  const dom = renderDom(ele);

  if (children) {
    appendChildren(children, dom);
  }

  return dom;
}

function patchHTMLElement(element) {
  const {
    type,
    props: { children },
  } = element;
  const dom = document.createElement(type);

  appendChildren(children, dom);

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
function patchArray(element) {
  // return element.map((el) => {
  //   return renderDom(el);
  // });
  const dom = document.createDocumentFragment();
  appendChildren(element, dom);
  return dom;
}
function appendChildren(children, parentDom) {
  if (isArray(children)) {
    children.forEach((el) => {
      const dom = renderDom(el);
      if (!isEmpty(dom)) {
        parentDom.appendChild(dom);
      }
    });
  } else {
    const dom = renderDom(children);
    if (!isEmpty(dom)) {
      parentDom.appendChild(dom);
    }
  }
}
function render(element: any, container: HTMLDivElement) {
  const dom = renderDom(element);
  console.log("element", element);
  console.log("dom", dom);
  container.appendChild(dom);
}
const ReactDOM = {
  render,
};

export default ReactDOM;
