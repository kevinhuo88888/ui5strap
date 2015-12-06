/*
 * 
 * UI5Strap
 *
 * ui5strap.NavRenderer
 * 
 * @author Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Homepage: http://ui5strap.com
 *
 * Copyright (c) 2013-2014 Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */

(function(){

jQuery.sap.declare("ui5strap.NavRenderer");

ui5strap.NavRenderer = {
	typeToClass : {
		Default : "nav-default",
		Tabs : "nav-tabs",
		Pills : "nav-pills",
		PillsStacked : "nav-pills nav-stacked",
		PillsJustified : "nav-pills nav-justified",
		TabsJustified : "nav-tabs nav-justified"
	}

};

ui5strap.NavRenderer.render = function(rm, oControl) {
	var type = oControl.getType(),
		items = oControl.getItems();

	rm.write("<ul");
	
	rm.writeControlData(oControl);

	rm.addClass('nav');
	rm.addClass(this.typeToClass[type]);
	
	ui5strap.RenderUtils.alignment(rm, oControl, 'navbar-nav', 'sidebar-nav');

	rm.writeClasses();
	
	rm.write(">");
	
	for(var i = 0; i < items.length; i++){
		rm.renderControl(items[i]);
	}
	
	rm.write("</ul>");
};

}());
