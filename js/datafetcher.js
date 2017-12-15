var dataset;
var url;
let user;
let run;
let pos;

var checkAuth = ( callback, forceStop ) => {
    if( navigator.onLine )
        $.get( 'https://sos.devine-tools.be/student/consulten', ( data ) => {
            console.log( 'Updating' );
            chrome.browserAction.setBadgeText( { text: '' } );
            let title = $( data ).filter( 'title' ).text();

            if( title === 'Devine SOS tool - login' )
                return makeError( 'Not logged in', callback );
            if( title !== 'Devine SOS tool - overzicht consulten' )
                return makeError( 'Something went wrong', callback );
            if( !user )
                $.get( 'https://sos.devine-tools.be/student/profiel', ( data ) => {
                    user = $( data )
                        .find( '.profile-container h1' )
                        .text()
                        .trim();
                    console.log( 'Fetched user: ', user );
                } );

            run = 0;
            dataset = { empty: true };

            if( forceStop ) {
                callback();
                return;
            }

            let links = $( data )
                .find( '.overview-table-container a' );
            if( links.length )
                links.each( function() {
                    fetchConsultation( this.href, callback );
                } );
            else if( callback )
                callback();
        } )
        .fail( () => {
            makeError( 'Could not connect', callback );
        } );
    else
        makeError( 'Offline', callback );
}

const fetchConsultation = ( href, callback ) => {
    console.log( 'Consultations found' );
    $.get( href, ( data ) => {
        let table, row;
        $( data ).find( '.registrations-container .registration > span' )
            .each( function() {
                row = $( this ).text();
                if( row.includes( user ) )
                    table = this.closest( 'article.table' );
            } );
        if( table )
            parseConsultation( href, table, row, callback );
        else if( callback )
            callback();
    } );
}

const parseConsultation = ( href, table, row, callback ) => {
    let lecturer = $( table )
        .find( '.table-name span' )
        .first()
        .text();
    let id = lecturer
        .replace( /\W/g, '' )
        .toLowerCase();
    let position = parseInt( row.substr( 0, row.indexOf( '.' ) ) ) - 1;

    dataset = { id: id, lecturer: lecturer, position: position, html: table };
    url = href;
    run++;

    console.log( 'Subscribed to: ' + lecturer );

    loadConfig( () => {
        if( config.showNotifications && dataset.position !== pos ) {
            pos = dataset.position;
            if( config.showAllNotifications )
                showNotification( lecturer, position );
            else if( parseInt( config.showQueueNotifications ) >= position )
                showNotification( lecturer, position );
        }
    } );

    if( callback )
        callback();

    if( position )
        chrome.browserAction.setBadgeText( { text: position.toString() } );
    else
        chrome.browserAction.setBadgeText( { text: 'GO!' } );

    if( run === 1 )
        setTimeout( checkAuth, config.refreshRate );
}

const makeError = ( message, callback ) => {
    dataset = { error: message };
    console.log( 'Error: ' + message );
    chrome.browserAction.setBadgeText( { text: '!' } );
    if( callback )
        callback();
}

const showNotification = ( lecturer, position ) => {
    let message = 'Er zijn nog ' + position + ' studenten voor je bij ' + lecturer + '.';
    if( position === 1 )
        message = 'Er is nog 1 iemand voor je bij ' + lecturer + '. Zet je schrap!';
    else if( position === 0 )
        message = 'Het is nu jouw beurt bij ' + lecturer + '! Veel succes!'

    if( config.notificationSound && config.notificationSound !== 'none' ) {
        let audio = new Audio( '../snd/' + config.notificationSound + '.mp3' );
        audio.play();
        audio.remove();
    }

    chrome.notifications.create( {
        type: 'basic',
        iconUrl: '../img/icon.png',
        title: 'Devine SOS',
        message: message
    } );
}
