/*
 * 
 * UI5Strap
 *
 * ListNavItem
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

	jQuery.sap.declare("ui5strap.ListNavItem");
	jQuery.sap.require("ui5strap.ListLinkItem");

	ui5strap.ListLinkItem.extend("ui5strap.ListNavItem", {
		metadata : {

			// ---- object ----
			defaultAggregation : "content",
			
			// ---- control specific ----
			library : "ui5strap",
			properties : { 
				badge : {
					type:"string",
					defaultValue : ""
				}
			}
		}
	});

}());