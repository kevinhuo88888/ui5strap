/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/ContextBinding'],function(q,C){"use strict";var O=C.extend("sap.ui.model.odata.v2.ODataContextBinding",{constructor:function(m,p,c,P,e){C.call(this,m,p,c,P,e);this.bRefreshGroupId=undefined;}});O.prototype.initialize=function(){var t=this,r,R;if(this.oModel.oMetadata.isLoaded()&&this.bInitial){r=this.oModel.resolve(this.sPath,this.oContext);R=this.oModel._isReloadNeeded(r,this.mParameters);if(r&&R){this.fireDataRequested();}this.oModel.createBindingContext(this.sPath,this.oContext,this.mParameters,function(c){var d;t.oElementContext=c;t._fireChange();if(r&&R){if(t.oElementContext){d=t.oElementContext.getObject();}t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:d});});}},R);this.bInitial=false;}};O.prototype.refresh=function(f,g){if(typeof f==="string"){g=f;f=false;}this.sRefreshGroup=g;this._refresh(f);this.sRefreshGroup=undefined;};O.prototype._refresh=function(f,c){var t=this,d,k,s,b=false,p=this.mParameters,r=this.oModel.resolve(this.sPath,this.oContext);if(this.bInitial){return;}if(c){s=this.oModel._getObject(this.sPath,this.oContext);if(s){k=this.oModel._getKey(s);if(k in c){b=true;}}}else{b=true;}if(f||b){if(r){this.fireDataRequested();}if(this.sRefreshGroup){p=q.extend({},this.mParameters);p.groupId=this.sRefreshGroup;}this.oModel.createBindingContext(this.sPath,this.oContext,p,function(o){if(t.oElementContext===o){if(f){t._fireChange();}}else{t.oElementContext=o;t._fireChange();}if(t.oElementContext){d=t.oElementContext.getObject();}if(r){t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:d});});}},true);}};O.prototype.setContext=function(c){var t=this,d,r,d,R;if(this.oContext!==c&&this.isRelative()){this.oContext=c;r=this.oModel.resolve(this.sPath,this.oContext);d=this.oModel._getObject(this.sPath,this.oContext);R=this.oModel._isReloadNeeded(r,d,this.mParameters);if(!this.bInitial){if(r&&R){this.fireDataRequested();}this.oModel.createBindingContext(this.sPath,this.oContext,this.mParameters,function(c){t.oElementContext=c;t._fireChange();if(r&&R){if(t.oElementContext){d=t.oElementContext.getObject();}t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:d});});}},R);}}};return O;});
