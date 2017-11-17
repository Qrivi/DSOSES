let user;
let consultations = {};
let firstRun = true;

const checkAuth = () => {
    $.get( 'https://sos.devine-tools.be/student/consulten', ( data ) => {
            var title = $( data )
                .filter( 'title' )
                .text();

            if( title === 'Devine SOS tool - login' )
                return createError( 'Not logged in' );
            if( title !== 'Devine SOS tool - overzicht consulten' )
                return createError( 'Something went wrong' );
            if( !user )
                $.get( 'https://sos.devine-tools.be/student/profiel', ( data ) => {
                    user = $( data )
                        .find( '.profile-container h1' )
                        .text()
                        .trim();
                    console.log( 'Fetched user: ', user );
                } );

            //fetchConsultation( 'http://sandbox.krivi.be/sos/' ); //TODO remove hier en in manifest
            $( data )
                .find( '.overview-table-container a' )
                .each( function() {
                    fetchConsultation( this.href );
                } );
        } )
        .fail( createError );

    setTimeout( () => {
        if( config.enabled )
            checkAuth();
    }, config.refreshRate );
}

const fetchConsultation = ( href ) => {
    $.get( href, ( data ) => {
        $( data )
            .find( '.registrations-container .registration > span' )
            .each( function() {
                let row = $( this )
                    .text();
                if( row
                    .includes( user ) )
                    parseConsultation( this.closest( 'article.table' ), row );
            } );
    } );
}

const parseConsultation = ( consultation, row ) => {
    if( consultations.error )
        delete consultations.error;

    if( firstRun ) {
        firstRun = false;
        config.enabled = true;
        saveConfig();
    }

    let lecturer = $( consultation )
        .find( '.table-name span' )
        .first()
        .text();
    let id = lecturer
        .replace( /\W/g, '' )
        .toLowerCase();
    let position = parseInt( row.substr( 0, row.indexOf( '.' ) ) ) - 1;

    if( config.showNotifications && consultations[ id ] && consultations[ id ][ position ] !== position )
        if( config.showAllNotifications )
            showNotification( lecturere, position );
        else if( config.showQueueNotification >= position )
        showNotification( lecturere, position );

    consultations[ id ] = { id: id, lecturer: lecturer, position: position, html: consultation };
    saveConsultations();
}

const createError = ( message ) => {
    if( !message )
        message = 'Could not connect';
    consultations = { error: message };
    saveConsultations();
}

const showNotification = ( lecturer, position ) => {
    let message = 'Er zijn nog ' + position + ' studenten voor je bij ' + lecturer + '.';
    if( position === 1 )
        message = 'Er is nog 1 iemand voor je bij ' + lecturer + '. Zet je schrap!';
    else if( position === 0 )
        message = 'Het is nu jouw beurt bij ' + lecturer + '! Veel succes!'

    chrome.notifications.create( {
        type: 'basic',
        iconUrl: '../img/icon.png',
        title: 'Devine SOS',
        message: message
    } );
}

const saveConsultations = () => {
    console.log( "Saving consultations to sessionStorage" );

    if( consultations.error || config.enabled )
        sessionStorage.setItem( 'sos_data', JSON.stringify( consultations ) );
}

// document.getElementById( 'btn' )
//     .addEventListener( 'click', checkAuth );
// document.getElementById( 'btn2' )
//     .addEventListener( 'click', () => console.log( consultations ) );
