var config = {
    refreshRate: 12345,
    showNotifications: true,
    showAllNotifications: false,
    showQueueNotifications: 3,
    autoRefresh: true,
    positionInTab: false,
    hideImages: false,
    fixImages: true,
    enableMasonry: true,
    moreColumns: false, //false, always, smart
    collapsibleTables: false //false, default, compact
};

const saveConfig = ( callback ) => {
    console.log( 'Saving configuration' );
    console.log( config );
    chrome.storage.sync.set( {
        'sosconfig': config
    }, callback );
}

const loadConfig = ( callback ) => {
    chrome.storage.sync.get( 'sosconfig', ( obj ) => {
        if( obj.sosconfig ) {
            Object.keys( obj.sosconfig )
                .forEach( ( key ) => {
                    config[ key ] = obj.sosconfig[ key ];
                } );
        }
        if( callback ) callback();
        //    saveConfig( callback );
    } );
}
