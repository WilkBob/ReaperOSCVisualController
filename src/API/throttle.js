export default function throttle(func, delay) {
  let timeoutId;
  let lastArgs;
  let lastThis;
  let lastCallTime = 0;

  const invokeFunc = (time) => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastCallTime = time;
    func.apply(thisArg, args);
  };

  const leadingEdge = (time) => {
    lastCallTime = time;
    timeoutId = setTimeout(trailingEdge, delay);
    invokeFunc(time);
  };

  const trailingEdge = () => {
    timeoutId = undefined;
    if (lastArgs) {
      invokeFunc(Date.now());
    }
  };

  const throttled = function (...args) {
    const now = Date.now();
    const isCalledRecently = now - lastCallTime < delay;

    lastArgs = args;
    lastThis = this;

    if (!isCalledRecently) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      leadingEdge(now);
    } else if (!timeoutId) {
      timeoutId = setTimeout(trailingEdge, delay);
    }

    return undefined; // Consistent with lodash's throttle
  };

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    lastCallTime = 0;
    lastArgs = lastThis = timeoutId = undefined;
  };

  return throttled;
}
