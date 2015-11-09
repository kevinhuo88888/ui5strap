/*
 * 
 * UI5Strap
 *
 * ui5strap.ParagraphRenderer
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

	jQuery.sap.declare("ui5strap.ParagraphRenderer");

	ui5strap.ParagraphRenderer = {};

	ui5strap.ParagraphRenderer.render = function(rm, oControl) {
		var content = oControl.getContent(),
			severity = oControl.getSeverity(),
			text = oControl.getText(),
			parse = oControl.getParse(),
			textAlign = oControl.getTextAlign();

		if(parse){
			text = ui5strap.RenderUtils.parseText(text);
		}

		rm.write("<p");
		
		rm.writeControlData(oControl);
		if(oControl.getFormStatic()){
			rm.addClass('form-control-static');
		}
		if(ui5strap.Severity.None !== severity){
			rm.addClass("text-" + ui5strap.BSSeverity[severity]);
		}
		if(ui5strap.TextAlignment.Default !== textAlign){
			rm.addClass("ui5strap-text-align-" + textAlign.toLowerCase());
		}
		rm.writeClasses();
		rm.write(">");
		
		ui5strap.RenderUtils.renderContent(rm, oControl, text, parse);
		
		rm.write("</p>");
	};

}());
