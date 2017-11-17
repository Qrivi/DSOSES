let config = {
    enabled: false,
    refreshRate: 10000,
    showNotifications: true,
    showAllNotifications: false,
    showQueueNotification: 3
};

const saveConfig = () => {
    chrome.storage.sync.set( {
        'sos_config': config
    } );
}

const loadConfig = () => {
    chrome.storage.sync.get( 'sos_config', ( obj ) => {
        if( obj )
            Object.keys( obj )
            .forEach( ( key ) => config[ key ] = obj.key );
    } );
}
