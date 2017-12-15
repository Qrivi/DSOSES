let config;
let collapsed = [];

if( window.location.search.includes( 'unsubscribe=' ) )
    $( 'button.icon.trash' ).click();

chrome.runtime.sendMessage( { 'message': 'check_auth' } );
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
    if( config.autoRefresh )
        autoRefresh();
    if( !config.autoRefresh && config.enableMasonry )
        enableMasonry();
} );

const collapsibleTables = () => {
    $( 'head' ).append(
        '<style>article.table{overflow: hidden} .table-name{cursor: n-resize}' +
        '.table .lecturers-container img{height: 128px} .table > *{flex-shrink: 0}</style>' +
        '<style id="collapsed"></style>'
    );

    let size = 55; //compact
    if( config.collapsibleTables === 'default' ) {
        size += 40;
        if( !config.hideImages )
            size += 160;
    }

    $( 'main' ).on( 'click', '.consult-tables-container .table-name', function() {
        let table = 'article.table[data-consult-table-id="' + $( this ).parent().attr( 'data-consult-table-id' ) + '"]';

        if( collapsed.includes( table ) )
            collapsed = collapsed.filter( t => t !== table );
        else
            collapsed.push( table );

        let output = '';
        if( collapsed.length )
            output = collapsed.join() + '{max-height: ' + size + 'px !important}' +
            collapsed.map( t => t += ' .table-name' ).join() + '{cursor: s-resize !important}'

        $( '#collapsed' ).text( output );

        if( config.enableMasonry )
            enableMasonry();
    } );
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

    if( !source && config.enableMasonry )
        enableMasonry();

    return source;
}

const enableMasonry = () => {
    if( !$( '.masonry-gutter' ).length )
        $( '.consult-tables-container' )
        .append( '<div class="masonry-gutter" style="width:10%"></div>' )

    $( '.consult-tables-container' )
        .masonry( {
            gutter: '.masonry-gutter',
            percentPosition: true
        } );
}

const autoRefresh = () => {
    let img = chrome.extension.getURL( '/img/pulse.gif' );
    $( '.inline-header h1' )
        .text( $( '.inline-header h2' ).text() );
    $( '.inline-header' )
        .css( 'position', 'relative' )
        .append( '<img style="position:absolute;top:0;right:0;width:50px" src="' + img + '" title="Wachtrijen worden live bijgewerkt">' );
    $( '.consult-tables-container' )
        .removeClass( 'consult-tables-container' )
        .addClass( 'consult-tables-original' )
        .hide()
        .after( '<section class="consult-tables-container">&nbsp;</section>' );

    $( 'main' ).on( 'click', '.consult-tables-container button.icon.subscribe', function() {
        relinkHandler( this, 'subscribe' );
    } );
    $( 'main' ).on( 'click', '.consult-tables-container button.icon.trash', function() {
        relinkHandler( this, 'trash' );
    } );

    if( config.positionInTab )
        posToTitle();

    refreshData();
    setInterval( refreshData, config.refreshRate );
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

        if( $( '.consult-tables-container' ).attr( 'style' ) )
            $( '.consult-tables-container' ).masonry( 'destroy' );

        if( config.enableMasonry )
            enableMasonry();

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
        if( position )
            $( document ).attr( 'title', '(' + position + ') Devine SOS tool' );
        else
            $( document ).attr( 'title', 'Jouw beurt!' );
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
        m = '0' + m;
    if( s < 10 )
        s = '0' + s;

    $( '.inline-header h2' ).html( 'LAATST BIJGEWERKT OM ' + h + 'u' + m + '<small style="font-size:.69em"> ' + s + 's</small>' );
}

const relinkHandler = ( target, action ) => {
    let id = $( target ).closest( 'article.table' ).attr( 'data-consult-table-id' );
    $( '.consult-tables-original article.table[data-consult-table-id="' + id + '"] button.' + action ).click();
}
