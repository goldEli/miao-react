import { getEventName, isEventName } from "./utils";

export function updateAttributes(dom: HTMLDivElement, attributes) {
  for (const key in attributes) {
    const value = attributes[key];
    if (key === "className") {
      dom.setAttribute("class", value);
      return;
    }

    if (key === "style") {
      for (let styleKey in value) {
        dom.style[styleKey] = value[styleKey];
      }
      return;
    }

    if (isEventName(key)) {
      const eventName = getEventName(key);
      console.log("eventName", eventName);
      dom.addEventListener(eventName, value);
      return;
    }

    setAttribute(dom, key, value);
  }
}

function setAttribute(dom, key, value) {
  dom.setAttribute(key, value);
}
