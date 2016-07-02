/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/FilterType','sap/ui/model/ListBinding','sap/ui/model/odata/ODataUtils','sap/ui/model/odata/CountMode','sap/ui/model/odata/Filter','sap/ui/model/odata/OperationMode','sap/ui/model/ChangeReason','sap/ui/model/Filter','sap/ui/model/FilterProcessor','sap/ui/model/Sorter','sap/ui/model/SorterProcessor'],function(q,F,L,O,C,a,b,c,d,e,S,f){"use strict";var g=L.extend("sap.ui.model.odata.v2.ODataListBinding",{constructor:function(m,p,o,s,h,P){L.apply(this,arguments);this.sFilterParams=null;this.sSortParams=null;this.sRangeParams=null;this.sCustomParams=this.oModel.createCustomParams(this.mParameters);this.iStartIndex=0;this.iLength=0;this.bPendingChange=false;this.aAllKeys=null;this.aKeys=[];this.sCountMode=(P&&P.countMode)||this.oModel.sDefaultCountMode;this.sOperationMode=(P&&P.operationMode)||this.oModel.sDefaultOperationMode;this.bRefresh=false;this.bNeedsUpdate=false;this.bDataAvailable=false;this.bIgnoreSuspend=false;this.bPendingRefresh=true;this.sGroupId=undefined;this.sRefreshGroupId=undefined;this.bLengthRequested=false;this.bUseExtendedChangeDetection=true;this.bFaultTolerant=P&&P.faultTolerant;this.bLengthFinal=false;this.iLastEndIndex=0;this.aLastContexts=null;this.aLastContextData=null;this.bInitial=true;this.mRequestHandles={};if(P&&(P.batchGroupId||P.groupId)){this.sGroupId=P.groupId||P.batchGroupId;}this.iThreshold=(P&&P.threshold)||0;switch(this.sOperationMode){default:case b.Server:this.bClientOperation=false;break;case b.Client:this.bClientOperation=true;break;case b.Auto:this.bClientOperation=false;break;}this.bThresholdRejected=false;if(this.sCountMode==C.None){this.bThresholdRejected=true;}var r=this.oModel._getObject(this.sPath,this.oContext);this.aExpandRefs=r;if(q.isArray(r)){this.aAllKeys=r;this.iLength=r.length;this.bLengthFinal=true;this.bDataAvailable=true;this.bClientOperation=true;this.applyFilter();this.applySort();}else if(r===null&&this.oModel.resolve(this.sPath,this.oContext)){this.aKeys=[];this.iLength=0;this.bLengthFinal=true;this.bDataAvailable=true;}else{this.resetData();}},metadata:{publicMethods:["getLength"]}});g.prototype.getContexts=function(s,l,t){if(this.bInitial){return[];}if(!this.bLengthFinal&&this.sOperationMode==b.Auto&&(this.sCountMode==C.Request||this.sCountMode==C.Both)){if(!this.bLengthRequested){this._getLength();this.bLengthRequested=true;}return[];}if(!this.bLengthFinal&&!this.bPendingRequest&&!this.bLengthRequested){this._getLength();this.bLengthRequested=true;}this.iLastLength=l;this.iLastStartIndex=s;this.iLastThreshold=t;if(!s){s=0;}if(!l){l=this.oModel.iSizeLimit;if(this.bLengthFinal&&this.iLength<l){l=this.iLength;}}if(!t){t=0;}if(this.sOperationMode==b.Auto){if(this.iThreshold>=0){t=Math.max(this.iThreshold,t);}}var h=true,j=this._getContexts(s,l),k=[],o;if(this.bClientOperation){if(!this.aAllKeys&&!this.bPendingRequest&&this.oModel.getServiceMetadata()){this.loadData();j.dataRequested=true;}}else{o=this.calculateSection(s,l,t,j);h=j.length!==l&&!(this.bLengthFinal&&j.length>=this.iLength-s);if(this.oModel.getServiceMetadata()){if(!this.bPendingRequest&&o.length>0&&(h||l<o.length)){this.loadData(o.startIndex,o.length);j.dataRequested=true;}}}if(this.bRefresh){if(this.bLengthFinal&&this.iLength===0){this.loadData(o.startIndex,o.length,true);j.dataRequested=true;}this.bRefresh=false;}else{for(var i=0;i<j.length;i++){k.push(this.getContextData(j[i]));}if(this.bUseExtendedChangeDetection){if(this.aLastContexts&&s<this.iLastEndIndex){j.diff=q.sap.arraySymbolDiff(this.aLastContextData,k);}}this.iLastEndIndex=s+l;this.aLastContexts=j.slice(0);this.aLastContextData=k.slice(0);}return j;};g.prototype.getCurrentContexts=function(){return this.aLastContexts||[];};g.prototype.getContextData=function(o){if(!this.bDetectUpdates&&!this.fnGetEntryKey){return o.getPath();}if(!this.bDetectUpdates){return this.fnGetEntryKey(o);}else{return JSON.stringify(o.getObject());}};g.prototype._getContexts=function(s,l){var h=[],o,k;if(!s){s=0;}if(!l){l=this.oModel.iSizeLimit;if(this.bLengthFinal&&this.iLength<l){l=this.iLength;}}for(var i=s;i<s+l;i++){k=this.aKeys[i];if(!k){break;}o=this.oModel.getContext('/'+k);h.push(o);}return h;};g.prototype.calculateSection=function(s,l,t,h){var k,m,p,P,r,o={},K;m=s;k=0;for(var i=s;i>=Math.max(s-t,0);i--){K=this.aKeys[i];if(!K){P=i+1;break;}}for(var j=s+l;j<s+l+t;j++){K=this.aKeys[j];if(!K){p=j;break;}}r=s-P;if(P&&s>t&&r<t){if(h.length!==l){m=s-t;}else{m=P-t;}k=t;}m=Math.max(m,0);if(m===s){m+=h.length;}if(h.length!==l){k+=l-h.length;}r=p-s-l;if(r===0){k+=t;}if(p&&r<t&&r>0){if(m>s){m=p;k+=t;}}if(this.bLengthFinal&&this.iLength<(k+m)){k=this.iLength-m;}o.startIndex=m;o.length=k;return o;};g.prototype.setContext=function(o){if(this.oContext!==o){this.oContext=o;if(this.isRelative()){this._initSortersFilters();if(!this.bInitial){var r=this.oModel._getObject(this.sPath,this.oContext);this.aExpandRefs=r;if(q.isArray(r)){this.aAllKeys=r;this.iLength=r.length;this.bLengthFinal=true;this.bClientOperation=true;this.applyFilter();this.applySort();this._fireChange();}else if(!this.oModel.resolve(this.sPath,this.oContext)||r===null){this.aAllKeys=null;this.aKeys=[];this.iLength=0;this.bLengthFinal=true;this._fireChange();}else{this._refresh();}}}}};g.prototype.loadData=function(s,l,p){var t=this,I=false,u,G=q.sap.uid(),h;if(s||l){this.sRangeParams="$skip="+s+"&$top="+l;this.iStartIndex=s;}else{s=this.iStartIndex;}var P=[];if(this.sRangeParams&&(this.sOperationMode!=b.Auto||this.bThresholdRejected||!this.bLengthFinal)){P.push(this.sRangeParams);}if(this.sSortParams){P.push(this.sSortParams);}if(this.sFilterParams&&(this.sOperationMode!=b.Auto||this.bThresholdRejected)){P.push(this.sFilterParams);}if(this.sCustomParams){P.push(this.sCustomParams);}if(this.sCountMode==C.InlineRepeat||!this.bLengthFinal&&(this.sCountMode===C.Inline||this.sCountMode===C.Both)){P.push("$inlinecount=allpages");I=true;}function j(D){if(I&&D.__count){t.iLength=parseInt(D.__count,10);t.bLengthFinal=true;if(t.sOperationMode==b.Auto){if(t.iLength<=t.mParameters.threshold){t.bClientOperation=true;t.bThresholdRejected=false;}else{t.bClientOperation=false;t.bThresholdRejected=true;delete t.mRequestHandles[G];t.bPendingRequest=false;t.bNeedsUpdate=true;return;}}}if(D.results.length>0){q.each(D.results,function(i,m){t.aKeys[s+i]=t.oModel._getKey(m);});if(t.iLength<s+D.results.length){t.iLength=s+D.results.length;t.bLengthFinal=false;}if(!D.__next&&(D.results.length<l||l===undefined)){t.iLength=s+D.results.length;t.bLengthFinal=true;}}else{if(t.bFaultTolerant&&D.__next){t.iLength=s;t.bLengthFinal=true;}if(s===0){t.iLength=0;t.bLengthFinal=true;}if(s===t.iLength){t.bLengthFinal=true;}}if(t.bClientOperation){t.aAllKeys=t.aKeys.slice();t.iLength=t.aKeys.length;t.bLengthFinal=true;t.applyFilter();t.applySort();}delete t.mRequestHandles[G];t.bPendingRequest=false;t.bNeedsUpdate=true;t.bIgnoreSuspend=true;t.oModel.callAfterUpdate(function(){t.fireDataReceived({data:D});});}function E(i){var A=i.statusCode==0;delete t.mRequestHandles[G];t.bPendingRequest=false;if(t.bFaultTolerant){t.iLength=t.aKeys.length;t.bLengthFinal=true;t.bDataAvailable=true;}else if(!A){t.aKeys=[];t.iLength=0;t.bLengthFinal=true;t.bDataAvailable=true;t._fireChange({reason:c.Change});}t.fireDataReceived();}var k=this.sPath,o=this.oContext;if(this.isRelative()){k=this.oModel.resolve(k,o);}if(k){if(p){u=this.oModel._createRequestUrl(k,P);this.fireDataRequested();this.oModel.fireRequestSent({url:u,method:"GET",async:true});setTimeout(function(){t.bNeedsUpdate=true;t.checkUpdate();t.oModel.fireRequestCompleted({url:u,method:"GET",async:true,success:true});t.fireDataReceived({data:{}});},0);}else{this.bPendingRequest=true;this.fireDataRequested();h=this.sRefreshGroup?this.sRefreshGroup:this.sGroupId;this.mRequestHandles[G]=this.oModel.read(k,{groupId:h,urlParameters:P,success:j,error:E});}}};g.prototype.isLengthFinal=function(){return this.bLengthFinal;};g.prototype.getLength=function(){if(this.bLengthFinal||this.iLength==0){return this.iLength;}else{var A=this.iLastThreshold||this.iLastLength||10;return this.iLength+A;}};g.prototype._getLength=function(){var t=this;var G;if(this.sCountMode!==C.Request&&this.sCountMode!==C.Both){return;}var p=[];if(this.sFilterParams&&this.sOperationMode!=b.Auto){p.push(this.sFilterParams);}if(this.mParameters&&this.mParameters.custom){var o={custom:{}};q.each(this.mParameters.custom,function(s,v){o.custom[s]=v;});p.push(this.oModel.createCustomParams(o));}function _(D){t.iLength=parseInt(D,10);t.bLengthFinal=true;t.bLengthRequested=true;delete t.mRequestHandles[P];if(t.sOperationMode==b.Auto){if(t.iLength<=t.mParameters.threshold){t.bClientOperation=true;t.bThresholdRejected=false;}else{t.bClientOperation=false;t.bThresholdRejected=true;}t._fireChange({reason:c.Change});}}function h(E){delete t.mRequestHandles[P];var s="Request for $count failed: "+E.message;if(E.response){s+=", "+E.response.statusCode+", "+E.response.statusText+", "+E.response.body;}q.sap.log.warning(s);}var P=this.oModel.resolve(this.sPath,this.oContext);if(P){P=P+"/$count";G=this.sRefreshGroup?this.sRefreshGroup:this.sGroupId;this.mRequestHandles[P]=this.oModel.read(P,{withCredentials:this.oModel.bWithCredentials,groupId:G,urlParameters:p,success:_,error:h});}};g.prototype.refresh=function(h,G){if(typeof h==="string"){G=h;h=false;}this.sRefreshGroup=G;this._refresh(h);this.sRefreshGroup=undefined;};g.prototype._refresh=function(h,m,E){var j=false;this.bPendingRefresh=false;if(!h){if(E){var r=this.oModel.resolve(this.sPath,this.oContext);if(r){var o=this.oModel.oMetadata._getEntityTypeByPath(r);if(o&&(o.entityType in E)){j=true;}}}if(m&&!j){q.each(this.aKeys,function(i,k){if(k in m){j=true;return false;}});}if(!m&&!E){j=true;}}if(h||j){if(this.bSuspended&&!this.bIgnoreSuspend&&!h){this.bPendingRefresh=true;return;}this.abortPendingRequest();this.resetData();this._fireRefresh({reason:c.Refresh});}};g.prototype._fireRefresh=function(p){if(this.oModel.resolve(this.sPath,this.oContext)){this.bRefresh=true;this.fireEvent("refresh",p);}};g.prototype.initialize=function(){if(this.oModel.oMetadata&&this.oModel.oMetadata.isLoaded()&&this.bInitial){this.bInitial=false;this._initSortersFilters();if(!this.bSuspended){if(this.bDataAvailable){this._fireChange({reason:c.Change});}else{this._fireRefresh({reason:c.Refresh});}}}return this;};g.prototype.checkUpdate=function(h,m){var j=this.sChangeReason?this.sChangeReason:c.Change,k=false,o,t=this,r,R;if(this.bSuspended&&!this.bIgnoreSuspend&&!h){return false;}this.bIgnoreSuspend=false;if(!h&&!this.bNeedsUpdate){r=this.oModel._getObject(this.sPath,this.oContext);R=q.isArray(r)&&!q.sap.equal(r,this.aExpandRefs);this.aExpandRefs=r;if(R){this.aAllKeys=r;this.iLength=r.length;this.bLengthFinal=true;this.applyFilter();this.applySort();k=true;}else if(m){q.each(this.aKeys,function(i,K){if(K in m){k=true;return false;}});}else{k=true;}if(k&&this.aLastContexts){k=false;var l=this._getContexts(this.iLastStartIndex,this.iLastLength,this.iLastThreshold);if(this.aLastContexts.length!==l.length){k=true;}else{q.each(this.aLastContextData,function(i,n){o=t.getContextData(l[i]);if(n!==o){k=true;return false;}});}}}if(h||k||this.bNeedsUpdate){this.bNeedsUpdate=false;this._fireChange({reason:j});}this.sChangeReason=undefined;};g.prototype.resetData=function(){this.aKeys=[];this.aAllKeys=null;this.iLength=0;this.bLengthFinal=false;this.sChangeReason=undefined;this.bDataAvailable=false;this.bLengthRequested=false;switch(this.sOperationMode){default:case b.Server:this.bClientOperation=false;break;case b.Client:this.bClientOperation=true;break;case b.Auto:this.bClientOperation=false;break;}this.bThresholdRejected=false;if(this.sCountMode==C.None){this.bThresholdRejected=true;}};g.prototype.abortPendingRequest=function(){if(!q.isEmptyObject(this.mRequestHandles)){q.each(this.mRequestHandles,function(p,r){r.abort();});this.mRequestHandles={};this.bPendingRequest=false;}};g.prototype.getDownloadUrl=function(s){var p=[],P;if(s){p.push("$format="+encodeURIComponent(s));}if(this.sSortParams){p.push(this.sSortParams);}if(this.sFilterParams){p.push(this.sFilterParams);}if(this.sCustomParams){p.push(this.sCustomParams);}P=this.oModel.resolve(this.sPath,this.oContext);if(P){return this.oModel._createRequestUrl(P,null,p);}};g.prototype.sort=function(s,r){var h=false;this.bIgnoreSuspend=true;if(!s){s=[];}if(s instanceof S){s=[s];}this.aSorters=s;if(!this.bClientOperation){this.createSortParams(s);}if(!this.bInitial){if(this.bClientOperation){this.addSortComparators(s,this.oEntityType);if(this.aAllKeys){if(s.length==0){this.applyFilter();}else{this.applySort();}this._fireChange({reason:c.Sort});}else{this.sChangeReason=c.Sort;}}else{this.aKeys=[];this.abortPendingRequest();this.sChangeReason=c.Sort;this._fireRefresh({reason:this.sChangeReason});}this._fireSort({sorter:s});h=true;}if(r){return h;}else{return this;}};g.prototype.addSortComparators=function(s,E){var p,t;if(!E){q.sap.log.warning("Cannot determine sort comparators, as entitytype of the collection is unkown!");return;}q.each(s,function(i,o){if(!o.fnCompare){p=this.oModel.oMetadata._getPropertyMetadata(E,o.sPath);t=p&&p.type;o.fnCompare=O.getComparator(t);}}.bind(this));};g.prototype.applySort=function(){var t=this,o;this.aKeys=f.apply(this.aKeys,this.aSorters,function(r,p){o=t.oModel.getContext('/'+r);return t.oModel.getProperty(p,o);});};g.prototype.createSortParams=function(s){this.sSortParams=O.createSortParams(s);};g.prototype.filter=function(h,s,r){var i=false;this.bIgnoreSuspend=true;if(!h){h=[];}if(h instanceof d){h=[h];}if(s===F.Application){this.aApplicationFilters=h;}else{this.aFilters=h;}h=this.aFilters.concat(this.aApplicationFilters);if(!h||!q.isArray(h)||h.length===0){this.aFilters=[];this.aApplicationFilters=[];}if(!this.bClientOperation){this.createFilterParams(h);}if(!this.bInitial){if(this.bClientOperation){if(this.aAllKeys){this.applyFilter();this.applySort();this._fireChange({reason:c.Filter});}else{this.sChangeReason=c.Filter;}}else{this.resetData();this.abortPendingRequest();this.sChangeReason=c.Filter;this._fireRefresh({reason:this.sChangeReason});}if(s===F.Application){this._fireFilter({filters:this.aApplicationFilters});}else{this._fireFilter({filters:this.aFilters});}i=true;}if(r){return i;}else{return this;}};g.prototype.applyFilter=function(){var t=this,o,h=this.aFilters.concat(this.aApplicationFilters),j=[];q.each(h,function(i,k){if(k instanceof a){j.push(k.convert());}else{j.push(k);}});this.aKeys=e.apply(this.aAllKeys,j,function(r,p){o=t.oModel.getContext('/'+r);return t.oModel.getProperty(p,o);});this.iLength=this.aKeys.length;};g.prototype.createFilterParams=function(h){this.sFilterParams=O.createFilterParams(h,this.oModel.oMetadata,this.oEntityType);};g.prototype._initSortersFilters=function(){var r=this.oModel.resolve(this.sPath,this.oContext);if(!r){return;}this.oEntityType=this._getEntityType();if(!this.bClientOperation){this.createSortParams(this.aSorters);this.createFilterParams(this.aFilters.concat(this.aApplicationFilters));}};g.prototype._getEntityType=function(){var r=this.oModel.resolve(this.sPath,this.oContext);if(r){var E=this.oModel.oMetadata._getEntityTypeByPath(r);return E;}return undefined;};g.prototype.resume=function(){this.bIgnoreSuspend=false;this.bSuspended=false;if(this.bPendingRefresh){this._refresh();}else{this.checkUpdate();}};return g;});
