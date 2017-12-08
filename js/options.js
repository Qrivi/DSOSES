let loaded;

const init = () => {
    $( '#showQueueNotifications_val' )
        .val( config.showQueueNotifications );
    if( config.moreColumns )
        $( '#moreColumns_val' ).val( config.moreColumns );
    if( config.collapsibleTables )
        $( '#collapsibleTables_val' ).val( config.collapsibleTables );

    $( '#showNotifications' )
        .prop( 'checked', config.showNotifications )
        .trigger( 'change' );

    $( '#showAllNotifications' )
        .prop( 'checked', config.showAllNotifications )
        .trigger( 'change' );

    $( '#showQueueNotifications' )
        .prop( 'checked', !config.showAllNotifications )
        .trigger( 'change' );

    $( '#autoRefresh' )
        .prop( 'checked', config.autoRefresh )
        .trigger( 'change' );

    $( '#positionInTab' )
        .prop( 'checked', config.positionInTab )
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
};

$( document ).keyup( function( e ) {
    if( e.keyCode === 27 ) window.close();
} );

$( 'main' )
    .on( 'click hover mouseover focus', '.disabled', function( e ) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    } )
    .on( 'change', '#hideImages', function() {
        $( '#fixImages' )
            .parent()
            .attr( 'class', $( this ).is( ':checked' ) ? 'disabled' : '' );
    } )
    .on( 'change', '#autoRefresh', function() {
        $( '#positionInTab' )
            .parent()
            .attr( 'class', $( this ).is( ':checked' ) ? '' : 'disabled' );
    } )
    .on( 'change', '#showNotifications', function() {
        if( $( this ).is( ':checked' ) )
            $( '#notifications' ).slideDown( 200 );
        else
            $( '#notifications' ).slideUp( 200 );
    } )
    .on( 'focus', '#showQueueNotifications_val', function() {
        $( '#showQueueNotifications' )
            .prop( 'checked', true )
            .trigger( 'change' );
    } )
    .on( 'input', '#showQueueNotifications_val', function() {
        let val = parseInt( $( this ).val() );
        if( isNaN( val ) || val < 0 || val > 25 )
            val = 3;
        $( this ).val( val );
        config.showQueueNotifications = val;
        saveConfig();
    } )
    .on( 'change', 'input[type=checkbox], input[type=radio]', function() {
        if( $( this ).attr( 'type' ) === 'radio' )
            $( this )
            .siblings( '[type=radio]' )
            .each( function() {
                toggle( this );
            } );
        toggle( this );
    } )
    .on( 'change', 'select', function() {
        let id = $( this ).attr( 'id' );
        id = id.substring( 0, id.length - 4 );
        config[ id ] = $( this ).val();
        saveConfig();
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

    if( loaded )
        saveConfig();
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

loadConfig( init );
