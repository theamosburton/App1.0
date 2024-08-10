function onGoogleSignIn(response) {
  const responsePayload = decodeJWT(response.credential);
      const loginURL =`/.ht/API/G_USER_LOGIN.php?email=${responsePayload.email}&name=${responsePayload.name}&profilePic=${responsePayload.picture}`;
      serverLogin(loginURL);
      async function serverLogin(url){
        const response = await fetch(url);
        var data = await response.json();
        islogged = data.Result;
        message = data.message;
        if (islogged) {
          location.reload();
        }else {
          alert("Unable To Login");
        }
      }
 }


 function logout() {
  let logout = document.querySelector('#logout');
  let logoutIcon = document.querySelector('#logout i');
  logout.innerHTML = `<div class="spinner" id="oSpinner"></div>Logging Out...`;

  const logoutURL =`/.ht/API/G_USER_LOGIN.php?logout`;
  serverLogout(logoutURL);
  async function serverLogout(url){
    const response = await fetch(url);
    var data = await response.json();
    isloggedout = data.Result;
    if (isloggedout) {
      location.reload();
    }else {
      alert("Unable To Logout");
    }
  }
 }

 function decodeJWT(jwtToken) {
    const payload = JSON.parse(window.atob(jwtToken.split('.')[1]));
    return payload;
  }
