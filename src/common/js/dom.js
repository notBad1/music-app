/**
 * DOM相关操作通用代码
 */

// 添加Class
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

// 判断是否有Class
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}
