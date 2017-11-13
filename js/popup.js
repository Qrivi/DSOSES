var sosdata = {};

function checkAuth() {
    $.get( 'https://sos.devine-tools.be/student/consulten', function( data ) {
            var consultations = [];
            var title = $( data )
                .filter( 'title' )
                .text();

            sosdata[ name ] = '';
            sosdata[ consultations ] = {};

            if( title === 'Devine SOS tool - login' )
                return createError( 'Not logged in' );
            if( title !== 'Devine SOS tool - overzicht consulten' )
                return createError( 'Something went wrong' );
            if( !sosdata.name )
                $.get( 'https://sos.devine-tools.be/student/profiel', function( data ) {
                    sosdata.name = $( data )
                        .find( '.profile-container h1' )
                        .text();
                } );

            $( data )
                .find( '.overview-table-container a' )
                .each( function() {
                    fetchConsultation( this.href );
                } );
        } )
        .fail( createError );
}

function fetchConsultation( href ) {
    $.get( href, function( data ) {
        $( data )
            .find( '.registrations-container' ) // todo go deeper
            .each( function() {
                if( this.text() === name )
                    parseConsultation( this.closest( 'article.table' ) );
            } );
    } );
}

function parseConsultation( consultation ) {
    // kan je op meerdere conslts tegelijk inschrijven 
    // - op zelfde moment
    // - op ander moment?
}

function createError( message ) {
    if( !message )
        message = 'Could not connect';
    sosdata = { error: message };
    //todo push sosdata
}

document.getElementById( 'btn' )
    .addEventListener( 'click', checkAuth );
