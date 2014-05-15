// Uses AMD or browser globals to create a module.

// If you want something that will also work in Node, see returnExports.js
// If you want to support other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "amdWeb" that depends another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    root.sstooltip = factory($);
  }
}(this, function ($) {

  var DEFAULT_OPTIONS = {
    xOffset: 20,
    yOffset: 10
  };

  var sstooltip = function(_dom, _options){
    //---------------------------------------------------
    // Init
    //---------------------------------------------------
    var $tooltip = $(_dom).addClass("sstooltip");
    var $parent  = $tooltip.parent();
    var $window  = $(window);

    var options = $.extend({}, DEFAULT_OPTIONS, _options);

    if(options.width){
      $tooltip.css("width", width);
    }

    hide();

    //---------------------------------------------------
    // Functions
    //---------------------------------------------------
    function show(content, event){
      if(content){
        $tooltip.html(content);
      }
      _dom.style.display = 'block';
      updatePosition(event);
    }

    function hide(){
      _dom.style.display = 'none';
    }

    function updatePosition(event){
      // Offset from mouse position
      var xOffset = options.xOffset;
      var yOffset = options.yOffset;

      // Tooltip dimension
      var ttw = $tooltip.width();
      var tth = $tooltip.height();

      // Scroll position
      var wscrY = $window.scrollTop();
      var wscrX = $window.scrollLeft();

      // Mouse position
      var curX = (document.all) ? event.clientX + wscrX : event.pageX;
      var curY = (document.all) ? event.clientY + wscrY : event.pageY;

      // Calculate position
      var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $window.width()) ? curX - ttw - xOffset*2 : curX + xOffset;
      if (ttleft < wscrX + xOffset){
        ttleft = wscrX + xOffset;
      }
      var tttop = ((curY - wscrY + yOffset*2 + tth) > $window.height()) ? curY - tth - yOffset*2 : curY + yOffset;
      if (tttop < wscrY + yOffset){
        tttop = curY + yOffset;
      }

      // Adjust to offset container position
      var parentOffset = $parent.offset();
      tttop  -= Math.round(parentOffset.top);
      ttleft -= Math.round(parentOffset.left);

      // Set tooltip final position
      _dom.style.top  = tttop  + 'px';
      _dom.style.left = ttleft + 'px';
    }

    function bind(selector, content){
      var $target = $(selector);
      $target.on("mouseover", function(event){
        if($.isFunction(content)){
          show(content.call(this), event);
        }
        else{
          show(content, event);
        }
      });
      $target.on("mousemove", updatePosition);
      $target.on("mouseout",  hide);
    }

    return {
      show: show,
      hide: hide,
      updatePosition: updatePosition,
      bind: bind,
      version: "2.1.0"
    };
  };

  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return sstooltip;
}));

