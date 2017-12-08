let config;
let loaded;

chrome.storage.sync.get( 'sosconfig', ( obj ) => {
    config = obj.sosconfig;

    $( '#showNotifications' )
        .prop( 'checked', config.showNotifications )
        .trigger( 'change' );

    $( '#showAllNotifications' )
        .prop( 'checked', config.showAllNotifications )
        .trigger( 'change' );

    $( '#showQueueNotifications' )
        .prop( 'checked', !config.showAllNotifications )
        .trigger( 'change' );

    $( '#showQueueNotifications_val' )
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

    $( '#collapsibleTables' )
        .prop( 'checked', config.collapsibleTables )
        .trigger( 'change' );

    loaded = true;
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
            .attr( 'class', $( '#hideImages' ).is( ':checked' ) ? 'ok' : 'disabled' );
    } );

$( '#showNotifications' )
    .change( function() {
        if( $( this ).is( ':checked' ) )
            $( '#notifications' ).slideDown( 200 );
        else
            $( '#notifications' ).slideUp( 200 );
    } );

$( '#showQueueNotifications_val' )
    .focus( () => {
        $( '#showQueueNotifications' )
            .prop( 'checked', true )
            .trigger( 'change' );
    } )
    .on( 'input', () => {
        let val = parseInt( $( '#showQueueNotifications_val' ).val() );
        if( isNaN( val ) || val < 0 || val > 25 )
            val = 3;
        $( '#showQueueNotifications_val' ).val( val );
        config.showQueueNotifications = val;
        save();
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
        .addClass( $( button ).is( ':checked' ) ? 'on' : 'off' );

    let id = $( button ).attr( 'id' );

    if( id === 'showQueueNotifications' )
        config.showQueueNotifications = $( '#showQueueNotifications_val' ).val();
    else if( id === 'moreColumns' || id === 'collapsibleTables' )
        toggleDropdown( id, $( button ).is( ':checked' ) );
    else
        config[ id ] = $( button ).is( ':checked' );

    if( loaded ) {
        //console.log( id, $( button ).is( ':checked' ) );
        save();
    }
}

const toggleDropdown = ( id, checked ) => {
    if( checked ) {
        $( '#' + id + '_val' ).fadeIn();
        config[ id ] = $( '#' + id + '_val' ).val();
    } else {
        $( '#' + id + '_val' ).fadeOut();
        config[ id ] = false;
    }
}

const save = () => {
    chrome.storage.sync.set( {
        'sosconfig': config
    } );
}
