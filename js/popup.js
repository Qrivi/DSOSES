const update = () => {
    console.log( 'going for it' );
    $( 'body' )
        .append( sessionStorage.getItem( 'sos_data' ) );
}

update();

//TODO session dus niet gedeeld. jammer. morgen alternatief schrijven
