/*
 * 
 * UI5Strap
 *
 * Popover Renderer
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

	jQuery.sap.declare("ui5strap.PopoverRenderer");

	ui5strap.PopoverRenderer = {};

	ui5strap.PopoverRenderer.render = function(rm, oControl) {
		var content = oControl.getContent(),
			contentLength = content.length,
			titleContent = oControl.getTitleContent(),
			titleContentLength = titleContent.length,
			title = oControl.getTitle();

		rm.write("<div");
		rm.writeControlData(oControl);
		rm.writeAttribute("style", "display:none;");
		rm.addClass("popover-data");
		rm.writeClasses();
		rm.write(">");

		rm.write("<div");
			   
		rm.addClass("popover-data-title");
		rm.writeClasses();
		rm.write(">");

		if(title !== ''){
			rm.writeEscaped(title);
		}
		
		for(var i = 0; i < titleContentLength; i++){
			rm.renderControl(titleContent[i]);
		}

		rm.write("</div>");


		rm.write("<div");
		  
		rm.addClass("popover-data-content");
		rm.writeClasses();
		rm.write(">");

		for(var i = 0; i < contentLength; i++){
			rm.renderControl(content[i]);
		}
		
		rm.write("</div>");

		rm.write("</div>");
		    
	};

}());