let client_id = "";
let redirect = ""
fetch('/API/js')
      .then(response => response.json())
      .then(env => {
        client_id = env.gt_client,
        redirect = env.redirect
      });

function onGithubLogin(){
    const clientID = client_id; // Replace with your GitHub Client ID
    const redirectURI = redirect; // Replace with your GitHub redirect URI
    const scope = 'user'; // Scope of the access reques
    const authURL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=${scope}`;
    window.location.href = authURL;
}
window.onload = async function () {
    var referer = document.getElementById('applyReferer');
    var applyRefLink = document.getElementById('applyReferalLink');
    var referalInput = document.getElementById('referalInput');
    var getCookie = getCookie('ref');

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
    
    createDotsAnimation('applyReferalLink', 7, 100);
    applyRefLink.style.flexDirection = 'row';

    async function fetchRef(referalCode) {
        const response = await fetch(`/API/checkReferal?ref=${referalCode}`);
        const ref = await response.json();
        return ref.referalStatus;
    }

    
    if (getCookie != null) {
        referer.style.display == 'none';
        var refStatus = await fetchRef(getCookie);
        if(refStatus){
            applyRefLink.style.color = 'rgb(0, 166, 255)';
            applyRefLink.innerHTML = `<span>Referal code applied</span> <span><b>${getCookie}</b></span>`;
            referalInput.value = getCookie;
            referer.style.display = 'none';
            applyReferal.innerHTML = 'Update';
            referalInput.style.color = 'rgb(10, 151, 10)';
            applyRefLink.style.flexDirection = 'column';
        }else{
            applyRefLink.style.color = 'tomato';
            applyRefLink.innerHTML = `<span>Invalid referal code</span> <span><b>${getCookie}</b></span>`;
            applyReferal.innerHTML = 'Update';
            referalInput.value = getCookie;
            referalInput.style.color = '#FF6347';
            referer.style.display = 'flex';
            applyRefLink.style.flexDirection = 'column';
        }
        
    }else{
        referer.style.display == 'none';
        applyRefLink.innerHTML = `<span>I have referal code</span>`;
        applyRefLink.style.color = 'rgb(0, 166, 255)';
        applyRefLink.style.flexDirection = 'column';
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for(let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(nameEQ)) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    }

}

async function applyReferal() {
    createDotsAnimation('applyReferal', 7, 100);
    var applyRefLink = document.getElementById('applyReferalLink');
    var referalInput = document.getElementById('referalInput');
    var applyReferal = document.getElementById('applyReferal');
    applyReferal.style.backgroundColor = 'transparent';
    var refValue = referalInput.value;
    var refStatus = await fetchRef(refValue);
    var referer = document.getElementById('applyReferer');
    if(refStatus){
        applyRefLink.style.color = 'rgb(0, 166, 255)';
        applyRefLink.innerHTML = `<span>Referal code applied</span> <span><b>${refValue}</b></span>`;
        setCookie('ref', refValue, 999999, false);
        referer.style.display = 'none';
        applyReferal.innerHTML = 'Update';
        referalInput.style.color = 'rgb(10, 151, 10)';
        applyReferal.style.backgroundColor = 'slateblue';
    }else{
        applyRefLink.style.color = 'tomato';
        applyRefLink.innerHTML = `<span>Invalid referal code</span> <span><b>${refValue}</b></span>`;
        applyReferal.innerHTML = 'Update';
        referalInput.style.color = '#FF6347';
        referer.style.display = 'flex';
        applyReferal.style.backgroundColor = 'slateblue';
    }
}

