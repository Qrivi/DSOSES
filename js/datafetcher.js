var dataset;
let user;
let enabled;

const checkAuth = () => {
    $.get( 'https://sos.devine-tools.be/student/consulten', ( data ) => {
            console.log( 'Updating' );
            let title = $( data ).filter( 'title' ).text();

            if( title === 'Devine SOS tool - login' )
                return makeError( 'Not logged in' );
            if( title !== 'Devine SOS tool - overzicht consulten' )
                return makeError( 'Something went wrong' );
            if( !user )
                $.get( 'https://sos.devine-tools.be/student/profiel', ( data ) => {
                    user = $( data )
                        .find( '.profile-container h1' )
                        .text()
                        .trim();
                    console.log( 'Fetched user: ', user );
                } );

            enabled = true;
            dataset = { empty: true };

            let links = $( data )
                .find( '.overview-table-container a' );
            if( links.length )
                links.each( function() {
                    fetchConsultation( this.href );
                } );
            else
                enabled = false;
        } )
        .fail( makeError );

    setTimeout( () => {
        if( enabled )
            checkAuth();
    }, config.refreshRate );
}

const fetchConsultation = ( href ) => {
    console.log( 'Consultations found' );
    $.get( href, ( data ) => {
        $( data )
            .find( '.registrations-container .registration > span' )
            .each( function() {
                let row = $( this ).text();

                if( row.includes( user ) ) {
                    enabled = true;
                    parseConsultation( this.closest( 'article.table' ), row );
                } else {
                    enabled = false;
                }
            } );
    } );
}

const parseConsultation = ( consultation, row ) => {
    let lecturer = $( consultation )
        .find( '.table-name span' )
        .first()
        .text();
    let id = lecturer
        .replace( /\W/g, '' )
        .toLowerCase();
    let position = parseInt( row.substr( 0, row.indexOf( '.' ) ) ) - 1;

    console.log( 'Subscribed to: ' + lecturer );

    if( config.showNotifications && dataset.position && dataset.position !== position ) {
        if( config.showAllNotifications )
            showNotification( lecturere, position );
        else if( config.showQueueNotifications >= position )
            showNotification( lecturere, position );
    }
    dataset = { id: id, lecturer: lecturer, position: position, html: consultation };
}

const makeError = ( message ) => {
    if( !message )
        message = 'Could not connect';
    dataset = { error: message };
    console.log( 'Error: ' + message );
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
        title: 'Wachtrijupdate consult',
        message: message
    } );
}
