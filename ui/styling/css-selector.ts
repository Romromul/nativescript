﻿import view = require("ui/core/view");
import observable = require("ui/core/dependency-observable");
import cssParser = require("css");
import * as trace from "trace";
import * as styleProperty from "ui/styling/style-property";
import * as types from "utils/types";
import * as utils from "utils/utils";

var ID_SPECIFICITY = 1000000;
var ATTR_SPECIFITY = 10000;
var CLASS_SPECIFICITY = 100;
var TYPE_SPECIFICITY = 1;

export class CssSelector {
    private _expression: string;
    private _declarations: cssParser.Declaration[];
    private _attrExpression: string;

    constructor(expression: string, declarations: cssParser.Declaration[]) {
        if (expression) {
            let leftSquareBracketIndex = expression.indexOf(LSBRACKET);
            if (leftSquareBracketIndex > 0) {
                // extracts what is inside square brackets ([target = 'test'] will extract "target = 'test'")
                var paramsRegex = /\[\s*(.*)\s*\]/;
                let attrParams = paramsRegex.exec(expression);
                if (attrParams && attrParams.length > 1) {
                    this._attrExpression = attrParams[1].trim();
                }
                this._expression = expression.substr(0, leftSquareBracketIndex);
            }
            else {
                this._expression = expression;
            }
        }
        this._declarations = declarations;
    }

    get expression(): string {
        return this._expression;
    }
    
    get attrExpression(): string {
        return this._attrExpression;
    }

    get declarations(): Array<{ property: string; value: any }> {
        return this._declarations;
    }

    get specificity(): number {
        throw "Specificity property is abstract";
    }

    public matches(view: view.View): boolean {
        return false;
    }

    public apply(view: view.View) {
        this.eachSetter((property, value) => {
            try {
                view.style._setValue(property, value, observable.ValueSource.Css);
            }
            catch (ex) {
                trace.write("Error setting property: " + property.name + " view: " + view + " value: " + value + " " + ex, trace.categories.Style, trace.messageType.error);
            }
        });
    }

    public eachSetter(callback: (property, resolvedValue: any) => void) {
        for (let i = 0; i < this._declarations.length; i++) {
            let declaration = this._declarations[i];
            let name = declaration.property;
            let resolvedValue = declaration.value;

            let property = styleProperty.getPropertyByCssName(name);

            if (property) {                
                // The property.valueConverter is now used to convert the value later on in DependencyObservable._setValueInternal.
                callback(property, resolvedValue);
            }
            else {
                var pairs = styleProperty.getShorthandPairs(name, resolvedValue);
                if (pairs) {
                    for (let j = 0; j < pairs.length; j++) {
                        let pair = pairs[j];
                        callback(pair.property, pair.value);
                    }
                }
            }
        }
    }
}

class CssTypeSelector extends CssSelector {
    get specificity(): number {
        return TYPE_SPECIFICITY;
    }
    public matches(view: view.View): boolean {
        let result = matchesType(this.expression, view);
        if (result && this.attrExpression) {
            return matchesAttr(this.attrExpression, view);
        }
        return result;
    }
}

function matchesType(expression: string, view: view.View): boolean {
    let exprArr = expression.split(".");
    let exprTypeName = exprArr[0];
    let exprClassName = exprArr[1];
       
    let typeCheck = exprTypeName.toLowerCase() === view.typeName.toLowerCase() || 
        exprTypeName.toLowerCase() === view.typeName.split(/(?=[A-Z])/).join("-").toLowerCase();
          
    if (typeCheck) {
        if (exprClassName) {
            return view._cssClasses.some((cssClass, i, arr) => { return cssClass === exprClassName });
        }
        else {
            return typeCheck;
        }
    }
    else {
        return false;
    }
}

class CssIdSelector extends CssSelector {
    get specificity(): number {
        return ID_SPECIFICITY;
    }
    public matches(view: view.View): boolean {
        let result = this.expression === view.id;
        if (result && this.attrExpression) {
            return matchesAttr(this.attrExpression, view);
        }
        return result;
    }
}

class CssClassSelector extends CssSelector {
    get specificity(): number {
        return CLASS_SPECIFICITY;
    }
    public matches(view: view.View): boolean {
        var expectedClass = this.expression;
        let result = view._cssClasses.some((cssClass, i, arr) => { return cssClass === expectedClass });
        if (result && this.attrExpression) {
            return matchesAttr(this.attrExpression, view);
        }
        return result;
    }
}

class CssCompositeSelector extends CssSelector {
    get specificity(): number {
        let result = 0;
        for(let i = 0; i < this.parentCssSelectors.length; i++) {
            result += this.parentCssSelectors[i].selector.specificity;
        }
        return result;
    }
    
    private parentCssSelectors: [{ selector: CssSelector, onlyDirectParent: boolean}];
    
    private splitExpression(expression) {
        let result = [];
        let tempArr = [];
        let validSpace = true;
        for (let i = 0; i < expression.length; i++) {
            if (expression[i] === LSBRACKET) {
                validSpace = false;
            }
            if (expression[i] === RSBRACKET) {
                validSpace = true;
            }
            if ((expression[i] === SPACE && validSpace) || (expression[i] === GTHAN)) {
                if (tempArr.length > 0) {
                    result.push(tempArr.join(""));
                    tempArr = [];
                }
                if (expression[i] === GTHAN) {
                    result.push(GTHAN);
                }
                continue;
            }
            tempArr.push(expression[i]);
        }
        if (tempArr.length > 0) {
            result.push(tempArr.join(""));
        }
        return result;
    }
    
    constructor(expr: string, declarations: cssParser.Declaration[]) {
        super(expr, declarations);
        let expressions = this.splitExpression(expr);
        let onlyParent = false;
        this.parentCssSelectors = <any>[];
        for(let i = expressions.length - 1; i >= 0; i--) {
            if (expressions[i].trim() === GTHAN) {
                onlyParent = true;
                continue;
            }
            this.parentCssSelectors.push({selector: createSelector(expressions[i].trim(), null), onlyDirectParent: onlyParent});
            onlyParent = false;
        }
    }
    
    public matches(view: view.View): boolean {
        let result = this.parentCssSelectors[0].selector.matches(view);
        if (!result) {
            return result;
        }
        let tempView = view.parent;
        for(let i = 1; i < this.parentCssSelectors.length; i++) {
            let parentCounter = 0;
            while (tempView && parentCounter === 0) {
                result = this.parentCssSelectors[i].selector.matches(tempView);
                if (result) {
                    tempView = tempView.parent;
                    break;
                }
                if (this.parentCssSelectors[i].onlyDirectParent) {
                    parentCounter++;
                }
                tempView = tempView.parent;
            }
            if (!result) {
                break;
            }
        }
        return result;
    }
}

class CssAttrSelector extends CssSelector {
    get specificity(): number {
        return ATTR_SPECIFITY;
    }
    
    public matches(view: view.View): boolean {
        return matchesAttr(this.attrExpression, view);
    }
}

function matchesAttr(attrExpression: string, view: view.View): boolean {
    let equalSignIndex = attrExpression.indexOf(EQUAL);
    if (equalSignIndex > 0) {
        let nameValueRegex = /(.*[^~|\^\$\*])[~|\^\$\*]?=(.*)/;
        let nameValueRegexRes = nameValueRegex.exec(attrExpression);
        let attrName;
        let attrValue;
        if (nameValueRegexRes && nameValueRegexRes.length > 2) {
            attrName = nameValueRegexRes[1].trim();
            attrValue = nameValueRegexRes[2].trim().replace(/^(["'])*(.*)\1$/, '$2');
        }
        // extract entire sign (=, ~=, |=, ^=, $=, *=)
        let escapedAttrValue = utils.escapeRegexSymbols(attrValue); 
        let attrCheckRegex;
        switch (attrExpression.charAt(equalSignIndex - 1)) {
            case "~":
                attrCheckRegex = new RegExp("(^|[^a-zA-Z-])" + escapedAttrValue + "([^a-zA-Z-]|$)");
                break;
            case "|":
                attrCheckRegex = new RegExp("^" + escapedAttrValue + "\\b");
                break;
            case "^":
                attrCheckRegex = new RegExp("^" + escapedAttrValue);
                break;
            case "$":
                attrCheckRegex = new RegExp(escapedAttrValue + "$");
                break;
            case "*":
                attrCheckRegex = new RegExp(escapedAttrValue);
                break;

            // only = (EQUAL)
            default:
                attrCheckRegex = new RegExp("^"+escapedAttrValue+"$");
                break;
        }
        return !types.isNullOrUndefined(view[attrName]) && attrCheckRegex.test(view[attrName]+"");
    } else {
        return !types.isNullOrUndefined(view[attrExpression]);
    }
}

export class CssVisualStateSelector extends CssSelector {
    private _key: string;
    private _match: string;
    private _state: string;
    private _isById: boolean;
    private _isByClass: boolean;
    private _isByType: boolean;
    private _isByAttr: boolean;

    get specificity(): number {
        return (this._isById ? ID_SPECIFICITY : 0) +
            (this._isByAttr ? ATTR_SPECIFITY : 0) + 
            (this._isByClass ? CLASS_SPECIFICITY : 0) +
            (this._isByType ? TYPE_SPECIFICITY : 0);
    }

    get key(): string {
        return this._key;
    }

    get state(): string {
        return this._state;
    }

    constructor(expression: string, declarations: cssParser.Declaration[]) {
        super(expression, declarations);

        var args = expression.split(COLON);
        this._key = args[0];
        this._state = args[1];

        if (this._key.charAt(0) === HASH) {
            this._match = this._key.substring(1);
            this._isById = true;
        } else if (this._key.charAt(0) === DOT) {
            this._match = this._key.substring(1);
            this._isByClass = true;
        } else if (this._key.charAt(0) === LSBRACKET) {
            this._match = this._key;
            this._isByAttr = true;
        }
        else if (this._key.length > 0) { // handle the case when there is no key. E.x. ":pressed" selector
            this._match = this._key;
            this._isByType = true;
        }
    }

    public matches(view: view.View): boolean {
        var matches = true;
        if (this._isById) {
            matches = this._match === view.id;
        }

        if (this._isByClass) {
            var expectedClass = this._match;
            matches = view._cssClasses.some((cssClass, i, arr) => { return cssClass === expectedClass });
        }

        if (this._isByType) {
            matches = matchesType(this._match, view);
        }
        
        if (this._isByAttr) {
            matches = matchesAttr(this._key, view);
        }

        return matches;
    }
}

var HASH = "#";
var DOT = ".";
var COLON = ":";
var SPACE = " ";
var GTHAN = ">";
var LSBRACKET = "[";
var RSBRACKET = "]";
var EQUAL = "=";

export function createSelector(expression: string, declarations: cssParser.Declaration[]): CssSelector {
    let goodExpr = expression.replace(/>/g, " > ").replace(/\s\s+/g, " ");
    var spaceIndex = goodExpr.indexOf(SPACE);
    if (spaceIndex >= 0) {
        return new CssCompositeSelector(goodExpr, declarations);
    }
    
    let leftSquareBracketIndex = goodExpr.indexOf(LSBRACKET);
    if (leftSquareBracketIndex === 0) {
        return new CssAttrSelector(goodExpr, declarations);
    } 
    
    var colonIndex = goodExpr.indexOf(COLON);
    if (colonIndex >= 0) {
        return new CssVisualStateSelector(goodExpr, declarations);
    }

    if (goodExpr.charAt(0) === HASH) {
        return new CssIdSelector(goodExpr.substring(1), declarations);
    }

    if (goodExpr.charAt(0) === DOT) {
        // TODO: Combinations like label.center
        return new CssClassSelector(goodExpr.substring(1), declarations);
    }

    return new CssTypeSelector(goodExpr, declarations);
}

class InlineStyleSelector extends CssSelector {
    constructor(declarations: cssParser.Declaration[]) {
        super(undefined, declarations)
    }

    public apply(view: view.View) {
        this.eachSetter((property, value) => {
            view.style._setValue(property, value, observable.ValueSource.Local);
        });
    }
}

export function applyInlineSyle(view: view.View, declarations: cssParser.Declaration[]) {
    var localStyleSelector = new InlineStyleSelector(declarations);
    localStyleSelector.apply(view);
}
