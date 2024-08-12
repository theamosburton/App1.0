const { env } = require("process");
const { SSOLogin } = require("./login");

var loadViews = {};
loadViews.appInfo = {appName: process.env.appName}

loadViews.dashboard = async (req)=>{
    var isLogged = await SSOLogin.authenticateLogin(req);
    var data;
    if (isLogged.status) {
        var name = isLogged.log.name;
        var profilePic = isLogged.log.profilePic;
        var email = isLogged.log.email;
        data = {
            WebTop: ` <div class="menusSection" id="lWebTop">
                        <div class="menus homeMenu" > <a class="link" style="color: aqua;">Dashboard</a> </div>
                        <div class="menus aboutMenu"><a class="link" href="/#aboutSection">About</a></div>
                        <div class="menus contactMenu"><a class="link" href="/support">Support</a></div>
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                        <div class="menus homeMenu" > <a class="link" style="color: aqua;">Create Wallet</a> </div>
                    </div>`,


            MobTop: `<div class="menusSection" id="lMobTop">
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,

            Dp:`<div class="dropdownContainer" id="logDpMob" style="display:none;" onclick="hideDropdown('logDpMob')">
                    <div class="dropdownDiv" id="dropdownDiv" style="">
                        <div class="dropDownProfile">
                            <div class="profilePic">
                                <div class="profileImg">
                                    <img src="${profilePic}" alt="">
                                </div>
                            </div>
                            <div class="userInfo">
                                <p class="userInformation">${name}</p>
                                <p class="userInformation">${email}</p>
                            </div>
                        </div>

                        <div class="otherOptions" onclick="goto('/account')">
                            <i class="fa fa-coins"></i>
                            <span>Account</span>
                        </div>

                        <div class="otherOptions" onclick="goto('/#aboutSection')">
                            <i class="fa fa-info-circle"></i>
                            <span>About</span>
                        </div>
                        <div class="otherOptions" onclick="goto('/support')">
                            <i class="fa fa-comment"></i>
                            <span>Support</span>
                        </div>
                        <div class="logoutLink" onclick="logout()">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                            
                        </div>
                    </div>
                </div>`,
            buyLink: `<span><a href="/account/#waysToBuy">Buy Now</a></span>`
        };
    }else{
        data = {
            nLogTop: `<div class="menusSection" id="nLogTop">
                        <div class="wallet" onclick="goto('/login')">
                            <div class="menus loginMenu profileButton" id="loginButton">
                                <div class="imgDiv">
                                    <i class="profileImage fa fa-user"></i>
                                </div>
                            </div>
                            <div class="menus walletAddress" > <a class="link">Your Wallet</a> </div>
                        </div>
                    </div>`,

            Dp:``,
            buyLink: `<span><a href="/login">Create a wallet to buy</a></span>`
            };
    }
    return data;
}


loadViews.account = async (req)=>{
    var isLogged = await SSOLogin.authenticateLogin(req);
    var data;
    if (isLogged.status) {
        var name = isLogged.log.name;
        var profilePic = isLogged.log.profilePic;
        var email = isLogged.log.email;
        data = {
            WebTop: ` <div class="menusSection" id="lWebTop">
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,


            MobTop: `<div class="menusSection" id="lMobTop">
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,

            Dp:`<div class="dropdownContainer" id="logDpMob" style="display:none;" onclick="hideDropdown('logDpMob')">
                    <div class="dropdownDiv" id="dropdownDiv" style="">
                        <div class="dropDownProfile">
                            <div class="profilePic">
                                <div class="profileImg">
                                    <img src="${profilePic}" alt="">
                                </div>
                            </div>
                            <div class="userInfo">
                                <p class="userInformation">${name}</p>
                                <p class="userInformation">${email}</p>
                            </div>
                        </div>

                        <div class="otherOptions" onclick="goto('/')">
                            <i class="fa fa-home"></i>
                            <span>Home</span>
                        </div>

                        <div class="otherOptions" onclick="goto('/#aboutSection')">
                            <i class="fa fa-info-circle"></i>
                            <span>About</span>
                        </div>
                        <div class="otherOptions" onclick="goto('/support')">
                            <i class="fa fa-comment"></i>
                            <span>Support</span>
                        </div>
                        <div class="logoutLink" onclick="logout()">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                            
                        </div>
                    </div>
                </div>`
        };
    }else{
        data = {
            WebTop: `<div class="menusSection" id="nLogWebTop">
                        <div class="menus homeMenu"> <a class="link" href="/">Dashboard</a> </div>
                        <div class="menus aboutMenu"><a class="link" href="">About Us</a></div>
                        <div class="menus contactMenu"><a class="link" href="">Contact Us</a></div>
                        <div class="menus loginMenu profileButton profileButtonWithoutBorder" id="loginButton" onclick="goto('/login')">
                            <div class="imgDiv">
                                <i class="profileImage fa fa-user"></i>
                            </div>
                        </div>
                    </div>`,

            MobTop: `<div class="menusSection" id="nLogMobTop"> 
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('nLogDpMob')">
                            <div class="imgDiv">
                                <i class="profileImage fa fa-user"></i>
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,

            Dp:`<div class="dropdownContainer" id="nLogDpMob" style="display:none;" onclick="hideDropdown('nLogDpMob')">
                    <div class="dropdownDiv" id="dropdownDiv">
                        <div class="otherOptions firstOption" style="color:aqua;">
                            <i class="fa fa-table-columns"></i>
                            <span>Home</span>
                        </div>

                        <div class="otherOptions" onclick="goto('/#aboutSection')">
                            <i class="fa fa-info-circle"></i>
                            <span>About</span>
                        </div>
                        <div class="otherOptions" onclick="goto('/support')">
                            <i class="fa fa-comment"></i>
                            <span>Support</span>
                        </div>
                        <div class="logoutLink" onclick="goto('/login')">
                            <i class="fa fa-sign-in"></i>
                            <span>Login</span>
                            
                        </div>
                    </div>
                </div>
            `
            };
    }
    return data;
}




loadViews.docPages = async (req)=>{
    var isLogged = await SSOLogin.authenticateLogin(req);
    var data;
    if (isLogged.status) {
        var name = isLogged.log.name;
        var profilePic = isLogged.log.profilePic;
        var email = isLogged.log.email;
        data = {
            WebTop: ` <div class="menusSection" id="lWebTop">
                        <div class="menus homeMenu" > <a class="link" href="/">Dashboard</a> </div>
                        <div class="menus aboutMenu"><a class="link" href="/#aboutSection">About</a></div>
                        <div class="menus contactMenu"><a class="link" href="/support">Support</a></div>
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,


            MobTop: `<div class="menusSection" id="lMobTop">
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,

            Dp:`<div class="dropdownContainer" id="logDpMob" style="display:none;" onclick="hideDropdown('logDpMob')">
                    <div class="dropdownDiv" id="dropdownDiv" style="">
                        <div class="dropDownProfile">
                            <div class="profilePic">
                                <div class="profileImg">
                                    <img src="${profilePic}" alt="">
                                </div>
                            </div>
                            <div class="userInfo">
                                <p class="userInformation">${name}</p>
                                <p class="userInformation">${email}</p>
                            </div>
                        </div>

                        <div class="otherOptions" onclick="goto('/account')">
                            <i class="fa fa-coins"></i>
                            <span>Account</span>
                        </div>

                        <div class="otherOptions" onclick="goto('/#aboutSection')">
                            <i class="fa fa-info-circle"></i>
                            <span>About</span>
                        </div>
                        <div class="otherOptions" onclick="goto('/support')">
                            <i class="fa fa-comment"></i>
                            <span>Support</span>
                        </div>
                        <div class="logoutLink" onclick="logout()">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                            
                        </div>
                    </div>
                </div>`,
            buyLink: `<span><a href="/account/#waysToBuy">Buy Now</a></span>`
        };
    }else{
        data = {
            WebTop: `<div class="menusSection" id="nLogWebTop">
                        <div class="menus homeMenu"> <a class="link" href="/">Dashboard</a> </div>
                        <div class="menus aboutMenu"><a class="link" href="/#aboutSection">About</a></div>
                        <div class="menus contactMenu"><a class="link" href="/support">Support</a></div>
                        <div class="menus loginMenu profileButton profileButtonWithoutBorder" id="loginButton" onclick="goto('/login')">
                            <div class="imgDiv">
                                <i class="profileImage fa fa-user"></i>
                            </div>
                        </div>
                    </div>`,

            MobTop: `<div class="menusSection" id="nLogMobTop"> 
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('nLogDpMob')">
                            <div class="imgDiv">
                                <i class="profileImage fa fa-user"></i>
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,

            Dp:`<div class="dropdownContainer" id="nLogDpMob" style="display:none;" onclick="hideDropdown('nLogDpMob')">
                    <div class="dropdownDiv" id="dropdownDiv">
                        <div class="otherOptions firstOption" style="color:aqua;">
                            <i class="fa fa-home"></i>
                            <span>Home</span>
                        </div>

                        <div class="otherOptions" onclick="goto('/#aboutSection')">
                            <i class="fa fa-info-circle"></i>
                            <span>About</span>
                        </div>
                        <div class="otherOptions" onclick="goto('/support')">
                            <i class="fa fa-comment"></i>
                            <span>Support</span>
                        </div>
                        <div class="logoutLink" onclick="goto('/login')">
                            <i class="fa fa-sign-in"></i>
                            <span>Login/Sign Up</span>
                            
                        </div>
                    </div>
                </div>
            `,
            buyLink: `<span><a href="/login">Login to Buy</a></span>`
            };
    }
    return data;
}



loadViews.support = async (req)=>{
    var isLogged = await SSOLogin.authenticateLogin(req);
    var data;
    if (isLogged.status) {
        var name = isLogged.log.name;
        var profilePic = isLogged.log.profilePic;
        var email = isLogged.log.email;
        data = {
            WebTop: ` <div class="menusSection" id="lWebTop">
                        <div class="menus homeMenu" > <a class="link" href="/">Dashboard</a> </div>
                        <div class="menus aboutMenu"><a class="link" href="/#aboutSection">About</a></div>
                        <div class="menus contactMenu"><a class="link" href="/support">Support</a></div>
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,


            MobTop: `<div class="menusSection" id="lMobTop">
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('logDpMob')">
                            <div class="imgDiv">
                                <img class="profileImage" src="${profilePic}" alt="">
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,

            Dp:`<div class="dropdownContainer" id="logDpMob" style="display:none;" onclick="hideDropdown('logDpMob')">
                    <div class="dropdownDiv" id="dropdownDiv" style="">
                        <div class="dropDownProfile">
                            <div class="profilePic">
                                <div class="profileImg">
                                    <img src="${profilePic}" alt="">
                                </div>
                            </div>
                            <div class="userInfo">
                                <p class="userInformation">${name}</p>
                                <p class="userInformation">${email}</p>
                            </div>
                        </div>

                        <div class="otherOptions" onclick="goto('/account')">
                            <i class="fa fa-coins"></i>
                            <span>Account</span>
                        </div>

                        <div class="otherOptions" onclick="goto('/#aboutSection')">
                            <i class="fa fa-info-circle"></i>
                            <span>About</span>
                        </div>
                        <div class="otherOptions" onclick="goto('/support')">
                            <i class="fa fa-comment"></i>
                            <span>Support</span>
                        </div>
                        <div class="logoutLink" onclick="logout()">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Logout</span>
                            
                        </div>
                    </div>
                </div>`,
            buyLink: `<span><a href="/account/#waysToBuy">Buy Now</a></span>`
        };
    }else{
        data = {
            WebTop: `<div class="menusSection" id="nLogWebTop">
                        <div class="menus homeMenu"> <a class="link" href="/">Dashboard</a> </div>
                        <div class="menus aboutMenu"><a class="link" href="/#aboutSection">About</a></div>
                        <div class="menus contactMenu"><a class="link" href="/support">Support</a></div>
                        <div class="menus loginMenu profileButton profileButtonWithoutBorder" id="loginButton" onclick="goto('/login')">
                            <div class="imgDiv">
                                <i class="profileImage fa fa-user"></i>
                            </div>
                        </div>
                    </div>`,

            MobTop: `<div class="menusSection" id="nLogMobTop"> 
                        <div class="menus loginMenu profileButton" id="loginButton" onclick="toggle('nLogDpMob')">
                            <div class="imgDiv">
                                <i class="profileImage fa fa-user"></i>
                            </div>
                            <div class="dropdownIcon" id="dropdownIcon"> <i class="fa fa-caret-right"></i> </div>
                        </div>
                    </div>`,

            Dp:`<div class="dropdownContainer" id="nLogDpMob" style="display:none;" onclick="hideDropdown('nLogDpMob')">
                    <div class="dropdownDiv" id="dropdownDiv">
                        <div class="otherOptions firstOption" style="color:aqua;">
                            <i class="fa fa-home"></i>
                            <span>Home</span>
                        </div>

                        <div class="otherOptions" onclick="goto('/#aboutSection')">
                            <i class="fa fa-info-circle"></i>
                            <span>About</span>
                        </div>
                        <div class="otherOptions" onclick="goto('/support')">
                            <i class="fa fa-comment"></i>
                            <span>Support</span>
                        </div>
                        <div class="logoutLink" onclick="goto('/login')">
                            <i class="fa fa-sign-in"></i>
                            <span>Login/Sign Up</span>
                            
                        </div>
                    </div>
                </div>
            `,
            buyLink: `<span><a href="/login">Login to Buy</a></span>`
            };
    }
    return data;
}


module.exports = {loadViews};