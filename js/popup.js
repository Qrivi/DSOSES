let user;
let consultations = {};

const checkAuth = () => {
    $.get( 'https://sos.devine-tools.be/student/consulten', function( data ) {
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

            fetchConsultation( 'http://sandbox.krivi.be/sos/' ); //TODO remove hier en in manifest
            $( data )
                .find( '.overview-table-container a' )
                .each( function() {
                    fetchConsultation( this.href );
                } );
        } )
        .fail( createError );
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
    let lecturer = $( consultation )
        .find( '.table-name span' )
        .first()
        .text();
    let id = lecturer
        .replace( /\W/g, '' )
        .toLowerCase();
    let position = parseInt( row.substr( 0, row.indexOf( '.' ) ) ) - 1;

    consultations[ id ] = { id: id, lecturer: lecturer position: position, html: consultation };
    // eerst kijken of consultation al bestaat, zodat er melding gegeven kan worden als user plaatsje stijgt
}

const createError = ( message ) => {
    if( !message )
        message = 'Could not connect';
    consultations = { error: message };
}

document.getElementById( 'btn' )
    .addEventListener( 'click', checkAuth );
document.getElementById( 'btn2' )
    .addEventListener( 'click', () => console.log( consultations ) );
