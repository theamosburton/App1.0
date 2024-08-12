function createDotsAnimation(containerId, maxDots, interval) {
    const dotContainer = document.getElementById(containerId);
    dotContainer.innerHTML = '';
    const dotArray = [];
    for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dotContainer.appendChild(dot);
        dotArray.push(dot);
    }

    let increasing = true;
    let currentDots = 0;

    function animateDots() {
        if (increasing) {
            currentDots++;
            if (currentDots >= maxDots) {
                increasing = false;
            }
        } else {
            currentDots--;
            if (currentDots <= 0) {
                increasing = true;
            }
        }

        dotArray.forEach((dot, index) => {
            dot.style.opacity = index < currentDots ? '1' : '0';
        });
    }
    setInterval(animateDots, interval);
}

async function fetchRef(referalCode) {
    const response = await fetch(`/API/checkReferal?ref=${referalCode}`);
    const ref = await response.json();
    return ref.referalStatus;
}

function setCookie(name, value, days, secure) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    let cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    if (!secure) {
        cookie += ';secure=false';
    }
    document.cookie = cookie;
}

function toggleReferal(){
    var referer = document.getElementById('applyReferer');
    if (referer.style.display == 'none') {
        referer.style.display = 'flex';
    }else{
        referer.style.display = 'none';
    }
}

function goToAccount(){
    window.location.href = '/account';
}

function goto(loc) {
    window.location.href = loc;
}
function hideDropdown(id) {
    var dropdown = document.getElementById(id);
    if (dropdown) {
        dropdown.style.display = 'none';
    } else {
        console.error('Element with id "' + id + '" not found.');
    }
}

function toggle(id){
    var element = document.getElementById(id);
    if (element.style.display == 'flex') {
        if (dropdown = document.querySelectorAll('.dropdownIcon')) {
            dropdown.forEach((dropdowns) => {
                dropdowns.innerHTML = '<i class="fa fa-caret-right"></i>';
            });
        }
        element.style.display = 'none';
    } else {
        element.style.display = 'flex';
        if (dropdown = document.querySelectorAll('.dropdownIcon')) {
            dropdown.forEach((dropdowns) => {
                dropdowns.innerHTML = '<i class="fa fa-caret-down"></i>';
            });
        }
    }
}
function logout(){
    logoutNow();
        async function logoutNow(){
            const logUrl = '/API/logout';
            var encyDat = {};
            const response = await fetch(logUrl, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(encyDat)
              });
            var isLogged = await response.json();
            if (isLogged.status) {
                window.location.href = '/';
            }
        }
}


