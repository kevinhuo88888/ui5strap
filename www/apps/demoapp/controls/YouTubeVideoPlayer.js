sap.ui.define(['ui5strap/ControlBase'], function(ControlBase){

    "use strict";
    
	//Define the Constructor
    var YouTubeVideoPlayer = ControlBase.extend("ui5strap.demoapp.controls.YouTubeVideoPlayer", {
    
        metadata : {

            library : "tld.mydomain.myapp",
      
            properties : {
            	youTubeId : {
            		type : "string"
            	},
            	
            	width : {
            		type : "int",
            		defaultValue : 640
            	},
            	
            	height : {
            		type : "int",
            		defaultValue : 480
            	}
            	
            },
      
            aggregations : {},
            
            events : {}

        }
    }),
    YouTubeVideoPlayerProto = YouTubeVideoPlayer.prototype;

    YouTubeVideoPlayerProto._getStyleClassPrefix = function(){
        //You should specifiy a really unique prefix here.
        return "ytplayer";
    };
    
    //return Constructor
    return YouTubeVideoPlayer;

});