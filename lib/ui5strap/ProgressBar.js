/*
 * 
 * UI5Strap
 *
 * Progress bar
 * 
 * Author: Jan Philipp Knöller
 * 
 * Copyright (c) 2013 Jan Philipp Knöller
 * 
 * http://pksoftware.de
 *
 * Get the latest version: https://github.com/pks5/ui5strap
 * 
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */

(function(){

	jQuery.sap.declare("ui5strap.ProgressBar");
	jQuery.sap.require("ui5strap.library");
	
	sap.ui.core.Control.extend("ui5strap.ProgressBar", {
		metadata : {

			// ---- object ----
			defaultAggregation : "content",
			
			// ---- control specific ----
			library : "ui5strap",

			properties : { 
				value : {
					type:"int", 
					defaultValue:0
				}, 
				minValue : {
					type:"int", 
					defaultValue:0
				},
				maxValue : {
					type:"int", 
					defaultValue:100
				},  
				severity : {
					type:"ui5strap.Severity", 
					defaultValue:ui5strap.Severity.None
				},
				labelFormat : {
					type:"string", 
					defaultValue:""
				}
			}
		}
	});

}());