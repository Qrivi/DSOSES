loadConfig();
checkAuth();

chrome.runtime.onMessage.addListener(
    ( request ) => {
        console.log( 'Message received from tab' );

        if( request.message === "perform_action" )
            switch( request.action ) {
                case 'inschrijven':
                    config.enabled = true;
                    saveConfig();
                    checkAuth();
                    break;
                case 'uitschrijven':
                    consultations = {};
                    saveConsultations();
                    break;
            }
    }
);
