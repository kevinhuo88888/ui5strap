/*
 * 
 * UI5Strap
 *
 * ui5strap.ListItem
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

sap.ui.define(['./library', './ControlBase'], function(library, ControlBase){

	var ListItem = ControlBase.extend("ui5strap.ListItem", {
		metadata : {
			interfaces : ["ui5strap.ISelectableItem"],
			
			defaultAggregation : "content",
			
			library : "ui5strap",

			properties : { 
				selected : {
					type:"boolean", 
					defaultValue:false
				}, 
				enabled : {
					type:"boolean", 
					defaultValue:true
				},
				selectable : {
					type : "boolean",
					defaultValue : true
				},
				text : {
					type:"string",
					defaultValue:""
				},
				parse : {
					type : "boolean",
					defaultValue : false
				},
				contentPlacement : {
					type:"ui5strap.ContentPlacement",
					defaultValue : ui5strap.ContentPlacement.Start
				},
				
				//@deprecated
				itemId : {
					deprecated: true,
					type:"string",
					defaultValue : ""
				}
			},
			
			aggregations : { 
				content : {
					singularName: "content"
				}
			}

		}
	}),
	ListItemPrototype = ListItem.prototype;

	ui5strap.Utils.dynamicText(ListItemPrototype);

	//ui5strap.Utils.dynamicClass(ListItemPrototype, 'selected', { 'true' : 'active' });
	
	ListItemPrototype.setSelected = function(newSelected, suppressInvalidate){
		if(this.getDomRef()){
              if(newSelected){
                  this.$().addClass("active");
              }
              else{
                  this.$().removeClass("active");
              }
              

              this.setProperty("selected", newSelected, true);
          }
          else{
              this.setProperty("selected", newSelected, suppressInvalidate);
          }
	};
	
	/**
	 * @Public
	 * @Override
	 */
	ListItemPrototype.isSelectable = function(selectionProvider){
		return this.getSelectable();
	};
	
	return ListItem;
});