// Get the current URL
const currentURL = window.location.href;
var mainContent = document.querySelector(".mainContent");
if (currentURL.split('#')) {
  const parts = currentURL.split('#');
  const fragmentIdentifier = parts[1];
  if (document.getElementById(`p${fragmentIdentifier}`) && document.getElementById(`p${fragmentIdentifier}`) != "1") {
    var targetElement = document.getElementById(`p${fragmentIdentifier}`);
    var paddingTop = parseInt(getComputedStyle(mainContent).getPropertyValue('padding-top'), 10) + 40;
    mainContent.scrollTop = targetElement.offsetTop - mainContent.offsetTop - paddingTop;

    var menus = document.querySelectorAll('.link');
    menus.forEach((element) => {
      if(element.classList.contains('activeLink')){
        element.classList.remove('activeLink')
      }
    });
    var activeMenu = document.getElementById(`menu${fragmentIdentifier}`);
    activeMenu.classList.add('activeLink');

  }else{
    const paddingTop = parseInt(getComputedStyle(mainContent).getPropertyValue('padding-top'), 10)+ 40;
    window.scrollTo({
        top: -paddingTop,
        behavior: 'smooth' // This makes the scrolling smooth and animated
    });
  }
}else{
  const paddingTop = parseInt(getComputedStyle(mainContent).getPropertyValue('padding-top'), 10)+ 40;
  window.scrollTo({
      top: -paddingTop,
      behavior: 'smooth' // This makes the scrolling smooth and animated
  });
}

var activeMenu = document.getElementById(`${menu}`);
activeMenu.scrollIntoView({ behavior: 'smooth', block: 'center' });

function navigateTo(what, id) {
    window.location.hash = id;
    var targetElement = document.getElementById(`p${id}`);
    if(targetElement != "1" && targetElement){
      var paddingTop = parseInt(getComputedStyle(mainContent).getPropertyValue('padding-top'), 10)+ 40;
      mainContent.scrollTop = targetElement.offsetTop - mainContent.offsetTop - paddingTop;
    }else{
      const paddingTop = parseInt(getComputedStyle(mainContent).getPropertyValue('padding-top'), 10)+ 40;
      window.scrollTo({
          top: -paddingTop,
          behavior: 'smooth' // This makes the scrolling smooth and animated
      });
    }

    var menus = document.querySelectorAll('.link');
    menus.forEach((element) => {
      if(element.classList.contains('activeLink')){
        element.classList.remove('activeLink')
      }
    });
    var activeMenu = document.getElementById(`menu${id}`);
    activeMenu.classList.add('activeLink');
}
