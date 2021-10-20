(function (document, $) {
  var init = function () {
    bindEvent();
  };

  function bindEvent () {
    $('.nav-list').on('click', '.nav-item', handleNavItemClick);
    $('.nav-list').on('click', '.lk', handleNavItemClick);
  }

  function handleNavItemClick (e) {
    var className = this.className.trim();

    if (className.indexOf('nav-item') !== -1 || className === 'lk') {
      className === 'lk' ? setActive(this.parentNode) : setActive(this);
    }
  }

  function setActive (oLi) {
    $(oLi).siblings().removeClass('active');
    $(oLi).addClass('active');

    setDocTitle(oLi.textContent.trim());
  }

  function setDocTitle (title) {
    document.title = title;
  }
 
  init();
})(document, $);