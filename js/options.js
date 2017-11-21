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
