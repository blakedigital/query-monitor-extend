jQuery(function($) {

    $(".qmx-switch input").on('change',function() {

        var label  = $(this).closest('label'),
            filter = $(this).attr('data-filter'),
            table  = $(this).closest('table'),
            tr     = table.find('tbody tr[data-qm-' + filter + ']'),
            val    = $(this).val();

        var option = table.find('select.qm-filter[data-filter="' + filter + '"] option[value="' + val + '"]');
        var matches = tr.filter('[data-qm-' + filter + '*="' + val + '"]');

        if ($(this).is(':checked')) {
            option.removeClass('qm-hide');
            matches.removeClass('qm-hide');
        } else {
            option.addClass('qm-hide');
            matches.addClass('qm-hide');
        }

        var visible = tr.filter(':visible');

        if ( tr.length === matches.length ) {
			table.find('.qm-items-shown.qm-was-hidden,.qm-items-highlighted.qm-was-hidden').removeClass('qm-was-hidden').addClass('qm-hide');
		} else {
            var results = table.find('.qm-items-shown');
            results.filter('.qm-hide').addClass('qm-was-hidden').removeClass('qm-hide');
            results.find('.qm-items-number').text( QM_i18n.number_format( visible.length, 0 ) );
        }

        if ( visible.length === tr.length )
            results.addClass('qm-hide');

    });

    $("#qm-qmx-included_files table").on('qm-filtered',function(ev,rows) {
        var filesize = 0;
        rows.each(function(row) {
            filesize = filesize + parseInt( $(row).find('td.qmx-includedfiles-filesize').attr('data-qm-sort-weight') );
        });
        $("#qm-qmx-included_files table.qm-sortable tfoot .qm-items-filesize").text(filesize / 1024 + ' KB');
    });

    $("#qm-qmx-included_files .qmx-switch input[value='Plugin: query-monitor']").on('change',function() {
        var qm = $(this);
        var qmx = $(this).closest('.qmx-switch').parent().find('.qmx-switch input[value="Plugin: query-monitor-extend"]');
        if (!qm.is(':checked') && qmx.is(':checked')) {
            qmx.removeAttr('checked');
        } else if (qm.is(':checked') && !qmx.is(':checked'))
            qmx.attr('checked','checked');
    });

    var qmx_time_months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var qmx_time_days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    var qmx_time_container = document.getElementById('qm-qmx-time');
    var qmx_time_tbody = $("#qm-qmx-time > table > tbody");
    var qmx_time_utc = qmx_time_tbody.find('td.utc');
    var qmx_time_server = qmx_time_tbody.find('td.server');
    var qmx_time_wp = qmx_time_tbody.find('td.wp');
    var qmx_time_browser = qmx_time_tbody.find('td.browser');

    var qmx_time_interval = 0;

    if (qmx_time_container) {

        var visibility_monitor = VisSense(qmx_time_container).monitor({
            visible: function() {
                qmx_time_interval = setInterval(function() {
                    var d = new Date();
                    var UTC_string = d.toUTCString();
                    var server = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000));
                    var wp = new Date(server.valueOf() + (parseInt(qmx_time_wp.attr('data-offset')) * 1000));

                    qmx_time_utc.html(
                        qmx_time_days[d.getUTCDay()] + ', '
                        + qmx_time_months[d.getUTCMonth()] + ' '
                        + d.getUTCDate() + ', '
                        + d.getUTCFullYear() + ' '
                        + (10 > d.getUTCHours() ? '0' : '') + d.getUTCHours()
                        + ':' + (10 > d.getUTCMinutes() ? '0' : '') + d.getUTCMinutes()
                        + ':' + (10 > d.getUTCSeconds() ? '0' : '') + d.getUTCSeconds()
                    );

                    qmx_time_server.html(
                        qmx_time_days[server.getDay()] + ', '
                        + qmx_time_months[server.getMonth()] + ' '
                        + server.getDate() + ', '
                        + server.getFullYear() + ' '
                        + (10 > server.getHours() ? '0' : '') + server.getHours()
                        + ':' + (10 > server.getMinutes() ? '0' : '') + server.getMinutes()
                        + ':' + (10 > server.getSeconds() ? '0' : '') + server.getSeconds()
                    );

                    qmx_time_wp.html(
                        qmx_time_days[wp.getDay()] + ', '
                        + qmx_time_months[wp.getMonth()] + ' '
                        + wp.getDate() + ', '
                        + wp.getFullYear() + ' '
                        + (10 > wp.getHours() ? '0' : '') + wp.getHours()
                        + ':' + (10 > wp.getMinutes() ? '0' : '') + wp.getMinutes()
                        + ':' + (10 > wp.getSeconds() ? '0' : '') + wp.getSeconds()
                    );

                    qmx_time_browser.html(
                        qmx_time_days[d.getDay()] + ', '
                        + qmx_time_months[d.getMonth()] + ' '
                        + d.getDate() + ', '
                        + d.getFullYear() + ' '
                        + (10 > d.getHours() ? '0' : '') + d.getHours()
                        + ':' + (10 > d.getMinutes() ? '0' : '') + d.getMinutes()
                        + ':' + (10 > d.getSeconds() ? '0' : '') + d.getSeconds()
                    );
                },1000);
            },
            hidden: function() {
                clearInterval(qmx_time_interval);
            }
        }).start();

    }

});

/* https://github.com/vissense/vissense v0.10.0 */
!function(a,b,c){"use strict";var d=function(a){var b=c(a,a.document);return b.noConflict=function(){return b},b};if("function"==typeof define&&define.amd)define([],function(){return d});else if("object"==typeof exports)module.exports=function(a){return d(a)};else{var e=a[b],f=c(a,a.document);a[b]=f,a[b].noConflict=function(){return a[b]=e,f}}}(this,"VisSense",function(a,b,c){"use strict";function d(a,b){return function(){var d=arguments;return g(function(){a.apply(c,d)},b||0)}}function e(a,b){var c=q;return function(){var d=this,e=arguments;c(),c=g(function(){a.apply(d,e)},b)}}function f(a,b){var d=p(b),e=p(a);return d||e?d&&e?(j(Object.keys(b),function(d){a[d]===c&&(a[d]=b[d])}),a):d?b:a:b}function g(a,b){var c=setTimeout(function(){a()},b||0);return function(){clearTimeout(c)}}function h(a,b){return function(){return(o(a)?a():a)?b():c}}function i(a,b,c){for(var d=-1,e=Object.keys(b),f=e.length,g=o(c);++d<f;){var h=e[d];a[h]=g?c(a[h],b[h],h,a,b):b[h]}return a}function j(a,b,d){for(var e=0,f=a.length;f>e;e++){var g=b.call(d,a[e],e,a);if(g!==c)return g}}function k(a){return a}function l(a){return a!==c}function m(a){return a&&"object"==typeof a&&"number"==typeof a.length&&"[object Array]"===Object.prototype.toString.call(a)||!1}function n(a){return a&&1===a.nodeType||!1}function o(a){return"function"==typeof a||!1}function p(a){var b=typeof a;return"function"===b||a&&"object"===b||!1}function q(){}function r(){return(new Date).getTime()}function s(a){var b,d=!1;return function(){return d||(b=a.apply(c,arguments),d=!0),b}}function t(a,b,c){var d=q,e=!1;return function(){var f=r(),h=arguments,i=function(){e=f,a.apply(c,h)};e&&e+b>f?(d(),d=g(i,b)):(e=f,g(i,0))}}function u(b){var c=b||a;return{height:c.innerHeight,width:c.innerWidth}}function v(b,c){return(c||a).getComputedStyle(b,null)}function w(a,b){return a.getPropertyValue(b)}function x(a,b){b||(b=v(a));var c=w(b,"display");if("none"===c)return!1;var d=a.parentNode;return n(d)?x(d):!0}function y(b,c){if(b===(c||a).document)return!0;if(!b||!b.parentNode)return!1;var d=v(b,c),e=w(d,"visibility");return"hidden"===e||"collapse"===e?!1:x(b,d)}function z(a,b){return!a||a.width<=0||a.height<=0?!1:a.bottom>0&&a.right>0&&a.top<b.height&&a.left<b.width}function A(a,b){var c=a.getBoundingClientRect(),d=u(b);if(!z(c,d)||!y(a))return 0;var e=0,f=0;return c.top>=0?e=Math.min(c.height,d.height-c.top):c.bottom>0&&(e=Math.min(d.height,c.bottom)),c.left>=0?f=Math.min(c.width,d.width-c.left):c.right>0&&(f=Math.min(d.width,c.right)),e*f/(c.height*c.width)}function B(b){return!F(b||a).isHidden()}function C(b,c){if(!(this instanceof C))return new C(b,c);if(!n(b))throw new Error("not an element node");this._element=b,this._config=f(c,{fullyvisible:1,hidden:0,referenceWindow:a,percentageHook:A,precision:3,visibilityHooks:[]});var d=this._config.precision<=0?1:Math.pow(10,this._config.precision||3);this._round=function(a){return Math.round(a*d)/d};var e=F(this._config.referenceWindow);this._config.visibilityHooks.push(function(){return!e.isHidden()})}function D(a,b){var c=a.state(),d=c.percentage;return b&&d===b.percentage&&b.percentage===b.previous.percentage?b:c.hidden?C.VisState.hidden(d,b):c.fullyvisible?C.VisState.fullyvisible(d,b):C.VisState.visible(d,b)}function E(a,b){var c=f(b,{strategy:[new E.Strategy.PollingStrategy,new E.Strategy.EventStrategy],async:!1});this._visobj=a,this._state={},this._started=!1;var d="*#"+r();this._pubsub=new G({async:c.async,anyTopicName:d}),this._events=[d,"start","stop","update","hidden","visible","fullyvisible","percentagechange","visibilitychange"],this._strategy=new E.Strategy.CompositeStrategy(c.strategy),this._strategy.init(this),this._pubsub.on("update",function(a){var b=a._state.percentage,c=a._state.previous.percentage;b!==c&&a._pubsub.publish("percentagechange",[a,b,c])}),this._pubsub.on("update",function(a){a._state.code!==a._state.previous.code&&a._pubsub.publish("visibilitychange",[a])}),this._pubsub.on("visibilitychange",function(a){a._state.visible&&!a._state.previous.visible&&a._pubsub.publish("visible",[a])}),this._pubsub.on("visibilitychange",function(a){a._state.fullyvisible&&a._pubsub.publish("fullyvisible",[a])}),this._pubsub.on("visibilitychange",function(a){a._state.hidden&&a._pubsub.publish("hidden",[a])}),j(this._events,function(a){o(c[a])&&this.on(a,c[a])},this)}var F=function(b){return function(a,b){var c=function(a,b){return{property:a,event:b}},d="visibilitychange",e=[c("webkitHidden","webkit"+d),c("msHidden","ms"+d),c("mozHidden","moz"+d),c("hidden",d)],f=j(e,function(c){return a[c.property]!==b?{isHidden:function(){return!!a[c.property]||!1},onVisibilityChange:function(b){return a.addEventListener(c.event,b,!1),function(){a.removeEventListener(c.event,b,!1)}}}:void 0});return f||{isHidden:function(){return!1},onVisibilityChange:function(){return q}}}((b||a).document)},G=function(a){function b(a){this._cache={},this._onAnyCache=[],this._config=f(a,{async:!1,anyTopicName:"*"})}var c=function(a,b){j(a,function(a){a(b)})};return b.prototype.on=function(b,c){if(!o(c))return q;var e=function(b){return c.apply(a,b||[])},f=this._config.async?d(e):e,g=function(a,b,c){return function(){var c=b.indexOf(a);return c>-1?(b.splice(c,1),!0):!1}};return b===this._config.anyTopicName?(this._onAnyCache.push(f),g(f,this._onAnyCache,"*")):(this._cache[b]||(this._cache[b]=[]),this._cache[b].push(f),g(f,this._cache[b],b))},b.prototype.publish=function(a,b){var e=(this._cache[a]||[]).concat(a===this._config.anyTopicName?[]:this._onAnyCache),f=!!this._config.async,g=f?d(c):function(a,b){return c(a,b),q};return g(e,b||[])},b}();C.prototype.state=function(){var a=j(this._config.visibilityHooks,function(a){return a(this._element)?void 0:C.VisState.hidden(0)},this);return a||function(a,b,c){var d=a._round(c.percentageHook(b,c.referenceWindow));return d<=c.hidden?C.VisState.hidden(d):d>=c.fullyvisible?C.VisState.fullyvisible(d):C.VisState.visible(d)}(this,this._element,this._config)},C.prototype.percentage=function(){return this.state().percentage},C.prototype.element=function(){return this._element},C.prototype.referenceWindow=function(){return this._config.referenceWindow},C.prototype.isFullyVisible=function(){return this.state().fullyvisible},C.prototype.isVisible=function(){return this.state().visible},C.prototype.isHidden=function(){return this.state().hidden},C.fn=C.prototype,C.of=function(a,b){return new C(a,b)};var H={HIDDEN:[0,"hidden"],VISIBLE:[1,"visible"],FULLY_VISIBLE:[2,"fullyvisible"]};return C.VisState=function(){function a(a,b,c){return c&&delete c.previous,{code:a[0],state:a[1],percentage:b,previous:c||{},fullyvisible:a[0]===H.FULLY_VISIBLE[0],visible:a[0]===H.VISIBLE[0]||a[0]===H.FULLY_VISIBLE[0],hidden:a[0]===H.HIDDEN[0]}}return{hidden:function(b,c){return a(H.HIDDEN,b,c)},visible:function(b,c){return a(H.VISIBLE,b,c)},fullyvisible:function(b,c){return a(H.FULLY_VISIBLE,b,c)}}}(),E.prototype.visobj=function(){return this._visobj},E.prototype.publish=function(a,b){var c=this._events.indexOf(a)>=0;if(c)throw new Error('Cannot publish internal event "'+a+'" from external scope.');return this._pubsub.publish(a,b)},E.prototype.state=function(){return this._state},E.prototype.start=function(a){if(this._started)return this;var b=f(a,{async:!1});return this._cancelAsyncStart&&this._cancelAsyncStart(),b.async?this.startAsync():(this._started=!0,this.update(),this._pubsub.publish("start",[this]),this._strategy.start(this),this)},E.prototype.startAsync=function(a){this._cancelAsyncStart&&this._cancelAsyncStart();var b=this,c=g(function(){b.start(i(f(a,{}),{async:!1}))});return this._cancelAsyncStart=function(){c(),b._cancelAsyncStart=null},this},E.prototype.stop=function(){this._cancelAsyncStart&&this._cancelAsyncStart(),this._started&&(this._strategy.stop(this),this._pubsub.publish("stop",[this])),this._started=!1},E.prototype.update=function(){this._started&&(this._state=D(this._visobj,this._state),this._pubsub.publish("update",[this]))},E.prototype.on=function(a,b){return this._pubsub.on(a,b)},E.Builder=function(){var a=function(a,b){var c=null,d=a.strategy===!1,e=!d&&(a.strategy||b.length>0);if(e){var f=!!a.strategy,g=m(a.strategy),h=f?g?a.strategy:[a.strategy]:[];c=h.concat(b)}else c=d?[]:a.strategy;return c};return function(b){var c={},d=[],e=[],f=!1,g=null;return{set:function(a,b){return c[a]=b,this},strategy:function(a){return d.push(a),this},on:function(a,b){return e.push([a,b]),this},build:function(h){var i=function(){var h=a(c,d);c.strategy=h;var i=b.monitor(c);return j(e,function(a){i.on(a[0],a[1])}),f=!0,g=i},k=f?g:i();return o(h)?h(k):k}}}}(),E.Strategy=function(){},E.Strategy.prototype.init=q,E.Strategy.prototype.start=q,E.Strategy.prototype.stop=q,E.Strategy.CompositeStrategy=function(a){this._strategies=m(a)?a:[a]},E.Strategy.CompositeStrategy.prototype=Object.create(E.Strategy.prototype),E.Strategy.CompositeStrategy.prototype.init=function(a){j(this._strategies,function(b){o(b.init)&&b.init(a)})},E.Strategy.CompositeStrategy.prototype.start=function(a){j(this._strategies,function(b){o(b.start)&&b.start(a)})},E.Strategy.CompositeStrategy.prototype.stop=function(a){j(this._strategies,function(b){o(b.stop)&&b.stop(a)})},E.Strategy.PollingStrategy=function(a){this._config=f(a,{interval:1e3}),this._started=!1},E.Strategy.PollingStrategy.prototype=Object.create(E.Strategy.prototype),E.Strategy.PollingStrategy.prototype.start=function(a){return this._started||(this._clearInterval=function(b){var c=setInterval(function(){a.update()},b);return function(){clearInterval(c)}}(this._config.interval),this._started=!0),this._started},E.Strategy.PollingStrategy.prototype.stop=function(){return this._started?(this._clearInterval(),this._started=!1,!0):!1},E.Strategy.EventStrategy=function(a){this._config=f(a,{throttle:50}),this._config.debounce>0&&(this._config.throttle=+this._config.debounce),this._started=!1},E.Strategy.EventStrategy.prototype=Object.create(E.Strategy.prototype),E.Strategy.EventStrategy.prototype.start=function(a){return this._started||(this._removeEventListeners=function(b){var c=a.visobj().referenceWindow(),d=F(c),e=d.onVisibilityChange(b);return c.addEventListener("scroll",b,!1),c.addEventListener("resize",b,!1),c.addEventListener("touchmove",b,!1),function(){c.removeEventListener("touchmove",b,!1),c.removeEventListener("resize",b,!1),c.removeEventListener("scroll",b,!1),e()}}(t(function(){a.update()},this._config.throttle)),this._started=!0),this._started},E.Strategy.EventStrategy.prototype.stop=function(){return this._started?(this._removeEventListeners(),this._started=!1,!0):!1},C.VisMon=E,C.PubSub=G,C.fn.monitor=function(a){return new E(this,a)},C.Utils={async:d,debounce:e,defaults:f,defer:g,extend:i,forEach:j,fireIf:h,identity:k,isArray:m,isDefined:l,isElement:n,isFunction:o,isObject:p,isPageVisible:B,isVisibleByStyling:y,noop:q,now:r,once:s,throttle:t,percentage:A,VisibilityApi:F(),createVisibilityApi:F,_viewport:u,_isInViewport:z,_isDisplayed:x,_computedStyle:v,_styleProperty:w},C});
