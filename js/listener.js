let action = '';

$( '.registration button.trash' )
    .on( 'click', () => { action = 'uitschrijven' } );

$( '.details button.subscribe' )
    .on( 'click', () => { action = 'inschrijven' } );

$( '.sa-confirm-button-container button.confirm' )
    .on( 'click', () => {
            if( action )
                chrome.runtime.sendMessage( { "message": "perform_action", "action": action } );
        }
    } );
