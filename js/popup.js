let bg;

$( '[data-link]' )
    .click( function() {
        chrome.tabs.create( {
            url: $( this ).attr( 'data-link' )
        } );
    } );

$( '.info' )
    .click( () => $( '.info' ).slideDown() );

$( '#options' )
    .click( () => chrome.runtime.openOptionsPage() );

$( '#pause' )
    .click( () => {
        $( '#pause' ).addClass( 'busy' );
        $( 'article' ).hide();
        $( 'article.loading' ).show();
        setTimeout(
            () => bg.checkAuth( init ),
            2000
        );
    } );

$( '#play' )
    .click( () => {
        $( '#play' ).addClass( 'busy' );
        $( 'article' ).hide();
        $( 'article.loading' ).show();
        bg.checkAuth( init, true );
    } );

const update = () => {
    $( 'article.table' ).remove();
    $( '#play, #pause' ).removeClass( 'busy' );
    $( 'article, #play, #pause' ).hide();
    if( !bg || !bg.dataset ) {
        $( 'article.error' ).show();
        return;
    }

    if( bg.dataset.error && bg.dataset.error === "Not logged in" ) {
        $( 'article.login' ).show();
    } else if( bg.dataset.empty ) {
        $( '#pause' ).show();
        $( 'article.empty' ).show();
    } else if( bg.dataset.html ) {
        $( '#play' ).show();
        $( 'main' ).append( bg.dataset.html );
    } else {
        $( 'article.error' ).show();
    }
}

const init = () => {
    bg = chrome.extension.getBackgroundPage();
    update();
}

init();
