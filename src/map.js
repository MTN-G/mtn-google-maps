import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { MAP_KEY } from './secret'

function Map ({markerPosition, showMarker, clientClick, handleClick}) {

    console.log(markerPosition)

    const defaultCenter = { lat: 31.45, lng: 35 }


    const InitMap = withScriptjs (withGoogleMap (props  => 
        <GoogleMap
            defaultZoom={7.4}
            defaultCenter={defaultCenter}
            onClick={(e)=>handleClick(e)}
            options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    styles: [{
                        featureType: "all",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                        width: '700px'
                    }]
              }}>
            {showMarker && <Marker position={props.marker}/>}
            <Marker position={clientClick} icon='http://maps.google.com/mapfiles/ms/icons/green-dot.png'/>
        </GoogleMap>
    ))   


    return (
        <InitMap 
        marker={markerPosition}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}`}
        loadingElement={<div style={{ height: `100%` }}/>}
        containerElement={<div/>}
        mapElement={<div style={{ minHeight: `550px`, minWidth: '300px', borderColor: 'transparent', borderRadius: '5%'}} />}
        />
    )  
}

export default Map
