
let settingState = document.getElementById('settings');
let notification = document.getElementById('noti-nav');
let accountsState = document.getElementById('accounts');
let overlay = document.getElementById('opt-overlay');
let accountIcon = document.getElementById('accountIcon');
let mSpinner =  document.getElementById('MenuSpinner');
let profileImage = document.getElementById('profileImage');
let advOptions = document.getElementById('advOptions');
let brandName = document.querySelector('header h1 a');
styleUpdate();

window.addEventListener('DOMContentLoaded', function() {
    var link = document.querySelector('.link');

    function updateLinkContent() {
    if (window.innerWidth < 350) {
        brandName.innerHTML = 'F';
        brandName.style.fontSize = 'large';
        brandName.style.border = '3px solid';
        brandName.style.borderRadius = '50px';
        brandName.style.padding = '3px 9px';
        } else {
        brandName.innerHTML = 'Fastreed';
        brandName.style.fontSize = 'inherit';
        brandName.style.border = 'none';
        brandName.style.borderRadius = '0px';
        brandName.style.padding = '0';
        }
    }
    updateLinkContent();
    window.addEventListener('resize', updateLinkContent);
});


function styleUpdate() {
    // checking cookie mode
    let colorMode;
    let cookieExist = (document.cookie.match(/^(?:.*;)?\s*colorMode\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
    if (cookieExist != null) {
        colorMode = str_obj(document.cookie).colorMode;
    }else{
        document.cookie = "colorMode=dark; max-age=31104000; path=/";
        colorMode = 'true';
    }

    // setting mode with respect to cookie
    if (colorMode == 'dark') {
        enableDarkMode();
    }else if(colorMode == 'light'){
        enableLightMode();
    }
    $('#RefreshIcon, #refHard, #refStyle, #HPicon').css('color', 'green');
    $('#notifications::-webkit-scrollbar-thumb').css('background-color', 'transparent');
}


function toggleMode(){
    var toggleMode = document.querySelector('#toggleMode');
    // Check if it contains any <style> elements
    if (toggleMode.classList.contains('fa-toggle-off')) {
        // Enable Dark Mode
        enableDarkMode();
        toggleMode.classList.remove('fa-toggle-off');
        toggleMode.classList.add('fa-toggle-on');
        // location.reload();
    } else {
        // Enable light mode
        toggleMode.classList.remove('fa-toggle-on');
        toggleMode.classList.add('fa-toggle-off');
        enableLightMode();
        // location.reload();
    }
}

function enableDarkMode() {
    document.cookie = "colorMode=dark; max-age=31104000; path=/";
    $('body').css('background', '#212529');
    $('header h1 a').css('color', '#dadada');
    $('header').css('border-bottom', '1px solid rgb(218, 218, 218)');
    $('header .nav').css('color', '#dadada');
    // alerts
    $('.alertContainer .alertBox').css('background', '#353740');
    $('.alertContainer .alertBox').css('box-shadow',' black 0px 0px 40px 3px');
    $('.alertContainer .alertBox').css('color', 'white');
    // dropdowns
    $('.dropdowns').css('background', '#353740');
    $('.dropdowns').css('box-shadow',' black 0px 0px 40px 3px');
    $('.dropdowns .menus').css('background', '#202123');
    $('.dropdowns .menu-head').css('background', '#202123');
    $('.dropdowns .profile-info').css('background', '#202123');
    $('.dropdowns .menus').css('color', '#d5d3d3');
    $('.dropdowns .profile-bottom .menus').css('background', 'transparent');
    $('.dropdowns .menu-head').css('color', '#d5d3d3');
    $('.dropdowns .profile-info').css('color', '#d5d3d3');
    $('.dropdowns .notifications .noti-parts').css('color', '#d5d3d3');
    // dropdowns

    $('.homePageFilter .navs').css('color', '#d5d3d3');
    $('.f-card .meta .date').css('color', '#d5d3d3');
    $('.f-card .meta i').css('color', '#d5d3d3');
    $('.f-card .meta .cat').css('color', '#d5d3d3');
    $('.f-card .meta .cat a').css('color', '#d5d3d3');


    $('.user-details .user-name').css('color', '#d5d3d3');
    $('.user-details .profileActions').css('color', '#d5d3d3');
    $('.userContentMenus .menus').css('color', '#d5d3d3');
    $('.reviewStoriesDiv .buttons').css('color', '#d5d3d3');
    $('.title').css('color', '#d5d3d3');
    $('.infoDiv').css('color', '#d5d3d3');
    $('#editDetailsButton').css('color', '#d5d3d3');
    $('label').css('color', '#d5d3d3');
    $('.form-control').css('background', 'transparent');
    $('.form-select').css('background', 'transparent');
    $('.form-select').css('color', '#d5d3d3');
    $('.form-control').css('color', '#d5d3d3');
    $('.expandable').css('color', '#d5d3d3');
    $('.homepageLoadMore span').css('color', '#d5d3d3');
    $('.noUpload').css('color', '#d5d3d3');
    $('#shuffleStoryType').css('color', '#d5d3d3');
    // defaults
    $('.webstory .title').css('color', 'white');
    var toggleMode = document.querySelector('#toggleMode');
    toggleMode.classList.remove('fa-toggle-off');
    toggleMode.classList.add('fa-toggle-on');
    $('#toggleMode').css('color','#8f8fed');

}

function enableLightMode(){
    document.cookie = "colorMode=light; max-age=31104000; path=/";
    // head
    $('body').css('background', 'white');
    $('header h1 a').css('color', '#202123');
    $('header').css('border-bottom', '1px solid rgb(53, 55, 64)');
    $('header .nav').css('color', '#202123');
    // head

    // alerts
    $('.alertContainer .alertBox').css('background', 'white');
    $('.alertContainer .alertBox').css('box-shadow',' grey 0px 0px 40px 7px');
    $('.alertContainer .alertBox').css('color', '#202123');

    // dropdowns
    $('.dropdowns').css('background', 'white');
    $('.dropdowns').css('box-shadow',' grey 0px 0px 40px 7px');
    $('.dropdowns .menus').css('background', '#d5d3d3');
    $('.dropdowns .profile-bottom .menus').css('background', 'transparent');
    $('.dropdowns .menu-head').css('background', '#d5d3d3');
    $('.dropdowns .profile-info').css('background', '#d5d3d3');
    $('.dropdowns .menus').css('color', '#202123');
    $('.dropdowns .menu-head').css('color', '#202123');
    $('.dropdowns .profile-info').css('color', '#202123');
    $('.dropdowns .notifications .noti-parts').css('color', '#202123');
    // dropdowns

    $('.homePageFilter .navs').css('color', '#202123');
    $('.f-card .meta .date').css('color', '#202123');
    $('.f-card .meta i').css('color', '#202123');
    $('.f-card .meta .cat').css('color', '#202123');
    $('.f-card .meta .cat a').css('color', '#202123');

    // account page
    $('.user-details .user-name').css('color', '#202123');
    $('.user-details .profileActions').css('color', '#202123');
    $('.userContentMenus .menus').css('color', '#202123');
    $('.reviewStoriesDiv .buttons').css('color', '#202123');
    $('.title').css('color', '#202123');
    $('label').css('color', '#202123');
    $('.infoDiv').css('color', '#202123');
    $('#editDetailsButton').css('color', '#202123');
    $('.form-control').css('background', 'transparent');
    $('.form-select').css('background', 'transparent');
    $('.form-select').css('color', '#202123');
    $('.form-control').css('color', '#202123');
    $('.expandable').css('color', '#202123');
    $('.homepageLoadMore span').css('color', '#202123');
    $('.noUpload').css('color', '#202123');
    $('#shuffleStoryType').css('color', '#202123');
    // defaults
    $('.webstory .title').css('color', 'white');
    var toggleMode = document.querySelector('#toggleMode');
    toggleMode.classList.remove('fa-toggle-on');
    toggleMode.classList.add('fa-toggle-off');
    $('#toggleMode').css('color','rgb(32,33,35)');

}
$('#noti-nav').mouseover(function(){
    document.querySelector('#notifications').classList.add('sc-color');
});
$('#noti-nav').mouseout(function(){
    document.querySelector('#notifications').classList.remove('sc-color');
});




const parent = document.getElementById('alertContainerHome');
const child = document.getElementById('alertBoxHome');



function hideAlert(){
  document.querySelector('.alertContainer').style.display = 'none';
  document.querySelector('.alertContainer .alertBox').innerHTML = '';
}



function disbaleScroll() {
    // Get the current Y scroll position
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    // Set the body to hide overflow and record the previous scroll position
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollY = scrollY;
  }

  // Enable scrolling on the webpage
  function enableScroll() {
    // Get the previous Y scroll position
    var scrollY = parseInt(document.body.dataset.scrollY || '0');
    // Remove the overflow style from the body
    document.body.style.overflow = '';
    // Scroll back to the previous position
    window.scrollTo(0, scrollY);
  }

function str_obj(str) {
    str = str.split('; ');
    var result = {};
    for (var i = 0; i < str.length; i++) {
        var cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result;
}

function removeOptions(){
    if(settingState.style.display == 'block'){
        settingState.style.display = 'none';
    }else if(notification.style.display == 'block'){
        notification.style.display = 'none';
    }else if(accountsState.style.display == 'block'){
        accountsState.style.display = 'none';
        mSpinner.style.display = 'none';
        accountIcon.style.display = "block";
    }else if(advOptions.style.display == 'block'){
        advOptions.style.display = 'none';
    }
    overlay.style.display = 'none';
}


function toggleSetting(){
    if(settingState.style.display == 'none'){
        settingState.style.display = 'block';
        overlay.style.display = 'block';
    }else{
        settingState.style.display = 'none';

    }
 }

function toggleNotifications(){
    if(notification.style.display == 'none'){
        notification.style.display = 'block';
        overlay.style.display = 'block';
    }else{
        notification.style.display = 'none';
    }
}
function toggleAccounts(){
    if(accountsState.style.display == 'none'){
        accountsState.style.display = 'block';
        overlay.style.display = 'block';
        accountIcon.style.display = 'none';
        mSpinner.style.display = 'block';
    }else{
        accountsState.style.display = 'none';
        mSpinner.style.display = 'none';
    }
}

function toggleAdmin() {
    if(advOptions.style.display == 'none'){
        advOptions.style.display = 'block';
        overlay.style.display = 'block';
        $('#RefreshIcon, #refHard, #refStyle, #HPicon').css('color', 'green');
    }else{
        advOptions.style.display = 'none';
    }
}



function toggleProfile() {
    if(accountsState.style.display == 'none'){
        accountsState.style.display = 'block';
      overlay.style.display = 'block';
    }else{
        accountsState.style.display = 'none';
    }

}
