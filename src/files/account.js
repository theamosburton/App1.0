function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // You can send this token to your server for further processing
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
function goto(loc) {
    window.location.href = loc;
}
