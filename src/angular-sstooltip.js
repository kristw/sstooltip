// Define module using Universal Module Definition pattern
// https://github.com/umdjs/umd/blob/master/amdWeb.js

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // Support AMD. Register as an anonymous module.
    // EDIT: List all dependencies in AMD style
    define(['jquery', 'angular', 'sstooltip'], factory);
  } else {
    // No AMD. Set module as a global variable
    // EDIT: Pass dependencies to factory function
    factory(root.$, root.angular, root.sstooltip);
  }
}(this,
//EDIT: The dependencies are passed to this function
function ($, angular, sstooltip) {
  //---------------------------------------------------
  // BEGIN code for this module
  //---------------------------------------------------

  function safeApply(scope, fn) {
    if(scope.$$phase || scope.$root.$$phase) fn();
    else scope.$apply(fn);
  }

  var isFunction = function (functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  };

  var module = angular.module('sstooltip', []);

  module.directive('sstooltip', [function (){
    return {
      restrict: 'AE',
      replace: true,
      template: '<div class="sstooltip-container"><div class="sstooltip"><div ng-if="tooltipText">{{tooltipText}}</div><div ng-if="tooltipSrc"><ng-include src="tooltipSrc"></ng-include></div></div></div>',
      scope:{
        tooltipKey: '@',
        tooltipSrc: '=',
        tooltipText: '='
      },
      link: function(scope, element, attrs) {

        /* jshint ignore:start */
        var tooltipElement = element[0].querySelector('.sstooltip');
        var tip = new sstooltip(tooltipElement);
        /* jshint ignore:end */

        if(attrs.tooltipTheme){
          angular.element(tooltipElement).addClass('sstooltip-'+attrs.tooltipTheme);
        }

        scope.$on('sstooltip:show', function(event, tooltipKey, data){
          if(tooltipKey==scope.tooltipKey){
            safeApply(scope, function(){
              scope.data = data.data;
            });
            tip.show(null, data.mouseEvent);
          }
        });

        scope.$on('sstooltip:move', function(event, tooltipKey, data){
          if(tooltipKey==scope.tooltipKey){
            tip.show(null, data.mouseEvent);
          }
        });

        scope.$on('sstooltip:hide', function(){
          tip.hide();
        });
      }
    };
  }]);

  /**
   * Given a function or object
   * if is function, apply the function to given value
   * if is object, return the object
   * other wise return default value
   * @param  {[type]} fnOrObj      [description]
   * @param  {[type]} value        [description]
   * @param  {[type]} defaultValue [description]
   * @return {[type]}              [description]
   */
  function magic(fnOrObj, value, defaultValue){
    if(isFunction(fnOrObj)){
      return fnOrObj(value);
    }
    else{
      return fnOrObj ? fnOrObj : defaultValue;
    }
  }

  module.factory('sstooltipManager', [function(){
    return function($scope, tooltipKey){

      function triggerOnScopeEvents(triggerShowEvent, triggerMoveEvent, triggerHideEvent, dataFn, mouseEventFn){
        // register events that trigger tooltip to show
        if(triggerShowEvent){
          $scope.$on(triggerShowEvent, function(event, data){
            show(
              magic(mouseEventFn, data, data.mouseEvent),
              magic(dataFn, data, data.data)
            );
          });
        }
        // register events that trigger tooltip to move
        if(triggerMoveEvent){
          $scope.$on(triggerMoveEvent, function(event, data){
            move(
              magic(mouseEventFn, data, data.mouseEvent),
              magic(dataFn, data, data.data)
            );
          });
        }
        // register events that trigger tooltip to hide
        if(triggerHideEvent){
          $scope.$on(triggerHideEvent, function(){
            hide();
          });
        }
      }

      function triggerOnDomEvents(dom, triggerShowEvent, triggerMoveEvent, triggerHideEvent, dataFn){
        var $dom = angular.element(dom);

        // register events that trigger tooltip to show
        if(triggerShowEvent){
          $dom.on(triggerShowEvent, function(mouseEvent){
            show(mouseEvent, magic(dataFn, mouseEvent, mouseEvent.data));
          });
        }
        // register events that trigger tooltip to move
        if(triggerMoveEvent){
          $dom.on(triggerMoveEvent, function(mouseEvent){
            move(mouseEvent, magic(dataFn, mouseEvent, mouseEvent.data));
          });
        }
        // register events that trigger tooltip to hide
        if(triggerHideEvent){
          $dom.on(triggerHideEvent, hide);
        }
      }

      function show(mouseEvent, data){
        $scope.$broadcast('sstooltip:show', tooltipKey, {
          mouseEvent: mouseEvent,
          data: data
        });
      }

      function move(mouseEvent, data){
        $scope.$broadcast('sstooltip:move', tooltipKey, {
          mouseEvent: mouseEvent,
          data: data
        });
      }

      function hide(){
        $scope.$broadcast('sstooltip:hide', tooltipKey);
      }

      return{
        triggerOnScopeEvents: triggerOnScopeEvents,
        triggerOnDomEvents: triggerOnDomEvents,
        show: show,
        move: move,
        hide: hide
      };
    };
  }]);

  return module;

  //---------------------------------------------------
  // END code for this module
  //---------------------------------------------------
}));




