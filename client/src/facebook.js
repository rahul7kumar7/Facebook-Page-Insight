export default function facebookSdkLoader(){
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: '657492750114429',
            cookie: true,
            xfbml: true,
            version: 'v22.0',
        });

        window.FB.AppEvents.logPageView();
    };

    (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')
    );
}
