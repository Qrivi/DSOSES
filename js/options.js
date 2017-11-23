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
        .val( 'checked', config.showQueueNotifications );

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
        .fadeOut();
} );

$( '.disabled' )
    .click( () => false );

$( 'select' )
    .change( () => {
        const txt = $( 'select option:selected' )
            .text();

        if( txt === 'uit' )
            $( '.dropdown' )
            .attr( 'class', 'dropdown off' );
        else
            $( '.dropdown' )
            .attr( 'class', 'dropdown on' );

        $( '.dropdown span' )
            .text( txt );

        return false;
    } );

$( '#collapsibleTables' )
    .click( () => {
        $( 'select option:selected' )
            .prop( 'selected', false )
            .next()
            .prop( 'selected', true );

        $( 'select' )
            .trigger( 'change' );

        return false;
    } );

$( 'input[type=number]' )
    .focus( () => {
        $( '#showQueueNotifications' )
            .prop( 'checked', true )
            .trigger( 'change' );
    } );

$( 'input[type=checkbox], input[type=radio]' )
    .change( function() {
        if( $( this )
            .attr( 'type' ) === 'radio' )
            $( '.bullet' )
            .attr( 'class', 'bullet unchecked' );
        $( this )
            .parent()
            .removeClass( 'checked unchecked' )
            .addClass( $( this )
                .is( ':checked' ) ? 'checked' : 'unchecked' );
    } );

const checkAndSync = () => {
    console.log( 'syncing' )
}
