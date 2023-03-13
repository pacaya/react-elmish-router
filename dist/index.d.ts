import ParsedRoute = require('route-parser');
import { Dispatch, Effect, StateEffectPair } from 'react-use-elmish';
export type Match = {
    [key: string]: string;
};
type UnfilteredMatch = {
    [key: string]: string | undefined;
};
export type ParsedHash = {
    [key: string]: string | true;
} | false;
export type ParsedSearch = {
    [key: string]: string | true;
} | false;
export declare function filterMatch(obj: UnfilteredMatch): Match;
export type RouteFromRouteDefinitions<RouteDefintion extends {
    [route: string]: string;
}> = keyof RouteDefintion & string;
export type RouteDefinitionsFromRoute<Route extends string> = {
    [R in Route]: string;
};
type ParsedRoutes<Route extends string> = {
    name: Route;
    pattern: string;
    parsed: ParsedRoute;
}[];
export type RouterState<Route extends string> = {
    router: {
        currentRoute: Route | false;
        currentMatch: Match;
        pathname: string;
        hash: string;
        parsedHash: ParsedHash;
        parsedSearch: ParsedSearch;
        search: string;
        _routes: ParsedRoutes<Route>;
    };
};
export type PathnameUpdatedAction<Route> = {
    type: 'ROUTER';
    subtype: 'URL_PATHNAME_UPDATED';
    pathname: string;
    route: Route | false;
    parsedHash: ParsedHash;
    parsedSearch: ParsedSearch;
    match: Match;
    hash: string;
    search: string;
};
type NavigateToRouteAction<Route> = {
    type: 'ROUTER';
    subtype: 'NAVIGATE_TO_ROUTE';
    route: Route;
    pushHistory: boolean;
    match: Match;
    hash?: ParsedHash;
    search?: ParsedSearch;
};
type NavigateBackAction = {
    type: 'ROUTER';
    subtype: 'NAVIGATE_BACK';
};
type NavigateForwardAction = {
    type: 'ROUTER';
    subtype: 'NAVIGATE_FORWARD';
};
export type RouterAction<Route> = PathnameUpdatedAction<Route> | NavigateToRouteAction<Route> | NavigateBackAction | NavigateForwardAction;
export declare function navigateEffect<Route extends string>(route: Route, pushHistory: boolean, matches: UnfilteredMatch, state: RouterState<Route>, hash?: ParsedHash): Effect<RouterAction<Route>>;
export declare function goBackEffect(): ((_: unknown) => void)[];
export declare function goForwardEffect(): ((_: unknown) => void)[];
export declare function routerReducer<State extends RouterState<Route>, Route extends string, Action extends RouterAction<Route>>(prev: State, action: RouterAction<Route>): StateEffectPair<State, Action>;
export declare function initializeRouter<Routes extends string, State, Action extends unknown | RouterAction<Routes>>(routes: RouteDefinitionsFromRoute<Routes>, stateEffectPair: StateEffectPair<State, Action>): StateEffectPair<State & RouterState<Routes>, Action>;
export declare function dispatchNavigate<Route extends string>(route: Route, pushHistory: boolean, match: UnfilteredMatch, dispatch: Dispatch<RouterAction<Route>>, hash?: ParsedHash, search?: ParsedSearch): void;
export declare function dispatchGoBack(dispatch: Dispatch<RouterAction<unknown>>): void;
export declare function dispatchGoForward(dispatch: Dispatch<RouterAction<unknown>>): void;
export {};
