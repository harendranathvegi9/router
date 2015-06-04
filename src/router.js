(function(win){
    'use strict';

    var has = {}.hasOwnProperty,
    paramRe = /:([^\/.\\]+)/g;

    function Router(routes){
        if(!(this instanceof Router)){
            return new Router(routes);
        }
        this.routes = [];
        if(routes){
            for(var path in routes){
                if(has.call(routes, path)){
                    this.route(path, routes[path]);
                }
            }
        }
    }

    Router.prototype.route = function(path, fn){
        paramRe.lastIndex = 0;
        var regexp = path + '', match;
        while(match = paramRe.exec(path)){
            regexp = regexp.replace(match[0], '([^/\\\\]+)'); 
        }
        this.routes.push({
            regexp: new RegExp('^' + regexp + '$'),
            callback: fn
        });
        return this;
    };

    Router.prototype.dispatch = function(path){
        path = path || win.location.pathname;
        for(var i = 0, len = this.routes.length, route, matches; i < len; i++){
            route = this.routes[i];
            matches = route.regexp.exec(path);
            if(matches && matches[0]){
                route.callback.apply(null, matches.slice(1));
                return this; 
            }
        }
        return this;
    };

    win.Router = Router;

})(this);