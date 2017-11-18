chrome.runtime.onMessage.addListener(
    ( request ) => {
        console.log( 'Message received from tab' );

        if( request.message === "check_auth" )
            checkAuth();
        else if( request.message === "perform_action" )
            switch( request.action ) {
                case 'inschrijven':
                    config.enabled = true;
                    saveConfig();
                    checkAuth();
                case 'uitschrijven':
                    dataset = {};
                    break;
            }
    }
);

loadConfig();
checkAuth();
