chrome.runtime.onMessage.addListener(
    ( request ) => {
        console.log( 'Message received from tab' );
        if( request.message === "check_auth" )
            checkAuth();
    }
);

loadConfig();
checkAuth();
