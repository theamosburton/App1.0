function hardRefresh(){
    refreshCss();
    $('#HPicon').css('display', 'none');
    $('#HRSpinner').css('display', 'block');
    $('#refHard span').html('Pulling Repos...');
    const refreshUrl = '/.ht/API/REFRESH.php?intent=hardRefresh';
    refreshFunction(refreshUrl);
    async function refreshFunction(url){
        const response = await fetch(url);
        var data = await response.json();
        let isRefreshed = data.Result;
        if (isRefreshed) {
            $('#HRSpinner').css('display', 'none');
            $('#HPicon').css('display', 'block');
            $('#refHard span').html('Repos Pulled');
            // location.reload();
        }else{
            alert(data.message);
            $('#HRSpinner').css('display', 'none');
            $('#HPicon').css('display', 'block');
            $('#refHard span').html('Repos Pulled');
        }
    }
}

function refreshCss() {
    $('#RefreshIcon').css('display', 'none');
    $('#RSpinner').css('display', 'block');
    $('#refStyle span').html('Updating Styles...');
    const refreshUrl = '/.ht/API/REFRESH.php?intent=refreshCSS';
    refreshFunction(refreshUrl);
    async function refreshFunction(url){
        const response = await fetch(url);
        var data = await response.json();
        let isRefreshed = data.Result;
        if (isRefreshed) {
            alert(data.message);
            $('#RSpinner').css('display', 'none');
            $('#RefreshIcon').css('display', 'block');
            $('#refStyle span').html('Updated');
        }else{
            alert(data.message);
            $('#RSpinner').css('display', 'none');
            $('#RefreshIcon').css('display', 'block');
            $('#refStyle span').html('Updated');
        }
    }
}