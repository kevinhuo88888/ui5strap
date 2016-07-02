/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control'],function(q,l,C){"use strict";var F=C.extend("sap.m.FormattedText",{metadata:{library:"sap.m",properties:{htmlText:{type:"string",group:"Misc",defaultValue:""},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null}}}});var _={};_.ATTRIBS={'style':1,'class':1,'a::href':1,'a::target':1};_.ELEMENTS={'a':{cssClass:'sapMLink'},'abbr':1,'blockquote':1,'br':1,'cite':1,'code':1,'em':1,'h1':{cssClass:'sapMTitle sapMTitleStyleH1'},'h2':{cssClass:'sapMTitle sapMTitleStyleH2'},'h3':{cssClass:'sapMTitle sapMTitleStyleH3'},'h4':{cssClass:'sapMTitle sapMTitleStyleH4'},'h5':{cssClass:'sapMTitle sapMTitleStyleH5'},'h6':{cssClass:'sapMTitle sapMTitleStyleH6'},'p':1,'pre':1,'strong':1,'span':1,'u':1,'dl':1,'dt':1,'dd':1,'ol':1,'ul':1,'li':1};F.prototype.init=function(){};function s(t,a){var w;var b,v,c=t==="a";var d=_.ELEMENTS[t].cssClass||"";for(var i=0;i<a.length;i+=2){b=a[i];v=a[i+1];if(!_.ATTRIBS[b]&&!_.ATTRIBS[t+"::"+b]){w='FormattedText: <'+t+'> with attribute ['+b+'="'+v+'"] is not allowed';q.sap.log.warning(w,this);a[i+1]=null;continue;}if(b=="href"){if(!q.sap.validateUrl(v)){q.sap.log.warning("FormattedText: incorrect href attribute:"+v,this);a[i+1]="#";c=false;}}if(b=="target"){c=false;}if(d&&b.toLowerCase()=="class"){a[i+1]=d+" "+v;d="";}}if(c){a.push("target");a.push("_blank");}if(d){a.push("class");a.push(d);}return a;}function p(t,a){if(_.ELEMENTS[t]){return s(t,a);}else{var w='<'+t+'> is not allowed';q.sap.log.warning(w,this);}}function o(e){var n=window.open();n.opener=null;n.location=e.currentTarget.href;e.preventDefault();}F.prototype.onAfterRendering=function(){this.$().find('a[target="_blank"]').on("click",o);};F.prototype.setHtmlText=function(t){var S="";function u(U){if(q.sap.validateUrl(U)){return U;}}S=q.sap._sanitizeHTML(t,{tagPolicy:p,uriRewriter:u});this.setProperty("htmlText",S);};return F;},true);
