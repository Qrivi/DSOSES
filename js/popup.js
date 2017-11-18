let bg;

$( '.info' )
    .click( () => $( '.info' )
        .slideDown() );

$( '.link' )
    .click( function() {
        chrome.tabs.create( {
            url: $( this )
                .attr( 'data-link' )
        } );
    } );


const init = () => {
    bg = chrome.extension.getBackgroundPage();

    if( !bg.dataset || bg.dataset.error === "Could not connect" )
        $( 'article.error' )
        .show();
    else if( bg.dataset.error && bg.dataset.error === "Not logged in" )
        $( 'article.login' )
        .show();
    else if( bg.dataset.empty )
        $( 'article.empty' )
        .show();
}

init();
