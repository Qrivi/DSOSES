let action;
let config;

chrome.storage.sync.get( 'sosconfig', ( obj ) => {
    config = obj.sosconfig;

    if( config.fixImages )
        fixImages();
    if( config.moreColumns )
        addColumns();
    if( config.masonry )
        setTimeout( enableMasonry, 500 );
    if( config.autoRefresh ) {
        setNewTime();
        setInterval( refreshData, config.refreshRate );
        $( '.inline-header h1' )
            .text( 'OVERZICHT TAFELS' );
        $( '.inline-header' )
            .css( 'position', 'relative' )
            .append( '<img style="position:absolute;top:0;right:0;width:50px" src="https://i.imgur.com/rBWlNPX.gif" title="Wachtrijen worden live bijgewerkt">' )
    }
} );

$( '.registration button.trash' )
    .on( 'click', () => { action = 'uitschrijven' } );

$( '.details button.subscribe' )
    .on( 'click', () => { action = 'inschrijven' } );

$( '.sa-confirm-button-container button.confirm' )
    .on( 'click', () => {
        chrome.runtime.sendMessage( { "message": "perform_action", "action": action } );
    } );

const addColumns = () => {
    $( 'head' )
        .append( '<style>@media (min-width: 1550px) and (max-width: 5555px){.masonry-gutter{width:5% !important}}</style>' )
        .append( '<style>@media (min-width: 1550px) and (max-width: 1899px){.consult-tables-container .table{width:30%}}</style>' )
        .append( '<style>@media (min-width: 1900px) and (max-width: 2999px){.consult-tables-container .table{width:calc(85% / 4)}}</style>' )
        .append( '<style>@media (min-width: 3000px) and (max-width: 5555px){.consult-tables-container .table{width:16%}}</style>' );
}

const fixImages = ( source ) => {
    if( !source )
        source = $( '.consult-tables-container' );

    source.find( 'img' )
        .each( function() {
            if( $( this )
                .attr( 'src' ) === './DevineSOStool-registreer_files/saved_resource' ) {
                let no = $( this )
                    .attr( 'alt' )
                    .length;
                while( no > 9 )
                    no = Math.floor( no / 2 - 1 );
                $( this )
                    .attr( 'src', 'https://sos.devine-tools.be/images/students/dummy-' + no + '.png' );
            }
        } );

    return source;
}

const enableMasonry = () => {
    $( '.consult-tables-container' )
        .append( '<div class="masonry-gutter" style="width:10%"></div>' )
        .masonry( {
            gutter: '.masonry-gutter',
            percentPosition: true
        } );
}

const refreshData = () => {
    $.get( window.location.href, ( data ) => {
        let newTables = $( data )
            .find( '.consult-tables-container' );
        if( config.fixImages )
            newTables = fixImages( newTables );

        $( '.consult-tables-container' )
            .empty()
            .append( newTables.children() );

        if( config.masonry ) {
            $( '.consult-tables-container' )
                .masonry( 'destroy' );
            enableMasonry();
        }
        setNewTime();
    } );
}

const setNewTime = () => {
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    if( m < 10 )
        m = "0" + m;
    if( s < 10 )
        s = "0" + s;

    $( '.inline-header h2' )
        .html( 'LAATST BIJGEWERKT OM ' + h + 'u' + m + '<small style="font-size:.69em"> ' + s + 's</small>' );
}
