
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





function createWallet(){
    let loginArea = document.getElementById("loginViewArea");
    loginArea.innerHTML = `
    <div class="loginTitle verificationTitle">
                <span>Human Verification</span>
    </div>
    <span id="captchaMessage"></span>
    <div id="captcha1Div">
    </div>

    <span id="captchaToken1" style="display: none;"></span>
    <input class="captchaInput" type="text" name="" id="captchaValue1" placeholder="Enter captcha 1" style="display:none">

    <div id="captcha2Div">
    </div>
    
    <span id="captchaToken2" style="display: none;"></span>
    <input class="captchaInput" type="text" name="" id="captchaValue2" placeholder="Enter captcha 2"> 
    <div class="loginModes">
        <span id="refreshDiv" class="refreshIcon anon-btn" onclick="refreshCaptcha(true, 'both')"><i class="fa fa-refresh"></i></span>
        <a class="anon-btn" onclick="createWalletNotBot()" id="createWallet"> Submit</a>
    </div>
    `;
    refreshCaptcha(false, "both");
}
function refreshCaptcha(externally, which){
    let refreshDiv = document.querySelector('#refreshDiv i');
    if (externally === true) {
        refreshDiv.style.animation = "rotate 2s linear infinite";
    }
    
    if (which == 'both') {
        let captcha2Div = document.getElementById("captcha2Div");
        let cap2Load = document.createElement("div");
        cap2Load.id = 'cap2Load';
        cap2Load.style.display = 'flex'
        captcha2Div.appendChild(cap2Load)
        createDotsAnimation('cap2Load', 10, 100);
        getCaptcha1()
        getCaptcha2()
    }else if(which == 'one'){
        let captcha1Div = document.getElementById("captcha1Div");
        let cap1Load = document.createElement("div");
        cap1Load.id = 'cap1Load';
        cap1Load.style.display = 'flex'
        captcha1Div.appendChild(cap1Load)
        requestAnimationFrame(() =>{
            createDotsAnimation('cap1Load', 10, 100);
        })
        getCaptcha1()
    }else if(which == 'two'){
        let captcha2Div = document.getElementById("captcha2Div");
        let cap2Load = document.createElement("div");
        cap2Load.id = 'cap2Load';
        cap2Load.style.display = 'flex'
        captcha2Div.appendChild(cap2Load)
        requestAnimationFrame(() =>{
            createDotsAnimation('cap2Load', 10, 100);
        })
        
        getCaptcha2()
    }
   
    refreshDiv.style.animation = "none";
}

function createWalletNotBot(){
    let captchaToken1 = document.getElementById("captchaToken1");
    let captchaToken2 = document.getElementById("captchaToken2");
    let captchaValue1 = document.getElementById("captchaValue1").value;
    let captchaValue2 = document.getElementById("captchaValue2").value;
    let captchaMessage = document.getElementById("captchaMessage");
    if (captchaValue1.length < 4 || captchaToken2 < 4) {
        refreshCaptcha(false)
        captchaMessage.innerHTML = "Invalid Captcha";
    }else{
        async function verifyCaptcha(){
            let captcha1 = document.getElementById("captchaValue1");
            let captcha2 = document.getElementById("captchaValue2");
            const logUrl = '/API/captchaVarification';
            var encyDat = {
                CapT1: captchaToken1.innerHTML,
                cap1: captchaValue1,
                CapT2: captchaToken2.innerHTML,
                cap2: captchaValue2,
                purpose: "creation"
            };
            const response = await fetch(logUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(encyDat)
            });
            var verifyCaptcha = await response.json();
            console.log(verifyCaptcha);
            if (verifyCaptcha.status) {
                showWallet(verifyCaptcha);
            }else if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "both"){
                captcha1.value = '';
                captcha2.value = '';
                captchaMessage.innerHTML = "Wrong Captcha";
                refreshCaptcha(false, "both")

            }else if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "one"){
                captcha1.value = "";
                captchaMessage.innerHTML = "Refill 1st Captcha";
                refreshCaptcha(false, "one")

            }else if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "two"){
                captcha2.value = "";
                captchaMessage.innerHTML = "Refill 2nd Captcha";
                refreshCaptcha(false, "two")
            }else{
                captchaMessage.innerHTML = verifyCaptcha.captchaFail;
            }
        }
        verifyCaptcha()
    }

}


function showWallet(walletInfo){
    let loginArea = document.getElementById("loginViewArea");
    loginArea.innerHTML = `
            <div class="loginTitle successIcon">
                <img src="brands/success.png">
             </div>
             <div class="loginTitle successMessage">
                <span>Wallet Created Successfully</span>
             </div>
             <hr width="80px">
             
             `;

}
function recoverWallet(){

}

async function getCaptcha1(){
    const logUrl = '/API/captcha/generateCaptcha';
    var encyDat = {};
    const response = await fetch(logUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(encyDat)
        });
        var getCaptcha1 = await response.json();
        let captcha1Div = document.getElementById('captcha1Div');
        captcha1Div.innerHTML = `<img class="captchaBox" src="data:image/jpeg;base64,${getCaptcha1.captcha}" id="captchaBox1" alt="Captcha 1 Image"></img>`
        let captchaToken1 = document.getElementById('captchaToken1');
        document.getElementById("captchaValue1").style.display = "flex"
        captchaToken1.innerHTML = getCaptcha1.token;
}

async function getCaptcha2(){
    const logUrl = '/API/captcha/generateCaptcha';
    var encyDat = {};
    const response = await fetch(logUrl, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(encyDat)
        });
    var getCaptcha2 = await response.json();
    let captcha2Div = document.getElementById('captcha2Div');
    captcha2Div.innerHTML = `<img class="captchaBox" src="data:image/jpeg;base64,${getCaptcha2.captcha}" id="captchaBox2" alt="Captcha 2 Image"></img>`
    let captchaToken2 = document.getElementById('captchaToken2');
    captchaToken2.innerHTML = getCaptcha2.token;
}




