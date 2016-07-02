/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./DataState'],function(q,D){"use strict";var C=D.extend("sap.ui.model.CompositeDataState",{metadata:{},constructor:function(d){D.apply(this,arguments);this.mProperties.originalValue=[];this.mProperties.originalInternalValue=[];this.mProperties.value=[];this.mProperties.invalidValue=null;this.mProperties.internalValue=[];this.mChangedProperties=q.extend({},this.mProperties);this.aDataStates=d;}});C.prototype._hasInnerInvalidValues=function(){return this.aDataStates.reduce(function(i,d){if(d.getInvalidValue()!==null){return true;}else{return i;}},false);};C.prototype.getInternalProperty=function(p){var r;if(p==="invalidValue"&&this._hasInnerInvalidValues()){r=this.aDataStates.map(function(d){return d.getProperty("invalidValue")||d.getProperty("value");});}else{r=this.aDataStates.map(function(d){return d.getProperty(p);});}return r;};C.prototype.getProperty=function(p){var v=D.prototype.getProperty.apply(this,arguments);var I=this.getInternalProperty(p);var r;switch(p){case"modelMessages":case"controlMessages":r=v;for(var i=0;i<I.length;++i){r=r.concat(I[i]);}break;default:r=I||v;}return r;};C.prototype.getModelMessages=function(){return this.getProperty("modelMessages");};C.prototype.getControlMessages=function(){return this.getProperty("controlMessages");};C.prototype.getMessages=function(){return this.aDataStates.reduce(function(m,d){return m.concat(d.getMessages());},D.prototype.getMessages.apply(this,arguments));};C.prototype.containsValues=function(v){if(Array.isArray(v)){for(var i=0;i<v.length;i++){if(v[i]!==null&&v[i]!==undefined){return true;}}return false;}else{return!!v;}};C.prototype.isDirty=function(){return this.aDataStates.reduce(function(i,d){if(d.isDirty()){return true;}else{return i;}},D.prototype.isDirty.apply(this,arguments));};C.prototype.isControlDirty=function(){return this.aDataStates.reduce(function(i,d){if(d.isControlDirty()){return true;}else{return i;}},D.prototype.isControlDirty.apply(this,arguments));};C.prototype.isLaundering=function(){return this.aDataStates.reduce(function(i,d){if(d.isLaundering()){return true;}else{return i;}},D.prototype.isLaundering.apply(this,arguments));};C.prototype.getInvalidValue=function(){var v=this.mChangedProperties["invalidValue"];var i=this.getInternalProperty("invalidValue");if(i&&this.containsValues(i)){v=i;this.setInvalidValue(i);}return v;};C.prototype.changed=function(n){if(n===false){this.mProperties=q.extend({},this.mChangedProperties);this.aDataStates.forEach(function(d){d.changed(false);});}return this.aDataStates.reduce(function(l,d){if(l){return true;}else{return d.changed();}},!q.sap.equal(this.mProperties,this.mChangedProperties));};C.prototype.getChanges=function(){var c={};var i,k,m;var I=[];for(i=0;i<this.aDataStates.length;++i){m=this.aDataStates[i].getChanges();for(k in m){c[k]=[];}I.push(m);}var h=this._hasInnerInvalidValues();var a={};for(k in c){for(i=0;i<I.length;++i){m=I[i][k];if(!a[k]){a[k]=[];}if(m){a[k].push(m.value);}else{var v=this.aDataStates[i].getProperty(k);if(k==="invalidValue"&&h&&!v){v=this.aDataStates[i].getProperty("value");}a[k].push(v);}}}q.each(this.mChangedProperties,function(p,v){if(this.mChangedProperties[p]&&!q.sap.equal(this.mChangedProperties[p],this.mProperties[p])){a[p]={};a[p].value=this.mChangedProperties[p];a[p].oldValue=this.mProperties[p];}}.bind(this));var M=this.getMessages();var o=this._getOldMessages();if(M.length>0||o.length>0){a["messages"]={};a["messages"].oldValue=o;a["messages"].value=M;}return a;};return C;});
