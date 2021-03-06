/*
 * 
 * UI5Strap
 *
 * pks.ui5strap.bs3.Popover
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

sap.ui.define(['./library', "../core/library", './Tooltip'], function(ui5strapBs3Lib, ui5strapCoreLib, Tooltip){
	
	"use strict";
	
	/**
	 * Constructor for a new Popover instance.
	 * 
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 * 
	 * @class
	 * Control for creating Bootstrap popovers.
	 * @extends pks.ui5strap.core.ControlBase
	 * 
	 * @author Jan Philipp Knoeller
	 * @version 1.0.2-SNAPSHOT
	 * 
	 * @constructor
	 * @public
	 * @alias pks.ui5strap.bs3.Popover
	 * 
	 */
	var Popover = Tooltip.extend("pks.ui5strap.bs3.Popover", /** @lends pks.ui5strap.bs3.Popover.prototype */ {
    metadata : {

      // ---- object ----
      defaultAggregation : "content",
      // ---- control specific ----
      library : "pks.ui5strap.bs3",
      
      properties : {
         trigger : {
            type: "pks.ui5strap.bs3.TriggerMode", 
            defaultValue: ui5strapBs3Lib.TriggerMode.Click
        },
        text : {
          type:"string", defaultValue:""
        },
        contentPlacement : {
          type:"pks.ui5strap.core.ContentPlacement",
          defaultValue : ui5strapCoreLib.ContentPlacement.Start
        }
      },

      aggregations : { 
        content : {singularName: "content"},
      }

    }
  });

  Popover.lastShownInstance = null;
  
  /**
	 * Returns the style prefix of this control.
	 * @override
	 * @protected
	 */
	Popover.prototype._getStyleClassPrefix = function(){
		return "ui5strapPopover";
	};
  
  Popover.prototype.onAfterRendering = function(){
    var $this = this.$(),
        _this = this;

    var popoverOptions = {
      animation : this.getAnimate(),

      title : function(){
        return $this.find('.popover-data-title').html();
      },
      content : function(){
        return $this.find('.popover-data-content').html();
      },
      
      trigger : ui5strapBs3Lib.BSTriggerMode[this.getTrigger()],
      html : true
    };

    var placement = this.getPlacement();
    if(placement !== ui5strapBs3Lib.Placement.None){
        if(placement !== ui5strapBs3Lib.Placement.Default){
          popoverOptions.placement = ui5strapBs3Lib.BSPlacement[placement];
        }
        this.getSourceDomRef().popover(popoverOptions);
    }

    this.getSourceDomRef().on('hidden.bs.popover', function(){
        _this.fireHidden();
    }).on('shown.bs.popover', function(){
        _this.fireShown();
    });
  };

  Popover.prototype.show = function(){
    var lastShownInstance = Popover.lastShownInstance;
    if(null !== lastShownInstance && lastShownInstance !== this){
        lastShownInstance.hide();
    }

    Popover.lastShownInstance = this;
    this.getSourceDomRef().popover('show');
  };

  Popover.prototype.hide = function(){
      this.getSourceDomRef().popover('hide');
  };

  Popover.prototype.toggle = function(){
      this.getSourceDomRef().popover('toggle');
  };
 
  return Popover;
});

/* ========================================================================
 * Bootstrap: popover.js v3.1.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);