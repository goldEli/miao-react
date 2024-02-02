import { isArray, isFunction, isReactClassComponent, isString } from "./utils";

function renderDom(element) {
  console.log("renderDom", element);
  let dom: any = null;
  // not element
  if (!element) return dom;
  // string
  if (isString(element)) {
    dom = document.createTextNode(element);
    return dom;
  }
  // number
  // array
  if (isArray(element)) {
    return element.map((el) => {
      return renderDom(el);
    });
  }
  // element type string
  if (isString(element.type)) {
    dom = document.createElement(element.type);

    patchChildren(element?.props?.children, dom);

    return dom;
  }
  // element type function
  // element type class
  if (isFunction(element.type)) {
    let ele;
    if (isReactClassComponent(element.type)) {
      const instance = new element.type(element.props);
      ele = instance.render();
    } else {
      ele = element.type(element.props);
    }
    const dom = renderDom(ele);

    return dom;
  }

  return dom;
}
function patchChildren(children, dom) {
  const childrenDom = renderDom(children);

  if (childrenDom === null) return;

  if (isArray(childrenDom)) {
    childrenDom.forEach((el) => {
      if (el !== null) {
        dom.appendChild(el);
      }
    });
  } else {
    dom.appendChild(childrenDom);
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
