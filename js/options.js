let config;

chrome.storage.sync.get( 'sosconfig', ( obj ) => {
    config = obj.sosconfig;

    $( '#showNotifications' )
        .prop( 'checked', config.showNotifications )
        .trigger( 'change' );

    $( '#showAllNotifications' )
        .prop( 'checked', config.showNotifications )
        .trigger( 'change' );

    $( '#showQueueNotifications' )
        .prop( 'checked', !config.showNotifications )
        .trigger( 'change' );

    $( '#queue' )
        .val( config.showQueueNotifications );

    $( '#autoRefresh' )
        .prop( 'checked', config.autoRefresh )
        .trigger( 'change' );

    $( '#hideImages' )
        .prop( 'checked', config.hideImages )
        .trigger( 'change' );

    $( '#fixImages' )
        .prop( 'checked', config.fixImages )
        .trigger( 'change' );

    $( '#enableMasonry' )
        .prop( 'checked', config.enableMasonry )
        .trigger( 'change' );

    $( '#moreColumns' )
        .prop( 'checked', config.moreColumns )
        .trigger( 'change' );


    $( '.loading' )
        .delay( 500 )
        .fadeOut( 500 );
} );

$( 'main' )
    .on( 'click hover mouseover focus', '.disabled', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    } );

$( '#hideImages' )
    .change( () => {
        $( '#fixImages' )
            .parent()
            .attr( 'class', $( '#hideImages' )
                .is( ':checked' ) ? 'ok' : 'disabled' );
    } );

$( '#showNotifications' )
    .change( function() {
        if( $( this ).is( ':checked' ) )
            $( '#notifications' ).slideDown( 200 );
        else
            $( '#notifications' ).slideUp( 200 );
    } );

$( '#queue' )
    .focus( () => {
        $( '#showQueueNotifications' )
            .prop( 'checked', true )
            .trigger( 'change' );
    } )
    .on( 'input', () => {
        let val = parseInt( $( '#queue' ).val() );
        if( isNaN( val ) || val < 0 || val > 25 )
            val = 3;
        $( '#queue' ).val( val );
    } );

$( 'input[type=checkbox], input[type=radio]' )
    .change( function() {
        if( $( this ).attr( 'type' ) === 'radio' )
            $( this )
            .siblings( '[type=radio]' )
            .each( function() {
                toggle( this );
            } );
        toggle( this );
    } );

const toggle = ( button ) => {
    $( button )
        .next( 'label' )
        .removeClass( 'on off' )
        .addClass( $( button )
            .is( ':checked' ) ? 'on' : 'off' );
}

const checkAndSync = () => {
    console.log( 'syncing' )
}
