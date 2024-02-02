export function isString(str) {
  return typeof str === "string";
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
