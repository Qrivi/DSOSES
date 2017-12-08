let action;
let config;
let collapsed = [];

chrome.storage.sync.get( 'sosconfig', ( obj ) => {
    config = obj.sosconfig;
    console.log( 'Loaded configuration' );
    console.log( config );

    if( config.hideImages )
        hideImages();
    if( !config.hideImages && config.fixImages )
        fixImages();
    if( config.moreColumns )
        addColumns();
    if( config.collapsibleTables )
        collapsibleTables();
    if( config.enableMasonry )
        setTimeout( enableMasonry, 500 ); // better: wait till images/fixImages() are loaded/ready
    if( config.autoRefresh ) {
        $( '.inline-header h1' )
            .text( $( '.inline-header h2' ).text() );
        $( '.inline-header' )
            .css( 'position', 'relative' )
            .append( '<img style="position:absolute;top:0;right:0;width:50px" src="https://i.imgur.com/rBWlNPX.gif" title="Wachtrijen worden live bijgewerkt">' );
        setInterval( refreshData, config.refreshRate );
        if( config.positionInTab )
            posToTitle();
        setNewTime();
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

const collapsibleTables = () => {
    console.log( 'collapsibleTables ar coming' );
}

const addColumns = () => {
    let columns = 5;
    if( config.moreColumns === 'smart' )
        columns = $( 'article.table' ).length;

    let css = '<style>@media (min-width: 1550px) and (max-width: 5555px){.masonry-gutter{width:5% !important}}';
    if( columns > 4 )
        css += '@media (min-width: 3000px) and (max-width: 5555px){.consult-tables-container .table{width:16%}}';
    if( columns > 3 )
        css += '@media (min-width: 1900px) and (max-width: 2999px){.consult-tables-container .table{width:calc(85% / 4)}}';
    if( columns > 2 )
        css += '@media (min-width: 1550px) and (max-width: 1899px){.consult-tables-container .table{width:30%}}';

    css += '</style>';
    $( 'head' )
        .append( css );
}

const hideImages = () => {
    $( 'head' ).append( '<style>article.table .lecturers-container{display:none !important}</style>' );
}

const fixImages = ( source ) => {
    if( !source )
        source = $( '.consult-tables-container' );

    source.find( 'img' ).each( function() {
        if( $( this ).attr( 'src' ) === '/images/lecturers/' ) {
            let no = $( this ).attr( 'alt' ).length;
            while( no > 9 )
                no = Math.floor( no / 2 - 1 );
            $( this ).attr( 'src', 'https://sos.devine-tools.be/images/students/dummy-' + no + '.png' );
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
    const position = $( window ).scrollTop();

    $.get( window.location.href, ( data ) => {
        let newTables = $( data ).find( '.consult-tables-container' );

        if( !config.hideImages && config.fixImages )
            newTables = fixImages( newTables );

        if( config.positionInTab )
            posToTitle( newTables );

        $( '.consult-tables-container' )
            .empty()
            .append( newTables.children() );

        if( config.enableMasonry ) {
            $( '.consult-tables-container' ).masonry( 'destroy' );
            enableMasonry();
        }

        $( window ).scrollTop( position );
        setNewTime();
    } );
}

const posToTitle = ( source ) => {
    if( !source )
        source = $( '.consult-tables-container' );

    let row = $( source )
        .find( 'button.icon.trash' )
        .siblings( 'span' )
        .first()
        .text();

    if( row ) {
        let position = parseInt( row.substr( 0, row.indexOf( '.' ) ) ) - 1;
        if( !position )
            position = 'GO!';
        $( document ).attr( 'title', '(' + position + ') Devine SOS tool' );
    } else {
        $( document ).attr( 'title', 'Devine SOS tool - registreer' );
    }
}

const setNewTime = () => {
    const d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    if( m < 10 )
        m = "0" + m;
    if( s < 10 )
        s = "0" + s;

    $( '.inline-header h2' ).html( 'LAATST BIJGEWERKT OM ' + h + 'u' + m + '<small style="font-size:.69em"> ' + s + 's</small>' );
}
