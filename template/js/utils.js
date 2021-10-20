/**
 * utils模块
 */
var utils = (function () {
  function copyClipboard (elem) {
    var oInput = null;
    if (
      elem instanceof HTMLInputElement || 
      elem instanceof HTMLTextAreaElement ||
      elem.contentEditable === true
    ) {
      elem.select();
    } else if (elem instanceof HTMLElement) {
      oInput = document.createElement('input');
      oInput.value = elem.textContent;
    } else if (typeof elem === 'string') {
      oInput = document.createElement('input');
      oInput.value = elem;
    } else {
      return false;
    }

    if (oInput) {
      oInput.style.position = 'fixed';
      oInput.style.opacity = '0';
      document.body.append(oInput);
      oInput.select();
    }

    document.execCommand('copy');

    if (oInput) {
      oInput.remove();
      oInput = null;
    }

    return true;
  }

  return {
    copyClipboard: copyClipboard
  };
})(document);