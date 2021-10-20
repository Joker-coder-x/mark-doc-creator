(function ($, utils) {
  var init = function () {
    insertCodeCopyBtns();
    bindEvent();
  };

  function insertCodeCopyBtns () {
    $('pre').append('<button class="copy-btn">复制</button>');
  }

  function bindEvent () {
    $(document).on('click', '.copy-btn', handleCopyBtnClick);
  }

  function handleCopyBtnClick () {
    console.log($(this).siblings('code')[0]);
   
    if (utils.copyClipboard($(this).siblings('code')[0])) {
      alert('复制成功')
    } else {
      alert('复制失败');
    }
  }

  init();
})($, utils);