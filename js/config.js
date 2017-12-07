let config = {
    refreshRate: 12345,
    showNotifications: true,
    showAllNotifications: false,
    showQueueNotifications: 3,
    autoRefresh: true,
    hideImages: false,
    fixImages: true,
    enableMasonry: true,
    moreColumns: 'disabled', //disabled, always, smart
    collapsibleTables: 'disabled', //disabled, default, compact
};

const saveConfig = () => {
    console.log( 'Saving configuration' );
    console.log( config );
    chrome.storage.sync.set( {
        'sosconfig': config
    } );
}

const loadConfig = () => {
    chrome.storage.sync.get( 'sosconfig', ( obj ) => {
        if( obj.sosconfig ) {
            Object.keys( obj.sosconfig )
                .forEach( ( key ) => {
                    config[ key ] = obj.sosconfig[ key ];
                } );
        }
        saveConfig();
    } );
}
