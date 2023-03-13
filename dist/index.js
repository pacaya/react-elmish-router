"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchGoForward = exports.dispatchGoBack = exports.dispatchNavigate = exports.initializeRouter = exports.routerReducer = exports.goForwardEffect = exports.goBackEffect = exports.navigateEffect = exports.filterMatch = void 0;
// Note: require is *necessary*  as 'route-parser' uses a different module format.
// If you change this code to use `import ParsedRoute from 'router-parser';` it *will* break.
const ParsedRoute = require("route-parser");
const react_use_elmish_1 = require("react-use-elmish");
function assertTrue(condition, reason) {
    if (!condition) {
        throw new Error(reason);
    }
}
function parseHashOrSearch(x) {
    if (x === '' || x === '#' || x === '?') {
        return false;
    }
    else {
        return x
            .substr(1)
            .split('&')
            .map(el => el.split('='))
            .reduce((prev, curr) => (Object.assign(Object.assign({}, prev), { [curr[0]]: curr[1] !== '' ? decodeURIComponent(curr[1]) : true })), {});
    }
}
function buildHash(values) {
    if (!values || Object.keys(values).length == 0) {
        return '';
    }
    else {
        const keyValuePairs = Object.keys(values).map(key => {
            if (values[key] == true) {
                return key;
            }
            return `${key}=${encodeURIComponent(values[key])}`;
        });
        return keyValuePairs.join('&');
    }
}
function filterMatch(obj) {
    return Object.keys(obj)
        .filter(x => obj[x])
        .reduce((prev, key) => (Object.assign(Object.assign({}, prev), { [key]: obj[key] })), {});
}
exports.filterMatch = filterMatch;
function encodeMatches(matches) {
    return Object.keys(matches).reduce((prev, curr) => {
        const value = matches[curr];
        if (value)
            prev[curr] = encodeURIComponent(value);
        return prev;
    }, {});
}
function decodeMatches(matches) {
    return Object.keys(matches).filter(x => matches[x]).reduce((prev, curr) => {
        prev[curr] = decodeURIComponent(matches[curr]);
        return prev;
    }, {});
}
function navigateEffect(route, pushHistory, matches, state, hash = {}) {
    return react_use_elmish_1.Effects.dispatchFromFunction(() => {
        const r = state.router._routes.find(x => x.name == route);
        const path = r.parsed.reverse(encodeMatches(filterMatch(matches)));
        assertTrue(!!path, `${route} should match the format '${r.pattern}' but only received the following parameters ${JSON.stringify(matches)} `);
        const builtHash = buildHash(hash !== null && hash !== void 0 ? hash : {});
        const pathWithHashAndSearch = path + (builtHash === '' ? '' : '#' + builtHash);
        if (pushHistory) {
            window.history.pushState({}, '', pathWithHashAndSearch);
        }
        else {
            window.history.replaceState({}, '', pathWithHashAndSearch);
        }
        return ({
            type: 'ROUTER',
            subtype: 'URL_PATHNAME_UPDATED',
            pathname: path,
            route: route,
            match: filterMatch(matches),
            hash: window.location.hash,
            search: window.location.search,
            parsedHash: parseHashOrSearch(window.location.hash),
            parsedSearch: parseHashOrSearch(window.location.search),
        });
    }, (err) => {
        console.error('FAILED TO ROUTE DUE TO ', err);
        return ({
            type: 'ROUTER',
            subtype: 'URL_PATHNAME_UPDATED',
            pathname: window.location.pathname + window.location.search,
            route: false,
            match: {},
            hash: window.location.hash,
            search: window.location.search,
            parsedHash: parseHashOrSearch(window.location.hash),
            parsedSearch: parseHashOrSearch(window.location.search),
        });
    });
}
exports.navigateEffect = navigateEffect;
function goBackEffect() {
    return [
        (_) => {
            window.history.back();
        },
    ];
}
exports.goBackEffect = goBackEffect;
function goForwardEffect() {
    return [
        (_) => {
            window.history.forward();
        },
    ];
}
exports.goForwardEffect = goForwardEffect;
function parseRoutes(routes) {
    return Object.keys(routes).sort().reduce((prev, route) => [
        ...prev,
        {
            name: route,
            pattern: routes[route],
            parsed: new ParsedRoute(routes[route]),
        },
    ], []);
}
function findMatchingRoute(pathname, routes) {
    for (const route in routes) {
        const routeInfo = routes[route];
        const match = routeInfo.parsed.match(pathname);
        if (!!match) {
            return [decodeMatches(match), routeInfo.name];
        }
    }
    return [{}, false];
}
function routerReducer(prev, action) {
    switch (action.subtype) {
        case 'URL_PATHNAME_UPDATED':
            return [
                Object.assign(Object.assign({}, prev), { router: Object.assign(Object.assign({}, prev.router), { currentRoute: action.route || false, currentMatch: action.match, pathname: action.pathname, hash: action.hash, search: action.search }) }),
                react_use_elmish_1.Effects.none(),
            ];
        case 'NAVIGATE_TO_ROUTE':
            return [
                prev,
                navigateEffect(action.route, action.pushHistory, action.match, prev, action.hash),
            ];
        case 'NAVIGATE_BACK':
            return [prev, goBackEffect()];
        case 'NAVIGATE_FORWARD':
            return [prev, goForwardEffect()];
    }
}
exports.routerReducer = routerReducer;
function initializeRouter(routes, stateEffectPair) {
    const parsedRoutes = parseRoutes(routes);
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    const [match, route] = findMatchingRoute(pathname + search, parsedRoutes);
    console.log(match);
    const state = Object.assign(Object.assign({}, stateEffectPair[0]), { router: {
            _routes: parsedRoutes,
            currentRoute: route,
            currentMatch: match,
            pathname: location.pathname,
            hash: location.hash,
            search: location.search,
            parsedHash: parseHashOrSearch(hash),
            parsedSearch: parseHashOrSearch(search),
        } });
    const pathnameUpdatedAction = react_use_elmish_1.Effects.action({
        type: 'ROUTER',
        subtype: 'URL_PATHNAME_UPDATED',
        match,
        route,
        pathname,
        search,
        hash,
        parsedHash: parseHashOrSearch(hash),
        parsedSearch: parseHashOrSearch(search),
    });
    return [
        state,
        react_use_elmish_1.Effects.combine(pathnameUpdatedAction, listenToHistoryPopEffect(state), stateEffectPair[1]),
    ];
}
exports.initializeRouter = initializeRouter;
function listenToHistoryPopEffect(state) {
    return [
        (dispatch) => {
            const listener = () => {
                const pathname = window.location.pathname;
                const search = window.location.search;
                const hash = window.location.hash;
                const [match, route] = findMatchingRoute(pathname + search, state.router._routes);
                dispatch({
                    type: 'ROUTER',
                    subtype: 'URL_PATHNAME_UPDATED',
                    match,
                    route,
                    pathname,
                    search,
                    hash,
                    parsedHash: parseHashOrSearch(hash),
                    parsedSearch: parseHashOrSearch(search),
                });
            };
            window.addEventListener('popstate', listener);
            window.addEventListener('hashchange', listener);
        },
    ];
}
function dispatchNavigate(route, pushHistory, match, dispatch, hash, search) {
    dispatch({
        type: 'ROUTER',
        subtype: 'NAVIGATE_TO_ROUTE',
        pushHistory,
        match: filterMatch(match),
        route,
        hash,
        search,
    });
}
exports.dispatchNavigate = dispatchNavigate;
function dispatchGoBack(dispatch) {
    dispatch({ type: 'ROUTER', subtype: 'NAVIGATE_BACK' });
}
exports.dispatchGoBack = dispatchGoBack;
function dispatchGoForward(dispatch) {
    dispatch({ type: 'ROUTER', subtype: 'NAVIGATE_FORWARD' });
}
exports.dispatchGoForward = dispatchGoForward;
