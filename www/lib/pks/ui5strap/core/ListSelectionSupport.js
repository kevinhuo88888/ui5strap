/*
 * 
 * UI5Strap
 *
 * pks.ui5strap.core.ListSelectionSupport
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

sap.ui.define(['./library'], function(ui5strapCoreLib){
	
	"use strict";
	
	/**
	 * Constructor for a new ListSelectionSupport instance.
	 * 
	 * @class
	 * Trait for list selection support.
	 * 
	 * @author Jan Philipp Knoeller
	 * @version 1.0.0-SNAPSHOT
	 * 
	 * @constructor
	 * @public
	 * @alias pks.ui5strap.core.ListSelectionSupport
	 * 
	 */
	var ListSelectionSupport = {};
	
	/**
	 * Adds the required properties to the Meta Data definition.
	 * @Public
	 */
	ListSelectionSupport.meta = function(meta){
		//Interfaces
		
		meta.interfaces.push("pks.ui5strap.core.IItemsProvider", "pks.ui5strap.core.ISelectionProvider");
		
		//Properties
		
		meta.properties.selectionMode = {
			"type" : "pks.ui5strap.core.SelectionMode",
			"defaultValue" : ui5strapCoreLib.SelectionMode.None
		};
		
		//Events
		
		meta.events.selectionChange = {
			parameters : {
			
			}
		};
			
		meta.events.select = {
			parameters : {
				srcItem : {type : "pks.ui5strap.core.ISelectableItem"},
				srcControl : {type : "sap/ui/core/Control"}
			}
		};
		
		//TODO Rename 'tap' event to 'press' sometimes
		meta.events.tap = {
			parameters : {
				srcItem : {type : "pks.ui5strap.core.ISelectableItem"},
				srcControl : {type : "sap/ui/core/Control"}
			}
		};

		
	};
	
	var _defaultSelectionGroup = "selectionGroup";
	
	/**
	 * @Private
	 */
	var _changeSelection = function(_this, itemsToSelect, mode, selectionGroup){
		var items = _this._getItems(),
			changes = {
				"selected" : [],
				"deselected" : [],
				"changed" : [],
				"unchanged" : [],
			};
		
		if(!jQuery.isArray(itemsToSelect)){
			itemsToSelect = [itemsToSelect];
		}
		
		if(!selectionGroup){
			selectionGroup = _defaultSelectionGroup;
		}
		
		for(var i = 0; i < items.length; i++){
			var item = items[i];
			if(-1 !== jQuery.inArray(item, itemsToSelect)){
				//Item is subject to select / deselect
				if("replace" === mode || "add" === mode){
					if(!_this._isItemSelected(item, selectionGroup)){
						changes.selected.push(item);
						changes.changed.push(item);
						
						_this._setItemSelected(item, true, selectionGroup);
					}
					else{
						changes.unchanged.push(item);
					}
				}
				else if("remove" === mode){
					if(_this._isItemSelected(item, selectionGroup)){
						changes.deselected.push(item);
						changes.changed.push(item);
						
						_this._setItemSelected(item, false, selectionGroup);
					}
					else{
						changes.unchanged.push(item);
					}
				}
				else if("toggle" === mode){
					var selected = _this._isItemSelected(item, selectionGroup);
						
						if(!selected){
							changes.selected.push(item);
						}
						else{
							changes.deselected.push(item);
						}
						
						changes.changed.push(item);
						
						_this._setItemSelected(item, !selected, selectionGroup);
				}
			}
			else{
				//Item is no subject to select / deselect
				if("replace" === mode){
					if(_this._isItemSelected(item, selectionGroup)){
						changes.deselected.push(item);
						changes.changed.push(item);
						
						_this._setItemSelected(item, false, selectionGroup);
					}
					else{
						changes.unchanged.push(item);
					}
				}
				else if("add" === mode || "remove" === mode || "toggle" === mode){
					changes.unchanged.push(item);
				}
			}
		}
		
		if(changes.changed.length){
			_this.fireSelectionChange({ selectionChanges: changes });
		}
		
		return changes;
	};
	
	/**
	 * @Private
	 */
	var _changeSelectionIndices = function(_this, indices, mode, selectionGroup){
		var items = _this._getItems();
		
		if(!jQuery.isArray(indices)){
			//Single value
			if(indices < 0 || indices >= items.length){
				throw new Error("Array out of bounds!");
			}
			
			return _changeSelection(_this, items[indices], mode, selectionGroup);
		}
		else{
			//array
			var itemsToSelect = [];
			for(var i=0; i<indices.length; i++){
				var index = indices[i];
				if(index < 0 || index >= items.length){
					throw new Error("Array out of bounds!");
				}
				itemsToSelect.push(items[index]);
			}
			
			return _changeSelection(_this, itemsToSelect, mode, selectionGroup);
		}
	};
	
	/**
	 * @Private
	 */
	var _changeSelectionByCustomData = function(_this, dataKey, values, mode, selectionGroup){
		var items = _this._getItems();
		
		if(!jQuery.isArray(values)){
			var selectedItem = null;
			
			for(var i = 0; i < items.length; i++){
				//TODO use == here? How to handle null/undefined?
				//Currently values must be a string if the data value is defined in the view.
				if(items[i].data(dataKey) === values){
					selectedItem = items[i];
					
					break;
				}
			}
			
			return _changeSelection(_this, selectedItem, mode, selectionGroup);
		}
		else{
			var itemsToSelect = [];
			
			for(var i = 0; i < items.length; i++){
				//TODO How to handle null/undefined?
				//Check whether jQuery.inArray uses === or == for comparison.
				if(-1 !== jQuery.inArray(items[i].data(dataKey), values)){
					itemsToSelect.push(items[i]);
				}
			}
			
			return _changeSelection(_this, itemsToSelect, mode, selectionGroup);
		}
	};
	
	/**
	 * @Private
	 */
	var _changeSelectionByProperty = function(_this, propertyName, values, mode, selectionGroup){
		var items = _this._getItems(),
			methodName = 'get' + jQuery.sap.charToUpperCase(propertyName);
		
		if(!jQuery.isArray(values)){
			var selectedItem = null;
			
			for(var i = 0; i < items.length; i++){
				//TODO use == here? How to handle null/undefined?
				//Currently values must be a string if the data value is defined in the view.
				if(items[i][methodName]() === values){
					selectedItem = items[i];
					
					break;
				}
			}
			
			return _changeSelection(_this, selectedItem, mode, selectionGroup);
		}
		else{
			var itemsToSelect = [];
			
			for(var i = 0; i < items.length; i++){
				//TODO How to handle null/undefined?
				//Check whether jQuery.inArray uses === or == for comparison.
				if(-1 !== jQuery.inArray(items[i][methodName](), values)){
					itemsToSelect.push(items[i]);
				}
			}
			
			return _changeSelection(_this, itemsToSelect, mode, selectionGroup);
		}
	};
	
	/**
	 * Adds Support for Options to an prototype or object
	 * @Public
	 */
	ListSelectionSupport.proto = function(oControl){
		
		/**
		 * @Protected
		 * @Override
		 */
		var oldGetStyleClass = oControl._getStyleClass;
		oControl._getStyleClass = function(){
			return oldGetStyleClass.call(this) + ListSelectionSupport.getStyleClass(this);	
		};
		
		/*
		 * Methods to override 
		 */
		
		/**
		 * Defines how to decide whether an item is selected within a selectionGroup.
		 * @Protected
		 */
		oControl._isItemSelected = function(item, selectionGroup){
			return item.getSelected();
		};
		
		/**
		 * Defines how to decide whether an item is enabled within a selectionGroup.
		 * @Protected
		 */
		oControl._isItemEnabled = function(item, selectionGroup){
			return item.getEnabled();
		};
		
		/**
		 * Defines how to decide whether an item is selectable within a selectionGroup.
		 * @Protected
		 */
		oControl._isItemSelectable = function(item, selectionGroup, selectionProvider){
			return item.isSelectable(selectionProvider);
		};
		
		/**
		 * Defines how to select an item within a selectionGroup.
		 * @Protected
		 */
		oControl._setItemSelected = function(item, selected, selectionGroup){
			item.setSelected(selected);
		};
		
		/**
		 * Adds additional event options.
		 * @Protected
		 * @Override
		 */
		oControl._addEventOptions = function(eventOptions){
			//To be overwritten by inheritants
		};
		
		/*
		 * 
		 */
		
		/*
		 * --------------------
		 * START implementation of IItemsProvider interface
		 * --------------------
		 */
		
		/**
		 * Gets the list of items. This depends on the available aggregations.
		 * TODO Replace with getItems (without leading _)?
		 * @Protected
		 */
		oControl._getItems = function(){
			return this.getItems();
		};
		
		/**
		 * @Public
		 */
		oControl.getItemIndex = function(item){
			return this.indexOfAggregation("items", item);
		};
		
		/**
		 * Gets one or multiple selected items that have the given value in the specified custom data field.
		 * @Public
		 */
		oControl.getItemsByCustomData = function(dataKey, value){
			var items = this._getItems(),
				returnItems = [];
			for(var i = 0; i < items.length; i++){
				if(items[i].data(dataKey) === value){
					returnItems.push(items[i]);
				}
			}
			
			return returnItems;
		};
		
		/**
		 * Gets one or multiple selected items that have the given value in the specified property.
		 * @Public
		 */
		oControl.getItemsByProperty = function(propertyName, value){
			var items = this._getItems(),
				getter = "get" + jQuery.sap.charToUpper(propertyName, 0),
				returnItems = [];
			
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				
				if(!item[getter]){
					throw new Error("Item " + i + ": no such getter: " + getter);
				}
				
				if(item[getter]() === value){
					returnItems.push(items[i]);
				}
			}
			
			return returnItems;
		};
		
		
		
		/*
		 * ------------------
		 * END implementation of IItemsProvider interface
		 * ------------------
		 */
		
		/*
		 * --------------------
		 * START implementation of ISelectionProvider interface
		 * --------------------
		 */
		
		/**
		 * Returns an array of selected items and their indices.
		 * 
		 * @Protected
		 */
		oControl._getSelection = function(selectionGroup){
			if(!selectionGroup){
				selectionGroup = _defaultSelectionGroup;
			}
			
			var items = this._getItems(),
				selection = {
					indices : [],
					items : []
				};
			
			for(var i = 0; i < items.length; i++){
				if(this._isItemSelected(items[i], selectionGroup)){
					selection.items.push(items[i]);
					selection.indices.push(i);
				}
			}
			
			return selection;
		};
		
		/**
		 * Gets one or multiple selected items
		 * @Public
		 * @Override
		 */
		oControl.getSelection = function(selectionGroup){
			var selection = this._getSelection(selectionGroup);
			
			return selection.items;
		};
		
		/**
		 * Returns whether one or multiple items are currently part of selection.
		 * @Public
		 */
		oControl.isInSelection = function(itemsToCheck, selectionGroup){
			var inSelection = true;
			
			if(!jQuery.isArray(itemsToCheck)){
				itemsToCheck = [itemsToCheck];
			}
			
			for(var i = 0; i < itemsToCheck.length; i++){
				if(!this._isItemSelected(itemsToCheck[i], selectionGroup)){
					inSelection = false;
					break;
				}
			}
			
			return inSelection;
		};
		
		/**
		 * Tries to select one or multiple items and returns all changes.
		 * 
		 * @Public
		 * @Override
		 */
		oControl.setSelection = function(itemsToSelect, selectionGroup){
			return _changeSelection(this, itemsToSelect, "replace", selectionGroup);
		};
		
		/**
		 * Adds one or multiple items to selection
		 * @Public
		 * @Override
		 */
		oControl.addSelection = function(itemsToSelect, selectionGroup){
			return _changeSelection(this, itemsToSelect, "add", selectionGroup);
		};
		
		/**
		 * Removes one or multiple items from selection
		 * @Public
		 * @Override
		 */
		oControl.removeSelection = function(itemsToSelect, selectionGroup){
			return _changeSelection(this, itemsToSelect, "remove", selectionGroup);
		};
		
		/**
		 * Toggles one or multiple items from selection
		 * @Public
		 * @Override
		 */
		oControl.toggleSelection = function(itemsToSelect, selectionGroup){
			return _changeSelection(this, itemsToSelect, "toggle", selectionGroup);
		};
		
		/*
		 * Index
		 */
		
		/**
		 * Gets one or multiple indices of selected items
		 * @Public
		 * @Override
		 */
		oControl.getSelectionIndex = function(selectionGroup){
			var selection = this._getSelection(selectionGroup);
			
			return selection.indices;
		};
		
		/**
		 * Returns whether one or multiple item indices are currently part of selection.
		 * @Public
		 */
		oControl.isInSelectionIndex = function(indices, selectionGroup){
			var items = _this._getItems();
			if(!jQuery.isArray(indices)){
				//Single value
				if(indices < 0 || indices >= items.length){
					throw new Error("Array out of bounds!");
				}
				
				return this.isInSelection(items[indices], selectionGroup);
			}
			else{
				var itemsToCheck = [];
				for(var i=0; i<indices.length; i++){
					var index = indices[i];
					if(index < 0 || index >= items.length){
						throw new Error("Array out of bounds!");
					}
					itemsToCheck.push(items[index]);
				}
				
				return this.isInSelection(itemsToCheck, selectionGroup);
			}
		};
		
		/**
		 * Selects one or multiple items by indices
		 * @Public
		 * @Override
		 */
		oControl.setSelectionIndex = function(indices, selectionGroup){
			return _changeSelectionIndices(this, indices, "replace", selectionGroup);
		};
		
		/**
		 * Adds one or multiple items to selection by indices
		 * @Public
		 * @Override
		 */
		oControl.addSelectionIndex = function(indices, selectionGroup){
			return _changeSelectionIndices(this, indices, "add", selectionGroup);
		};
		
		/**
		 * Removes one or multiple items from selection by indices
		 * @Public
		 * @Override
		 */
		oControl.removeSelectionIndex = function(indices, selectionGroup){
			return _changeSelectionIndices(this, indices, "remove", selectionGroup);
		};
		
		/**
		 * Toggles one or multiple items from selection by indices
		 * @Public
		 * @Override
		 */
		oControl.toggleSelectionIndex = function(indices, selectionGroup){
			return _changeSelectionIndices(this, indices, "toggle", selectionGroup);
		};
		
		/*
		 * CustomData 
		 */
		
		/**
		 * Gets the data value of one or multiple selected items
		 * @Public
		 * @Override
		 */
		oControl.getSelectionCustomData = function(dataKey, selectionGroup){
			var selection = this._getSelection(selectionGroup);
			
			var returnData = [];
			
			for(var i = 0; i < selection.items.length; i++){
				returnData.push(selection.items[i].data(dataKey));
			}
			
			return returnData;
		};
		
		/**
		 * Returns whether one or multiple items are currently part of selection. Items are selected by custom data key and possible values.
		 * @Public
		 */
		oControl.isInSelectionByCustomData = function(dataKey, values, selectionGroup){
			var items = _this._getItems();
			
			if(!jQuery.isArray(values)){
				for(var i = 0; i < items.length; i++){
					//TODO use == here? How to handle null/undefined?
					//Currently values must be a string if the data value is defined in the view.
					if(items[i].data(dataKey) === values){
						selectedItem = items[i];
						
						return this.isInSelection(selectedItem, selectionGroup);
					}
				}
			}
			else{
				var itemsToCheck = [];
				for(var i = 0; i < items.length; i++){
					//TODO How to handle null/undefined?
					//Check whether jQuery.inArray uses === or == for comparison.
					if(-1 !== jQuery.inArray(items[i].data(dataKey), values)){
						itemsToCheck.push(items[i]);
					}
				}
				return this.isInSelection(itemsToCheck, selectionGroup);
			}
		};
		
		/**
		 * Selects one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.setSelectionByCustomData = function(dataKey, values, selectionGroup){
			_changeSelectionByCustomData(this, dataKey, values, "replace", selectionGroup);
		};
		
		/**
		 * Selects one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.addSelectionByCustomData = function(dataKey, values, selectionGroup){
			_changeSelectionByCustomData(this, dataKey, values, "add", selectionGroup);
		};
		
		/**
		 * Selects one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.removeSelectionByCustomData = function(dataKey, values, selectionGroup){
			_changeSelectionByCustomData(this, dataKey, values, "remove", selectionGroup);
		};
		
		/**
		 * Toggles one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.toggleSelectionByCustomData = function(dataKey, values, selectionGroup){
			_changeSelectionByCustomData(this, dataKey, values, "toggle", selectionGroup);
		};
		
		/*
		 * Property
		 */
		
		/**
		 * Gets the data value of one or multiple selected items
		 * @Public
		 * @Override
		 */
		oControl.getSelectionProperty = function(propertyName, selectionGroup){
			var selection = this._getSelection(selectionGroup),
				methodName = 'get' + jQuery.sap.charToUpperCase(propertyName),
				returnData = [];
			
			for(var i = 0; i < selection.items.length; i++){
				returnData.push(selection.items[i][methodName]());
			}
			
			return returnData;
		};
		
		/**
		 * Returns whether one or multiple items are currently part of selection. Items are selected by custom data key and possible values.
		 * @Public
		 */
		oControl.isInSelectionByProperty = function(propertyName, values, selectionGroup){
			var items = _this._getItems()
				methodName = 'get' + jQuery.sap.charToUpperCase(propertyName);
			
			if(!jQuery.isArray(values)){
				for(var i = 0; i < items.length; i++){
					//TODO use == here? How to handle null/undefined?
					//Currently values must be a string if the data value is defined in the view.
					if(items[i][methodName]() === values){
						selectedItem = items[i];
						
						return this.isInSelection(selectedItem, selectionGroup);
					}
				}
			}
			else{
				var itemsToCheck = [];
				for(var i = 0; i < items.length; i++){
					//TODO How to handle null/undefined?
					//Check whether jQuery.inArray uses === or == for comparison.
					if(-1 !== jQuery.inArray(items[i][methodName](), values)){
						itemsToCheck.push(items[i]);
					}
				}
				return this.isInSelection(itemsToCheck, selectionGroup);
			}
		};
		
		/**
		 * Selects one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.setSelectionByProperty = function(propertyName, values, selectionGroup){
			_changeSelectionByProperty(this, propertyName, values, "replace", selectionGroup);
		};
		
		/**
		 * Selects one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.addSelectionByProperty = function(propertyName, values, selectionGroup){
			_changeSelectionByProperty(this, propertyName, values, "add", selectionGroup);
		};
		
		/**
		 * Selects one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.removeSelectionByProperty = function(propertyName, values, selectionGroup){
			_changeSelectionByProperty(this, propertyName, values, "remove", selectionGroup);
		};
		
		/**
		 * Toggles one or multiple items that have the given value in the specified custom data field.
		 * @Public
		 * @Override
		 */
		oControl.toggleSelectionByProperty = function(propertyName, values, selectionGroup){
			_changeSelectionByProperty(this, propertyName, values, "toggle", selectionGroup);
		};
		
		
		
		/**
		 * Performs a press on an item.
		 * TODO is this really part of ISelectionProvider?
		 * @public
		 * 
		 */
		oControl.pressItem = function(srcControl, item, itemUpdated, selectionProvider, providerItem){
			if(item && this._isItemEnabled(item, _defaultSelectionGroup)){
				//Item is enabled
				
				var eventOptions = {
						srcControl : srcControl,
						srcItem : item,
						selectionProvider : selectionProvider
					};
						
				this._addEventOptions(eventOptions);
				
				//Process selection
				var selectionMode = this.getSelectionMode();
				if(ui5strapCoreLib.SelectionMode.None !== selectionMode 
						&& this._isItemSelectable(item, _defaultSelectionGroup, selectionProvider)){
					//List allows selections and item is selectable
					
					var changes = null;
					
					if(selectionMode === ui5strapCoreLib.SelectionMode.Single){
						changes = this.setSelection(item, _defaultSelectionGroup);
					}
					else if(selectionMode === ui5strapCoreLib.SelectionMode.SingleToggle){
						if(this.isInSelection(item)){
							changes = this.removeSelection(item, _defaultSelectionGroup);
						}
						else{
							changes = this.setSelection(item, _defaultSelectionGroup);
						}
					}
					else if(selectionMode === ui5strapCoreLib.SelectionMode.Multiple){
						changes = this.toggleSelection(item, _defaultSelectionGroup);
					}
					
					//Check if something has changed
					if(changes && changes.changed.length){
						eventOptions.selectionChanges = changes;
						eventOptions.updates = jQuery.merge([], changes.changed);
						
						if(-1 === jQuery.inArray(item, eventOptions.updates)){
							eventOptions.updates.push(item);
						}
						
						//Select event is deprecated
						this.fireSelect(eventOptions);
					}
					else{
						if(itemUpdated){
							eventOptions.updates = [item];
						}
						
						//No changes
						jQuery.sap.log.debug("Event 'select' not fired: no changes in selection.");
					}
				}
				else{
					if(itemUpdated){
						eventOptions.updates = [item];
					}
					jQuery.sap.log.debug("[LIST#" + this.getId() + "] Did not select list item: List item not selectable.");
				}
				
				//TODO Rename 'tap' event to 'press' sometimes
				this.fireTap(eventOptions);
			}
			else{
				jQuery.sap.log.warning("Could not select list item: List item not found or disabled.");
			}
		};
		
		/*
		 * ------------------
		 * END implementation of ISelectionProvider interface
		 * ------------------
		 */
	};
	
	ListSelectionSupport.getStyleClass = function(oControl){
		var styleClass = "";
		
		
		return styleClass;
	};
	
	return ListSelectionSupport;

});