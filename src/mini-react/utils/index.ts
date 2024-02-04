export function isString(str) {
  return typeof str === "string";
}
export function isNumber(str) {
  return typeof str === "number";
}

export function isEmpty(value) {
  return value === "" || value === null || value === undefined;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isClass(value: any): boolean {
  return (
    typeof value === "function" &&
    value.constructor &&
    value.constructor.toString().startsWith("class ")
  );
}

export function isReactClassComponent(type: any) {
  return type.prototype.isReactComponent
}

export function isFunction(obj) {
  return typeof obj === "function";
}
