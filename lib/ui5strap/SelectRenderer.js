/*
 * 
 * UI5Strap
 *
 * SelectRenderer
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

	jQuery.sap.declare("ui5strap.SelectRenderer");

	ui5strap.SelectRenderer = {};

	ui5strap.SelectRenderer.render = function(rm, oControl) {
		var size = oControl.getSize(),
			items = oControl.getItems();

		rm.write("<select");
		
		rm.writeControlData(oControl);
		rm.addClass('form-control');
		if(oControl.getDisabled()){
			rm.writeAttribute('disabled', 'disabled');
		}
		if(ui5strap.Size.Default !== size){
			rm.addClass('input-' + ui5strap.BSSize[size]);
		}
		rm.writeClasses();
		rm.write(">");

		for(var i = 0; i < items.length; i++){
			this.renderOption(rm, oControl, items[i]);
		}

		rm.write("</select>");
		if(oControl.getTrailingSpace()){
			rm.write(' ');
		}
	};

	ui5strap.SelectRenderer.renderOption = function(rm, oControl, item) {
		var itemValue = item.getValue();

			rm.write("<option");
			rm.writeAttribute("value", itemValue);
			if(oControl.getValue() === itemValue){
				rm.writeAttribute("selected", "selected");
			}
			rm.write(">");
			rm.writeEscaped(item.getText());
			rm.write("</option>");
	};

}());