"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forward = exports.Back = exports.LinkRef = exports.Link = void 0;
const React = __importStar(require("react"));
const index_1 = require("./index");
function Link(_a) {
    var { dispatch, route, pushHistory, match, hash, search } = _a, rest = __rest(_a, ["dispatch", "route", "pushHistory", "match", "hash", "search"]);
    return (React.createElement("a", Object.assign({ onClick: () => (0, index_1.dispatchNavigate)(route, pushHistory !== null && pushHistory !== void 0 ? pushHistory : false, match !== null && match !== void 0 ? match : {}, dispatch, hash, search) }, rest)));
}
exports.Link = Link;
function LinkRef(_a, ref) {
    var { dispatch, route, pushHistory, match, hash, search } = _a, rest = __rest(_a, ["dispatch", "route", "pushHistory", "match", "hash", "search"]);
    return React.forwardRef((_a, ref) => {
        var { dispatch, route, pushHistory, match, hash, search } = _a, rest = __rest(_a, ["dispatch", "route", "pushHistory", "match", "hash", "search"]);
        return (React.createElement("a", Object.assign({ ref: ref, onClick: () => (0, index_1.dispatchNavigate)(route, pushHistory !== null && pushHistory !== void 0 ? pushHistory : false, match !== null && match !== void 0 ? match : {}, dispatch, hash, search) }, rest)));
    });
}
exports.LinkRef = LinkRef;
function Back(_a) {
    var { dispatch } = _a, props = __rest(_a, ["dispatch"]);
    return (React.createElement("a", Object.assign({ onClick: () => (0, index_1.dispatchGoBack)(dispatch), href: "#" }, props)));
}
exports.Back = Back;
function Forward(_a) {
    var { dispatch } = _a, props = __rest(_a, ["dispatch"]);
    return (React.createElement("a", Object.assign({ onClick: () => (0, index_1.dispatchGoForward)(dispatch) }, props)));
}
exports.Forward = Forward;
