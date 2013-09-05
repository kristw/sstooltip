var sstooltip = function(_tooltip_id, _options){
  var DEFAULT_OPTIONS = {
    xOffset: 20,
    yOffset: 10
  };

  //---------------------------------------------------
  // Init
  //---------------------------------------------------
  var $tooltip = $("#"+_tooltip_id).addClass("sstooltip");

  var options = $.extend({},DEFAULT_OPTIONS);
  if(_options){
    options = $.extend(options, _options);
  }

  if(options.width){
    $tooltip.css("width", width);
  }

  hide();

  //---------------------------------------------------
  // Functions
  //---------------------------------------------------
  function show(content, event){
    $tooltip.html(content);
    $tooltip.show();

    updatePosition(event);
  }

  function hide(){
    $tooltip.hide();
  }

  function updatePosition(event){
    var xOffset = options.xOffset;
    var yOffset = options.yOffset;

    var ttw = $tooltip.width();
    var tth = $tooltip.height();
    var wscrY = $(window).scrollTop();
    var wscrX = $(window).scrollLeft();
    var curX = (document.all) ? event.clientX + wscrX : event.pageX;
    var curY = (document.all) ? event.clientY + wscrY : event.pageY;
    var ttleft = ((curX - wscrX + xOffset*2 + ttw) > $(window).width()) ? curX - ttw - xOffset*2 : curX + xOffset;
    if (ttleft < wscrX + xOffset){
      ttleft = wscrX + xOffset;
    }
    var tttop = ((curY - wscrY + yOffset*2 + tth) > $(window).height()) ? curY - tth - yOffset*2 : curY + yOffset;
    if (tttop < wscrY + yOffset){
      tttop = curY + yOffset;
    }
    $tooltip.css('top', tttop + 'px').css('left', ttleft + 'px');
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
    $target.on("mousemove", function(event){
      updatePosition(event);
    });
    $target.on("mouseout", function(){
      hide();
    });
  }

  return {
    show: show,
    hide: hide,
    updatePosition: updatePosition,
    bind: bind
  };
};