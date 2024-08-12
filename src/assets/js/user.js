
let cookieExist = (document.cookie.match(/^(?:.*;)?\s*UID\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
let userID;
if (cookieExist != null) {
    userID = str_obj(document.cookie).UID;
}else{
    userID = '';
}


function uploadImage(event) {
    event.preventDefault(); // Prevent form submission

    var fileInput = document.getElementById('imageInput');
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append('image', file);

    // Send the file to the PHP server using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'upload.php', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log('File uploaded successfully.');
      } else {
        console.log('File upload failed.');
      }
    };
    xhr.send(formData);
  }



function cancelUpdatePopup() {
    $('.profileUpdateShade').css('display', 'none');
     enableScroll();
}
function enableUpdatePopup(){
    $('.profileUpdateShade').css('display', 'flex');
    disbaleScroll();
    removeOptions();
}

function updateDOBndGender(){
    var DOB = document.querySelector('#updateDOB').value;
    var Gender = document.querySelector('#updateGender').value;
    var errorMessage = document.querySelector('#errorMessage');
    var dob = false;
    var gen = false;
    if(Gender.length < 1){
        errorMessage.style.display = 'inline-block';
        errorMessage.innerHTML = 'Please select gender';
    }else if (Gender == 'Male' || Gender == 'Female' || Gender == 'Others') {
        if (DOB != '') {
            if (isFiveYearsOld(DOB)) {
                errorMessage.style.display = 'none';
                document.querySelector('#updateDOBndGender').innerHTML = `Updating...`;
                updateDOBndGender();
                async function updateDOBndGender(){
                    const logUrl = `/.ht/API/updateDetails.php?gender=${Gender}&DOB=${DOB}`;
                    const response = await fetch(logUrl);
                    var data = await response.json();
                    if (data.Result) {
                        location.reload();
                    }else{
                        errorMessage.style.display = 'inline-block';
                        errorMessage.innerHTML = 'Not Updated';
                    }
                }

            }else{
                errorMessage.style.display = 'inline-block';
                errorMessage.innerHTML = 'Must Greater then 5 Yrs';
            }
        }else{
            errorMessage.style.display = 'inline-block';
            errorMessage.innerHTML = 'Please Enter DOB';
        }
    }else{
        errorMessage.style.display = 'inline-block';
        errorMessage.innerHTML = 'Incorrect Gender given';
    }
}





function isFiveYearsOld(dateString) {
    var inputDate = new Date(dateString);
    var today = new Date();
    var tenYearsAgo = new Date().setFullYear(today.getFullYear() - 5);
    return inputDate <= tenYearsAgo;
    }


isUserlogged();
async function isUserlogged(){
    const logUrl = `/.ht/API/checkUser.php`;
    const response = await fetch(logUrl);
    var userLog = await response.json();
    if (userLog.Result) {
        let PID = userLog.message.PID;
        let NAME = userLog.message.NAME;
        getNotifications(PID);
        async function getNotifications(PID){
            const logUrl = '/.ht/API/getNotifications.php';
            var encyDat = {
                'ePID' : `${PID}`
            };
            const response = await fetch(logUrl, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(encyDat)
              });
            var notificationData = await response.json();


            var notifiCount = notificationData.length;

            const alread = notificationData.filter(notification => notification.isRead === "1");
            const nonRead = notificationData.filter(notification => notification.isRead === "0");

            // hide and show notification badge based on notifications
            var nonReadCount = nonRead.length;
            if (nonReadCount > 0) {
                if (nonReadCount > 100) {
                    $('#notiCount').css('width', 'auto');
                }
                $('#notiCount').css('display', 'flex');
                $('#notiCount').html(nonReadCount);
            }else{
                $('#notiCount').css('display', 'none')
            }
            // ********* //
            let notification = [];
            notification[0] = `
            <div class="notification no-noti" id="notification">

                    <div class="body">
                        <p class="noti-parts title"> No new notification</p>
                    </div>
            </div>`;
            //
            for (let g = 0; g < notificationData.length; g++) {

                // Get title of notification title and name, username etc
                let str = notificationData[g].title;
                if (str.includes("${NAME}")) {
                    str = str.replace("${NAME}", NAME);
                } else if (str.includes("${USERNAME}")) {
                    str = str.replace("${USERNAME}", USERNAME);
                }
                // ************************** //


                // put green tag to know unread and read notifications
                if(notificationData[g].isRead == '0'){
                    var showDot = `<i id="markRead" class="fa fa-circle-dot"></i>`;
                }else{
                    var showDot = `<i id="markedRead" class="fa fa-circle-dot"></i>`;
                }
                // *************************************************** //

                // Get notification link
                let url = notificationData[g].url;
                // ***************** //

                // Get notifier image
                let srcImage;
                if (notificationData[g].image != null) {
                    srcImage = notificationData[g].image;
                }else{
                    srcImage = "/assets/img/favicon2.jpg";
                }
                // *************************   //

                let otherFunction;
                if (notificationData[g].Purpose == 'profileCompletion') {
                    otherFunction = "profileCompletion()";
                }else{
                    otherFunction = false;
                }

                notification[g] = `
                <div onclick="markRead('${notificationData[g].id}', '${url}')" class="notification" id="notification${g+1}">
                    <a>
                        <img class="image" src="${srcImage}">
                        <div class="body">
                            <p class="noti-parts title"> ${str}</p>
                            <span class="noti-parts time">${timeAgo(notificationData[g].time)}</span>
                        </div>
                        ${showDot}
                    </a>

                </div>`;
            }
            let oldFirst = [...notification].reverse();
            let newFirst = notification;
            newFirst = newFirst.join("\n");
            oldFirst = oldFirst.join("\n");
            document.getElementById('notifications').innerHTML = newFirst;
            styleUpdate();

        }

    }
}
function markRead(SNO, red){
    if (red == 'update') {
        enableUpdatePopup();
    }else{
        cancelUpdatePopup();
        isUserlogged(SNO,red);
        async function isUserlogged(SNO, red){
            const logUrl = `/.ht/API/markRead.php?SNO=${SNO}`;
            const response = await fetch(logUrl);
            var userLog = await response.json();
            if (userLog.Result) {
                console.log("Marked Read");
                window.location.assign(red);
            }else{
                console.log("Not Marked Read");
            }

        }
    }

}
function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - timestamp * 1000) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return `${interval} years ago`;
    }
    if (interval === 1) {
      return "1 year ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval} months ago`;
    }
    if (interval === 1) {
      return "1 month ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval} ${interval === 1 ? "day" : "days"} ago`;
    }
    if (interval === 1) {
      return "1 day ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval} ${interval === 1 ? "hour" : "hours"} ago`;
    }
    if (interval === 1) {
      return "1 hour ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval} ${interval === 1 ? "minute" : "minutes"} ago`;
    }
    if (interval === 1) {
      return "1 minute ago";
    }
    return `${Math.floor(seconds)} seconds ago`;
  }
