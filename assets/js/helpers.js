function restArguments(func, startIndex) {
  // https://underscorejs.org/docs/modules/restArguments.html
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
      rest = Array(length),
      index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
}

// https://underscorejs.org/docs/modules/now.html
const now =
  Date.now ||
  function () {
    return new Date().getTime();
  };

// https://underscorejs.org/docs/modules/debounce.html
https: function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;

  var later = function () {
    var passed = now() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      if (!timeout) args = context = null;
    }
  };

  var debounced = restArguments(function (_args) {
    context = this;
    args = _args;
    previous = now();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}

// https://www.seanmcp.com/articles/listen-for-class-change-in-javascript/
function onClassChange(node, callback) {
  let lastClassString = node.classList.toString();

  const mutationObserver = new MutationObserver((mutationList) => {
    for (const item of mutationList) {
      if (item.attributeName === "class") {
        const classString = node.classList.toString();
        if (classString !== lastClassString) {
          callback(mutationObserver);
          lastClassString = classString;
          break;
        }
      }
    }
  });

  mutationObserver.observe(node, { attributes: true });

  return mutationObserver;
}
