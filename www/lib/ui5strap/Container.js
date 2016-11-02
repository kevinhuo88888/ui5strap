/*
 * 
 * UI5Strap
 *
 * ui5strap.Container
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

sap.ui.define(['./library', './ControlBase', './BaseSupport'], function(library, ControlBase, BaseSupport){

	var _meta = {

		library : "ui5strap",
		
		properties : { 
				type : {
					type:"ui5strap.ContainerType", 
					defaultValue: ui5strap.ContainerType.Default
				},
				
				severity : {
					type: "ui5strap.Severity", 
					defaultValue: ui5strap.Severity.None
				},
				
				html : {
					type : "string",
					defaultValue : ""
				},
				
				fullHeight : {
					type : "boolean",
					defaultValue : false
				},
				
				//@deprecated
				visibility : {
					deprecated : true,
					type : "ui5strap.Visibility",
					defaultValue : ui5strap.Visibility.Default
				}
		},
		
		aggregations : { 
			content : {
				singularName: "content"
			}
		},
		
		defaultAggregation : "content"
		
	};
	
	var Container = ControlBase.extend("ui5strap.Container", {
		metadata : _meta,
		
		renderer : function(rm, oControl) {
			var content = oControl.getContent(),
				html = oControl.getHtml();

			rm.write("<div");
			rm.writeControlData(oControl);
			rm.addClass(oControl._getStyleClass());
			rm.writeClasses();
			rm.write(">");
			
			//Render plain HTML
			html && rm.write(html);
			
			//Render Content
			for(var i = 0; i < content.length; i++){ 
				rm.renderControl(content[i]);
			}
			
			rm.write("</div>");
		}
	}),
	ContainerProto = Container.prototype;
	
	ContainerProto._typeData = {
		Default : {
			className : ""
		},
		
		//Bootstrap Components
		Fluid : {
			className : "container-fluid"
		},
		Website : {
			className : "container"
		},
		Jumbotron : {
			className : "jumbotron"
		},
		Well : {
			className : "well"
		},
		WellLarge : {
			className : "well well-lg"
		},
		PageHeader : {
			className : "page-header"
		},
		
		//Deprecated
		FluidInset : {
			tagName : "div",
			className : "container-fluid"
		}
	};
	
	/**
	 * @Protected
	 * @Override
	 */
	ContainerProto._getStyleClassRoot = function(){
		var type = this.getType(),
			styleClass = " " + this._getStyleClassType(type)
						+ " " + this._typeData[type].className,
			
			severity = this.getSeverity();
		
		if(ui5strap.Severity.None !== severity){
			styleClass += " bg-" + ui5strap.BSSeverity[severity];
		}
		
		if(this.getFullHeight()){
			styleClass += " " + this._getStyleClassFlag("FullHeight");
		}
		
		return styleClass;
	};
	
	/**
	 * @deprecated
	 */
	ContainerProto.setVisibility = function(newVisibility, suppressInvalidate){
		this.setProperty("visibility", newVisibility, true);
		this.setVisibilityExtraSmall(newVisibility, suppressInvalidate);
		return this;
	}
	
	//Return Module Constructor
	return Container;
	
});