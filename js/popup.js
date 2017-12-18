let bg;

$( '[data-link]' )
    .click( function() {
        chrome.tabs.create( {
            url: $( this ).attr( 'data-link' )
        } );
    } );

$( '.info' )
    .click( function() {
        $( '.info' ).slideDown();
    } );

$( '#options' )
    .click( function() {
        chrome.runtime.openOptionsPage();
    } );

$( '#play, #pause' )
    .click( function() {
        if( !$( '#play, #pause' ).hasClass( 'busy' ) ) {
            $( '#play, #pause' ).addClass( 'busy' );
            $( 'article' ).hide();
            $( '#play, #pause, article.loading' ).show();
            $( this ).hide();
            setTimeout(
                () => bg.checkAuth( init ),
                2000
            );
        }
    } );

$( 'body' ).on( 'click', 'button.icon.trash', function() {
    chrome.tabs.create( { url: bg.dataset.href + '?unsubscribe=' + $( this ).attr( 'data-registration-id' ) } );
} );

const update = () => {
    $( 'article.table' ).remove();
    $( '#play, #pause' ).removeClass( 'busy' );
    $( '#play, #pause, article' ).hide();
    if( !bg || !bg.dataset ) {
        $( 'article.error' ).show();
        return;
    }

    if( bg.dataset.error && bg.dataset.error === "Offline" ) {
        $( '#pause' ).show();
        $( 'article.offline' ).show();
    } else if( bg.dataset.error && bg.dataset.error === "Not logged in" ) {
        $( 'article.login' ).show();
    } else if( bg.dataset.empty ) {
        $( '#pause' ).show();
        $( 'article.empty' ).show();
    } else if( bg.dataset.html ) {
        $( '#play' ).show();
        $( 'main' ).append( processImages( bg.dataset.html ) );
    } else {
        $( '#pause' ).show();
        $( 'article.error' ).show();
    }
}

const processImages = ( source ) => {
    output = $( source ).clone();

    if( bg.config.hideImages )
        output.find( '.lecturers-container' ).hide();
    else
        output.find( '.lecturers-container img' ).each( function() {
            if( bg.config.fixImages && $( this ).attr( 'src' ) === '/images/lecturers/' ) {
                let no = $( this ).attr( 'alt' ).length;
                while( no > 9 )
                    no = Math.floor( no / 2 - 1 );
                $( this ).attr( 'src', 'https://sos.devine-tools.be/images/students/dummy-' + no + '.png' );
            } else {
                $( this ).attr( 'src', 'https://sos.devine-tools.be' + $( this ).attr( 'src' ) );
            }
        } );

    return output;
}

const init = () => {
    bg = chrome.extension.getBackgroundPage();
    update();
}

init();
