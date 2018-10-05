(function(utils){
    'use strict';
    if(!utils){
        window.utils = utils || appUtils();
    }
    
    

    function appUtils(){
        return {
            isEmpty:(val)=>{
                return (val === undefined || val === null || val.length === 0 || val==='null' || (val && Object.keys(val).length ===0));
            },
            capitalizeFirstLetter:(val) => {
                return val.charAt(0).toUpperCase() + val.slice(1);
            },
            formToObject:(elem) => {
                var current, entries, item, key, output, value;
                output = {};
                entries = new FormData( elem ).entries();
                // Iterate over values, and assign to item.
                while ( item = entries.next().value )
                    {
                    // assign to variables to make the code more readable.
                    key = item[0];
                    value = item[1];
                    // Check if key already exist
                    if (Object.prototype.hasOwnProperty.call( output, key)) {
                        current = output[ key ];
                        if ( !Array.isArray( current ) ) {
                        // If it's not an array, convert it to an array.
                        current = output[ key ] = [ current ];
                        }
                        current.push( value ); // Add the new value to the array.
                    } else {
                        output[ key ] = value;
                    }
                    }
                    return output;
            }
        }
    }

})(window.utils);