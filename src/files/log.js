
window.onload = async function () {
    var referer = document.getElementById('applyReferer');
    var applyRefLink = document.getElementById('applyReferalLink');
    var referalInput = document.getElementById('referalInput');
    var getRefCookie = getCookie('ref');
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    let refValue = urlObj.searchParams.get("ref");



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

    if (getRefCookie != null) {
        refValue = getRefCookie;
    }else if (refValue != null && refValue.length > 0) {
        refValue = refValue;
    }else{
        refValue = null;
    }
    
    if (refValue != null) {
        referer.style.display == 'none';
        var refStatus = await fetchRef(refValue);
        if(refStatus){
            applyRefLink.style.color = 'rgb(0, 166, 255)';
            applyRefLink.innerHTML = `<span>Referal code applied</span> <span class="referalCode">${refValue}</span>`;
            referalInput.value = refValue;
            referer.style.display = 'none';
            applyReferal.innerHTML = 'Update';
            referalInput.style.color = 'rgb(10, 151, 10)';
            applyRefLink.style.flexDirection = 'column';
            setCookie('ref', refValue, 999999, false);
        }else{
            applyRefLink.style.color = 'tomato';
            applyRefLink.innerHTML = `<span>Invalid referal code</span> <span class="referalCode">${refValue}</span>`;
            applyReferal.innerHTML = 'Update';
            referalInput.value = refValue;
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
        applyRefLink.innerHTML = `<span>Referal code applied</span> <span class="referalCode"><b>${refValue}</b></span>`;
        setCookie('ref', refValue, 999999, false);
        referer.style.display = 'none';
        applyReferal.innerHTML = 'Update';
        referalInput.style.color = 'rgb(10, 151, 10)';
        applyReferal.style.backgroundColor = 'slateblue';
    }else{
        applyRefLink.style.color = 'tomato';
        applyRefLink.innerHTML = `<span>Invalid referal code</span> <span class="referalCode"><b>${refValue}</b></span>`;
        applyReferal.innerHTML = 'Update';
        referalInput.style.color = '#FF6347';
        referer.style.display = 'flex';
        applyReferal.style.backgroundColor = 'slateblue';
    }
}
async function fetchRef(referalCode) {
    const response = await fetch(`/API/checkReferal?ref=${referalCode}`);
    const ref = await response.json();
    return ref.referalStatus;
}
function createWallet(){
    let referalCode = document.getElementById('referalInput').value;
    let loginArea = document.getElementById("loginViewArea");
    loginArea.innerHTML = `
    <i class="fa fa-arrow-left goBack" onclick="gotoMainScreen()"></i>
    <div class="loginTitle verificationTitle">
        <span>Human Verification</span>
    </div>
    <div id="captchaMessage"></div>
    <div id="captcha1Div">
    </div>

    <span id="captchaToken1" style="display: none;"></span>
    <div class="captchaFillDiv">
        <input class="captchaInput" type="text" name="" id="captchaValue1" placeholder="Enter captcha 1">
        <span id="refreshDiv" class="refreshIcon" onclick="refreshCaptcha(true, 'one')"><i class="fa fa-refresh"></i></span>
    </div>
    <div id="captcha2Div">
    </div>
    
    <span id="captchaToken2" style="display: none;"></span>
    <div class="captchaFillDiv">
        <input class="captchaInput" type="text" name="" id="captchaValue2" placeholder="Enter captcha 2"> 
        <span id="refreshDiv" class="refreshIcon" onclick="refreshCaptcha(true, 'two')"><i class="fa fa-refresh"></i></span>
    </div>
    <div class="loginModes">
        <a class="anon-btn" onclick="createWalletNotBot('${referalCode}')" id="createWallet"> Submit</a>
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

function createWalletNotBot(referalCode){
    let captchaToken1 = document.getElementById("captchaToken1");
    let captchaToken2 = document.getElementById("captchaToken2");
    let captchaValue1 = document.getElementById("captchaValue1").value;
    let captchaValue2 = document.getElementById("captchaValue2").value;
    let captchaMessage = document.getElementById("captchaMessage");
    let loadingOverlay = document.createElement('div');
    loadingOverlay.id = "loadingOverlay";
    loadingOverlay.innerHTML = `
        <div id='overlayAnim' style='display:flex;'></div>
        <div id="loadingMessage">Verifying captcha...</div>
    `;
    document.body.appendChild(loadingOverlay);
    createDotsAnimation('overlayAnim', 10, 100);
    if (captchaValue1.length < 4 || captchaToken2 < 4) {
        refreshCaptcha(false)
        captchaMessage.innerHTML = "Invalid Captcha";
        loadingOverlay.style.display = "none";
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
                purpose: "creation",
                referalCode : referalCode
            };
            const response = await fetch(logUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(encyDat)
            });
            var verifyCaptcha = await response.json();
            if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "both"){
                loadingOverlay.style.display = "none";
                captcha1.value = '';
                captcha2.value = '';
                captchaMessage.innerHTML = "Wrong captcha entered";
                refreshCaptcha(false, "both")

            }else if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "one"){
                loadingOverlay.style.display = "none";
                captcha1.value = "";
                captchaMessage.innerHTML = "Refill 1st Captcha";
                refreshCaptcha(false, "one")

            }else if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "two"){
                loadingOverlay.style.display = "none";
                captcha2.value = "";
                captchaMessage.innerHTML = "Refill 2nd Captcha";
                refreshCaptcha(false, "two")
            }else{
                loadingOverlay.innerHTML = `
                <div id='overlayAnim' style='display:flex;'></div>
                <div id="loadingMessage">Generating a wallet...</div>
                `;
                setTimeout(() => {
                    showNewWallet(verifyCaptcha);
                }, 1000);
            }
        }
        verifyCaptcha()
    }

}

function recoverWallet(){
    let loginArea = document.getElementById("loginViewArea");
    loginArea.innerHTML = `
    <i class="fa fa-arrow-left goBack" onclick="gotoMainScreen()"></i>
    <div class="loginTitle verificationTitle">
        <span>Human Verification</span>
    </div>
    <div id="captchaMessage"></div>
    <div id="captcha1Div">
    </div>

    <span id="captchaToken1" style="display: none;"></span>
    <div class="captchaFillDiv">
        <input class="captchaInput" type="text" name="" id="captchaValue1" placeholder="Enter captcha 1">
        <span id="refreshDiv" class="refreshIcon" onclick="refreshCaptcha(true, 'one')"><i class="fa fa-refresh"></i></span>
    </div>
    

    <div id="captcha2Div">
    </div>
    
    <span id="captchaToken2" style="display: none;"></span>
    <div class="captchaFillDiv">
        <input class="captchaInput" type="text" name="" id="captchaValue2" placeholder="Enter captcha 2"> 
        <span id="refreshDiv" class="refreshIcon" onclick="refreshCaptcha(true, 'two')"><i class="fa fa-refresh"></i></span>
    </div>

    <div class="loginValueInputDiv">
        <input class="loginValueInput" type="text" name="" id="loginValueInput" placeholder="Enter private key or seed phrase">
    </div>
    <div class="loginModes">
        <a class="anon-btn" onclick="botlessLogin()" id="createWallet"> Login/Recover</a>
    </div>
    `;
    refreshCaptcha(false, "both");
}


function botlessLogin(){
    let captchaToken1 = document.getElementById("captchaToken1");
    let captchaToken2 = document.getElementById("captchaToken2");
    let captchaValue1 = document.getElementById("captchaValue1").value;
    let captchaValue2 = document.getElementById("captchaValue2").value;
    let captchaMessage = document.getElementById("captchaMessage");
    let loginValueInput = document.getElementById("loginValueInput");
    let loginValue = loginValueInput.value;
    let loadingOverlay = document.createElement('div');
    loadingOverlay.id = "loadingOverlay";
    loadingOverlay.innerHTML = `
        <div id='overlayAnim' style='display:flex;'></div>
        <div id="loadingMessage">Verifying captcha...</div>
    `;
    document.body.appendChild(loadingOverlay);
    createDotsAnimation('overlayAnim', 10, 100);
    if (captchaValue1.length < 4 || captchaToken2 < 4) {
        refreshCaptcha(false)
        captchaMessage.innerHTML = "Invalid/empty captcha entered";
        loadingOverlay.style.display = "none";
    }else{
        async function loginWallet(){
            let captcha1 = document.getElementById("captchaValue1");
            let captcha2 = document.getElementById("captchaValue2");
            const logUrl = '/API/captchaVarification';
            var encyDat = {
                CapT1: captchaToken1.innerHTML,
                cap1: captchaValue1,
                CapT2: captchaToken2.innerHTML,
                cap2: captchaValue2,
                purpose: "recovery",
                recoveryPhrase: loginValue
            };
            const response = await fetch(logUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(encyDat)
            });
            var verifyCaptcha = await response.json();
            if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "both"){
                loadingOverlay.style.display = "none";
                captcha1.value = '';
                captcha2.value = '';
                captchaMessage.innerHTML = "Wrong captcha entered";
                refreshCaptcha(false, "both")

            }else if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "one"){
                loadingOverlay.style.display = "none";
                captcha1.value = "";
                captchaMessage.innerHTML = "Refill 1st Captcha";
                refreshCaptcha(false, "one")

            }else if(!verifyCaptcha.status && verifyCaptcha.captchaFail == "two"){
                loadingOverlay.style.display = "none";
                captcha2.value = "";
                captchaMessage.innerHTML = "Refill 2nd Captcha";
                refreshCaptcha(false, "two")
            }else{
                loadingOverlay.innerHTML = `
                <div id='overlayAnim' style='display:flex;'></div>
                <div id="loadingMessage">Verifying your wallet...</div>
                `;
                createDotsAnimation('overlayAnim', 10, 100);
                setTimeout(() => {
                    loginRecoverWallet(verifyCaptcha);
                }, 1000);
            }
        }
        loginWallet()
    }

}
function showNewWallet(walletInfo){
    let loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = "none";
    let loginArea = document.getElementById("loginViewArea");
    if (walletInfo.status) {
        let seedArray = walletInfo.walletSeed.trim().split(/\s+/);
        let seedArrayList = seedArray.map(word => `<li>${word} </li>`).join('<br>');
        loginArea.innerHTML = `
            <div class="loginTitle successMessage">
                <span>Wallet Created Successfully</span>
            </div>
            <div class="loginTitle walletInfo">
            <div class="topMessage">
                <div class="title">Warning: We don't save your recovery phrase(2) and private key(1). If you lose the recovery phrase, you will not be able to recover your wallet.
                </br>Kindly write/note them down</div>
            </div>
            <div class="walletAddress">
                <span class="title">1. Wallet Address</span>
                <div class="walletAddressField">
                    <input type="text" id="" value="${walletInfo.walletAddress}">
                </div>
            </div>
            
            <div class="recoveryFile">
                <span class="title">2. Private Key</span>
                <div class="instructions">
                    <p>This will be used to sign in and manage your wallet.</p>
                </div>
                <div class="recoveryFileField">
                    <input type="text" id="pText" value="${walletInfo.walletKey}">
                </div>
                
            </div>
            <div class="walletPhrase">
                <span class="title">3. Recovery Phrase</span>
                <div class="instructions">
                    <p>Memorise it or write it down, in the same order.</p>
                </div>
                <div class="recoveryPhraseField">
                    <ul>
                        ${seedArrayList}
                    </ul>
                </div>
                
            </div>
            <div class="goToWallet" onclick="goto('/mywallet/')">
                <span>Go to Wallet</span>
            </div>`
        ;
    }else{
        loginArea.innerHTML = `
            <div class="loginTitle errorTitle">
                    <span>Wallet creation failed</span>
            </div>
            <div class="topMessage errorMessage">
                <div class="title">${walletInfo.log}</div>
            </div>
            <div class="goToWallet" onclick="goto('/mywallet')">
                <span>Create Again</span>
            </div>
    `;
    }
}

function loginRecoverWallet(loginRecoverWallet){
    let loginArea = document.getElementById("loginViewArea");
    if (loginRecoverWallet.purpose == "Recovery") {
        if (loginRecoverWallet.status) {
            loginArea.innerHTML = `
            <div class="loginTitle successMessage">
                <span>Wallet Recoverd Successfully</span>
            </div>
            <div class="loginTitle walletInfo">
            <div class="topMessage">
                    <div class="title">Warning: We don't save your recovery phrase and private key. If you lose the recovery phrase, you will not be able to recover your wallet.
                    </br>Note them down</div>
            </div>
            <div class="walletAddress">
                <span class="title">1. Wallet Address</span>
                <div class="walletAddressField">
                    <input type="text" id="" value="${loginRecoverWallet.walletAddress}">
                </div>
            </div>
            
            <div class="recoveryFile">
                <span class="title">2. Private Key</span>
                <div class="instructions">
                    <p>Your private key will be used for sending and selling TBs and managing your wallet.</p>
                </div>
                <div class="recoveryFileField">
                    <input type="text" id="pText" value="${loginRecoverWallet.walletKey}">
                </div>
                
            </div>
            <div class="goToWallet" onclick="goto('/mywallet/')">
                <span>Go to Wallet</span>
            </div>`
        ;
        }else{
            loginArea.innerHTML = `
                <div class="loginTitle errorTitle">
                        <span>Wallet recovery failed</span>
                </div>
                <div class="topMessage errorMessage">
                    <div class="title">${loginRecoverWallet.log}</div>
                </div>
                <div class="goToWallet" onclick="goto('/mywallet/')">
                    <span>Try Again</span>
                </div>
            `;
        }
    }else if(loginRecoverWallet.purpose == "Login"){
        if (loginRecoverWallet.status) {
            loginArea.innerHTML = `
            <div class="loginTitle successMessage s15">
                <span>Logged in successfully</span>
            </div>
            <div class="topMessage redirectingMessage">
                    <div class="title">Redirecting...</div>
            </div>
            `;
            setTimeout(() => {
                // goto('/mywallet');
            }, 1000);
        }else{
            loginArea.innerHTML = `
                <div class="loginTitle errorTitle">
                        <span>Login Failed</span>
                </div>
                <div class="topMessage errorMessage">
                    <div class="title">${loginRecoverWallet.log}</div>
                </div>
                <div class="goToWallet" onclick="goto('/mywallet')">
                    <span>Try Again</span>
                </div>
            `;
        }
    }else{
        loginArea.innerHTML = `
                <div class="loginTitle errorTitle">
                        <span>We can't process</span>
                </div>
                <div class="topMessage errorMessage">
                    <div class="title">${loginRecoverWallet.log}</div>
                </div>
                <div class="goToWallet" onclick="goto('/mywallet')">
                    <span>Try Again</span>
                </div>
            `;
    }
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

function gotoMainScreen(){
    let loginArea = document.getElementById("loginViewArea");
    loginArea.innerHTML = `
    <div class="loginTitle">
                <span>Your ShellCoin Wallet</span>
            </div>
            <hr width="80px">
            <div class="loginModes">
                <a class="anon-btn" onclick="createWallet()" id="createWallet"><img src="/images/anon.png" alt="Anonymous logo"> Create a new wallet</a>
            </div>
            <div class="loginModes">
                <a class="anon-btn loginWallet" onclick="recoverWallet()" id="recoverWallet"> <img class="recover" src="/images/wallet.png" alt="Wallet logo">Login/Recover Wallet</a>
            </div>

            <div class="applyReferalLink" onclick="toggleReferal()" id="applyReferalLink">
                <span>I have referel code</span>
            </div>
            <div id="applyReferer" class="loginModes applyReferer" style="display: none;">
                <input id="referalInput" type="text" placeholder="Enter referel wallet">
                <span id="applyReferal" onclick="applyReferal()" class="button">Apply code</span>
            </div>

            <div class="loginModes agreement">
                <span>Before creating your wallet with ShellCoin, please review these key points to ensure its <a href="/security-recovery">security and  recovery</a>. </span>
            </div>
            
            <div class="loginModes">
                <a class="anonMessage"> You are 100% anonymous to us <br>and to the world</a>
            </div>
    `;
}





