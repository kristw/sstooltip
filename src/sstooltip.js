// Define module using Universal Module Definition pattern
// https://github.com/umdjs/umd/blob/master/amdWeb.js

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
    yOffset: 10,
    compensatedXOffset: 6, // when the tooltip is on the left
    compensatedYOffset: 0  // when the tooltip is on the top
  };

  var sstooltip = function(node, customOptions){
    //---------------------------------------------------
    // Init
    //---------------------------------------------------
    var dom = $(node)[0];
    var $tooltip = $(node).addClass('sstooltip');
    var $parent  = $tooltip.parent();
    var $window  = $(window);

    var options = $.extend({}, DEFAULT_OPTIONS, customOptions);

    if(options.width){
      $tooltip.css('width', width);
    }

    hide();

    //---------------------------------------------------
    // Functions
    //---------------------------------------------------
    function show(content, event){
      switch(arguments.length){
        case 1:
          // if there is only one argument, assume that it is event
          // just update the position and do not update content
          dom.style.display = 'block';
          updatePosition(arguments[0]);
          break;
        case 2:
          if(content){
            $tooltip.html(content);
          }
          dom.style.display = 'block';
          updatePosition(event);
          break;
      }
    }

    function hide(){
      dom.style.display = 'none';
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
      var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $window.width()) ? curX - ttw - xOffset*2 + options.compensatedXOffset : curX + xOffset;
      if (ttleft < wscrX + xOffset){
        ttleft = wscrX + xOffset;
      }
      var tttop = ((curY - wscrY + yOffset*2 + tth) > $window.height()) ? curY - tth - yOffset*2 + options.compensatedYOffset : curY + yOffset;
      if (tttop < wscrY + yOffset){
        tttop = curY + yOffset;
      }

      // Adjust to offset container position
      var parentOffset = $parent.offset();
      tttop  -= Math.round(parentOffset.top);
      ttleft -= Math.round(parentOffset.left);

      // Set tooltip final position
      dom.style.top  = tttop  + 'px';
      dom.style.left = ttleft + 'px';
    }

    function bind(selector, content){
      var $target = $(selector);
      $target.on('mouseover', function(event){
        if($.isFunction(content)){
          show(content.call(this), event);
        }
        else{
          show(content, event);
        }
      });
      $target.on('mousemove', updatePosition);
      $target.on('mouseout',  hide);
    }

    return {
      show: show,
      hide: hide,
      bind: bind
    };
  };

  return sstooltip;
}));

