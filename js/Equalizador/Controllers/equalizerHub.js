"use strict";
(self.webpackChunk = self.webpackChunk || []).push([[5457], {
    41500: (e,t,i)=>{
        i.d(t, {
            Z: ()=>r
        });
        var n = i(20090)
          , a = i(30278)
          , l = i(65419)
          , s = i(89202);
        const r = {
            getLayersProperties: function(e, t) {
                return a.Z.getValue(e, t || "layers")
            },
            getDimensionTitle: function(e, t) {
                if (!e.length)
                    return "";
                var i = e[0]
                  , n = t.getDimensionLayout(i.qDef.cId);
                if (!n)
                    return "";
                if (n.qError && !l.Z.isCalcCondNotCalculatedErr(n.qError))
                    return s.Z.getDimensionError(n.qError.qErrorCode);
                var a = i.qLibraryId;
                if ("H" === n.qGrouping || a)
                    return n.title || "";
                return i.qDef.qLabelExpression || n.qFallbackTitle || ""
            },
            createHyperCubeHandler: function(e, t, i, a) {
                var l = new n.Z({
                    app: a,
                    path: e
                });
                return l.setProperties(t),
                l.setLayout(i),
                l
            }
        }
    }
    ,
    55466: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>l
        });
        var n = i(95272)
          , a = i(33417);
        const l = {
            template: '<div em-accordion="items" x-args="args" x-definition="definition" tabindex=\'-1\' class="em-accordion-container" tcl="accordion">\n\t<div class="em-section" ng-repeat="item in items" em-accordion-item ng-if="item.show" tid="{{item.key}}">\n\t\t<h4 class="em-section-header em-item" ng-class="{ \'last\': $last }">\n\t\t\t<span class="em-item-icon lui-icon lui-icon--{{item.icon}}"></span>\n\t\t\t<span class="em-text">{{item.label}}</span>\n\t\t</h4>\n\t\t<div class="em-section-content" include-em-component x-component="item.component" x-definition="item.definition"\n\t\t\tx-data="data" x-args="args" x-path="{{item.path}}">\n\t\t</div>\n\t</div>\n</div>\n',
            controller: ["$scope", function(e) {
                var t = e.definition.items || {};
                function i() {
                    return e.data
                }
                function l(t) {
                    var n = !0;
                    return "boolean" == typeof t.show ? n = t.show : "function" == typeof t.show && (n = t.show(i(), e.args.layout)),
                    n
                }
                function s() {
                    return Object.keys(t).reduce(((e,i)=>e + (l(t[i]) ? 1 : 0)), 0)
                }
                e.items = Object.keys(t).map((e=>{
                    var s = t[e]
                      , r = {
                        component: n.Z.findComponent(s),
                        definition: s,
                        icon: s.icon,
                        key: e,
                        path: e,
                        show: l(s)
                    };
                    return a.Z.defineLabel(r, s, i),
                    r
                }
                )),
                e.nbrHeaders = s(),
                e.$on("datachanged", (()=>{
                    var i = s();
                    e.nbrHeaders !== i && (e.items.forEach((e=>{
                        e.show = l(t[e.key])
                    }
                    )),
                    e.$broadcast("headerschanged"),
                    e.nbrHeaders = i)
                }
                ))
            }
            ]
        }
    }
    ,
    26374: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>a
        });
        var n = i(33417);
        const a = {
            template: '<div class="em-item em-item-inner em-checkbox-component" ng-if="visible" tcl="checkbox">\n\t<div class="value">\n\t\t<label class="lui-checkbox lui-checkbox--inverse">\n\t\t\t<input class="lui-checkbox__input" type="checkbox" ng-model="value" tid="value" ng-change="change()" ng-disabled="readOnly" />\n\t\t\t<div class="lui-checkbox__check-wrap">\n\t\t\t\t<span class="lui-checkbox__check"></span>\n\t\t\t\t<span class="lui-checkbox__check-text label" ng-disabled="readOnly" ng-if="label">{{label}}</span>\n\t\t\t</div>\n\t\t</label>\n\t</div>\n</div>\n',
            controller: ["$scope", function(e) {
                var t = function() {
                    return e.data
                };
                n.Z.defineLabel(e, e.definition, t),
                n.Z.defineValue(e, e.definition, t),
                n.Z.defineVisible(e, e.definition, t),
                n.Z.defineChange(e, e.definition, t),
                n.Z.defineReadOnly(e, e.definition, t)
            }
            ]
        }
    }
    ,
    11666: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>a
        });
        var n = i(33417);
        i(74959);
        const a = {
            template: '<div class="em-item em-color-scale-component" ng-if="visible" qva-apply-style="style" tcl="color-scale">\n</div>',
            controller: ["$scope", function(e) {
                var t = function() {
                    return e.data
                };
                n.Z.defineLabel(e, e.definition, t),
                n.Z.defineVisible(e, e.definition, t),
                n.Z.defineReadOnly(e, e.definition, t),
                n.Z.defineValue(e, e.definition, t),
                Object.defineProperty(e, "style", {
                    get() {
                        return function(e, t, i) {
                            var n = ""
                              , a = ")";
                            if (i)
                                if (t)
                                    for (var l = e.length - 1; l >= 0; l--)
                                        n += ", ".concat(e[l], " ").concat(100 / (e.length - 1) * (e.length - 1 - l), "%");
                                else
                                    for (var s = e.length - 1; s >= 0; s--)
                                        n += ", ".concat(e[s], " ").concat(100 / e.length * (e.length - 1 - s), "%"),
                                        n += ", ".concat(e[s], " ").concat(100 / e.length * (e.length - s), "%");
                            else if (t)
                                for (var r = 0; r < e.length; r++)
                                    n += ", ".concat(e[r], " ").concat(100 / (e.length - 1) * r, "%");
                            else
                                for (var o = 0; o < e.length; o++)
                                    n += ", ".concat(e[o], " ").concat(100 / e.length * o, "%"),
                                    n += ", ".concat(e[o], " ").concat(100 / e.length * (o + 1), "%");
                            return "background:".concat(e[e.length / 2], "; background:").concat("-moz-linear-gradient(left").concat(n).concat(a, "; background:").concat("-webkit-linear-gradient(left").concat(n).concat(a, "; background:").concat(" -o-linear-gradient(left").concat(n).concat(a, "; background:").concat("-ms-linear-gradient(left").concat(n).concat(a, "; background:").concat("linear-gradient(to right").concat(n).concat(a)
                        }(e.definition.colors, "gradient" === e.definition.type, "boolean" == typeof (t = e).definition.reverse ? t.definition.reverse : "function" == typeof t.definition.reverse && t.definition.reverse.call(null, t.data, t.handler));
                        var t
                    }
                })
            }
            ]
        }
    }
    ,
    33417: (e,t,i)=>{
        i.d(t, {
            Z: ()=>l
        });
        var n = i(30248)
          , a = i(30278);
        const l = {
            defineValue(e, t, i) {
                var n, l;
                t.ref ? (n = function() {
                    return a.Z.getValue("function" == typeof i ? i() : i, t.ref)
                }
                ,
                l = function(e) {
                    "number" === t.type && (e = Number(e)),
                    a.Z.setValue("function" == typeof i ? i() : i, t.ref, e)
                }
                ) : t.getValue && t.setPropertyValue && (n = function() {
                    return t.getValue("function" == typeof i ? i() : i)
                }
                ,
                l = function(n) {
                    "number" === t.type && (n = Number(n)),
                    t.setPropertyValue("function" == typeof i ? i() : i, n, e.args)
                }
                ),
                n && l && Object.defineProperty(e, "value", {
                    get: n,
                    set: l
                })
            },
            defineVisible(e, t, i) {
                var n = t.show;
                "function" == typeof n ? Object.defineProperty(e, "visible", {
                    get: ()=>n("function" == typeof i ? i() : i, e.args.layout)
                }) : e.visible = "boolean" != typeof n || n
            },
            defineLabel: (e,t,i)=>(t.translation ? e.label = n.default.get(t.translation) : "function" == typeof t.label ? Object.defineProperty(e, "label", {
                get: ()=>t.label("function" == typeof i ? i() : i)
            }) : t.label && (e.label = t.label),
            ""),
            defineChange(e, t, i) {
                e.change = function() {
                    var n = !0;
                    "function" == typeof t.change && (n = t.change("function" == typeof i ? i() : i)),
                    !1 !== n && e.$emit("saveSoftProperties")
                }
            },
            defineReadOnly(e, t, i) {
                "function" == typeof t.readOnly ? Object.defineProperty(e, "readOnly", {
                    get: ()=>t.readOnly("function" == typeof i ? i() : i)
                }) : "boolean" == typeof t.readOnly ? e.readOnly = t.readOnly : e.readOnly = !1
            }
        }
    }
    ,
    47836: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>s
        });
        var n = i(29474)
          , a = i(33417)
          , l = i(89713);
        const s = {
            template: n.Z,
            controller: ["$scope", function(e) {
                var t = function() {
                    return e.data
                };
                function i() {
                    var i, n, a, s, r = t(), o = l.Z.getDimensions(r);
                    for (e.options.splice(0, e.options.length),
                    s = 0; s < o.length; ++s)
                        a = (i = o[s]).qDef.cId,
                        n = l.Z.getDimensionLayout(a, e.args.layout),
                        i.qLibraryId && n && !n.qError ? i.qError || e.options.push({
                            value: a,
                            label: n.title
                        }) : e.options.push({
                            value: a,
                            label: n && n.qFallbackTitle || ""
                        })
                }
                e.options = [],
                a.Z.defineChange(e, e.definition, t),
                a.Z.defineValue(e, e.definition, t),
                i(),
                e.$on("datachanged", (()=>{
                    i()
                }
                ))
            }
            ]
        }
    }
    ,
    49124: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>a
        });
        var n = i(4817);
        const a = {
            template: '<div class="em-header-component">{{label}}</div>',
            controller: ["$scope", function(e) {
                n.ZP.defineLabel(e, e.definition, (function() {
                    return e.data
                }
                ), e.args.handler),
                n.ZP.defineVisible(e, e.args.handler),
                e.marginTop = e.definition.marginTop || "0px"
            }
            ]
        }
    }
    ,
    62708: (e,t,i)=>{
        i.d(t, {
            Z: ()=>f
        });
        var n = i(30248)
          , a = i(18361)
          , l = i(30278)
          , s = i(89713)
          , r = i(57964)
          , o = i(16234)
          , d = i(7288);
        var c = i(22544)
          , m = i(7787);
        a.default.directive("hypercubeDataItem", [function() {
            return {
                restrict: "A",
                template: '<li class="em-item lui-list__item" qva-activate="alternativeItemClicked($event,item,alternative);">\n\t<i ng-if="alternative.hasIcon" class="em-item-icon lui-icon lui-icon--tick lui-list__aside" ng-class="{\'em-invisible\': !alternative.selected}"></i>\n\t<span class="lui-list__text lui-list__text--ellipsis" qva-direction x-dir-text="{{alternative.title()}}"  title="{{alternative.title()}}">{{alternative.title()}}&nbsp;</span>\n</li>',
                replace: !0
            }
        }
        ]);
        const f = class {
            constructor(e, t, i) {
                this._props = e,
                this._app = t,
                this._hyperCubePath = i,
                this.libraryTitles = {},
                this.cachingAlternativeTitleRetriever = c.Z.create()
            }
            setProperties(e) {
                this._props = e,
                this.cachingAlternativeTitleRetriever.resetTitles()
            }
            updateAlternativeItem(e, t, i, n, a) {
                var s = l.Z.getValue(this._props, n, [])
                  , r = l.Z.getValue(this._props, i, [])
                  , c = s[t.index];
                if (!t.selected) {
                    var f, p, u, h;
                    if (t.original && (c = l.Z.getValue(this._props, i, [])[t.index]),
                    c.qAttributeExpressions = o.Z.moveById(e.data.qAttributeExpressions, c.qAttributeExpressions, o.Z.IDMAP.COLOR_BY_EXPRESSION),
                    [m.Z.CUSTOM.EXPRESSION, m.Z.CUSTOM.TITLE, m.Z.CUSTOM.DESCRIPTION, m.Z.CUSTOM.IMAGES].forEach((t=>{
                        c.qAttributeExpressions = o.Z.moveAllById(e.data.qAttributeExpressions, c.qAttributeExpressions, t, "cId")
                    }
                    )),
                    a)
                        for (f = 0; f < a.length; f++)
                            h = a[f],
                            p = l.Z.getValue(r[e.index], h.path, []),
                            u = l.Z.getValue(s[t.index], h.path, []),
                            p && p.hasOwnProperty(h.property) && u && u.hasOwnProperty(h.property) && (u[h.property] = p[h.property]);
                    s.splice(t.index, 1, r[e.index]),
                    r.splice(e.index, 1, c),
                    d.Z.colorByUpdater(this._props, "qHyperCubeDef.")
                }
            }
            getDimensionOptions(e, t, i, n, a) {
                var l = this;
                return e.concat(t).filter((e=>e.qDef.cId === i.qDef.cId || !s.Z.getDimensionLayout(e.qDef.cId, n, l._hyperCubePath))).map((n=>{
                    var s = l.cachingAlternativeTitleRetriever.getCachedDimensionTitle(n);
                    return l.cachingAlternativeTitleRetriever.getDimensionTitle(n, l._app).then((e=>{
                        s = e
                    }
                    )),
                    {
                        id: n.qDef.cId,
                        index: -1 !== e.indexOf(n) ? e.indexOf(n) : t.indexOf(n),
                        original: -1 !== e.indexOf(n),
                        ref: "dimensions",
                        selected: n.qDef.cId === i.qDef.cId,
                        hasIcon: a,
                        title: ()=>s
                    }
                }
                ))
            }
            getMeasureOptions(e, t, i, n, a) {
                var l = this;
                return e.concat(t).filter((e=>e.qDef.cId === i.qDef.cId || !s.Z.getMeasureLayout(e.qDef.cId, n, l._hyperCubePath))).map((n=>{
                    var s = l.cachingAlternativeTitleRetriever.getCachedMeasureTitle(n);
                    return l.cachingAlternativeTitleRetriever.getMeasureTitle(n, l._app).then((e=>{
                        s = e
                    }
                    )),
                    {
                        id: n.qDef.cId,
                        index: -1 !== e.indexOf(n) ? e.indexOf(n) : t.indexOf(n),
                        original: -1 !== e.indexOf(n),
                        ref: "measures",
                        selected: n.qDef.cId === i.qDef.cId,
                        hasIcon: a,
                        title: ()=>s
                    }
                }
                ))
            }
            getTitle(e, t) {
                var i = e.qLibraryId
                  , a = this
                  , l = n.default.get(t ? "Object.ErrorMessage.MissingDimension" : "Object.ErrorMessage.MissingMeasure");
                return i ? void 0 !== this.libraryTitles[i] ? null === this.libraryTitles[i] ? l : "string" != typeof this.libraryTitles[i] ? "" : this.libraryTitles[i] : (this.libraryTitles[i] = (t ? a._app.getDimensionList().then((e=>r.Z.findLibraryDimension(i, e))) : a._app.getMeasureList().then((e=>r.Z.findLibraryMeasure(i, e)))).then((e=>e ? (a.libraryTitles[i] = e.qData.title,
                a.libraryTitles[i]) : (a.libraryTitles[i] = null,
                l))),
                this.libraryTitles[i]) : t ? e.qDef.qFieldLabels[0] || e.qDef.qFieldDefs[0] : e.qDef.qLabel || e.qDef.qDef
            }
        }
    }
    ,
    42594: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>p
        });
        var n = i(30248)
          , a = i(33417)
          , l = i(95272)
          , s = i(9401)
          , r = i(30278)
          , o = i(89713)
          , d = i(62708)
          , c = i(89202)
          , m = i(41335);
        var f = i(7288);
        const p = {
            template: '<div class="em-component em-data-component em-list-component">\n\t<div qv-sortable-list="sortableItemLists" class="em-list-container">\n\t\t<div class="em-data" ng-repeat="list in sortableItemLists.lists" ng-class="{ \'em-disabled\': list.disabled }" tid="{{list.tid}}">\n\t\t\t<div class="em-list-header">{{list.title}}</div>\n\t\t\t<ul class="em-list em-list-content em-sortable-list">\n\t\t\t\t<li ng-repeat="item in list.items track by item.id" ng-include src="item.templateSrc" id="{{item.id}}" ng-class="item.classList"></li>\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n\n\t<div class="em-disabled-overlay" ng-if="disabled"></div>\n</div>\n',
            controller: ["$scope", function(e) {
                var t, i, p, u = e.args.cache, h = [], g = "em-data_";
                function v(e) {
                    h.forEach((t=>{
                        t.get().forEach((t=>{
                            t !== e && (t.expanded = !1,
                            u.put(g + t.id, t.expanded))
                        }
                        ))
                    }
                    ))
                }
                function b() {
                    t ? t.setProperties(e.data) : t = new d.Z(e.data,e.args.app,e.definition.hyperCubePath),
                    e.sortableItemLists.reset();
                    var n = e.definition.items.dimensions
                      , a = e.definition.items.measures
                      , s = r.Z.getValue(e.data, n.ref)
                      , m = r.Z.getValue(e.data, n.ref)
                      , f = r.Z.getValue(e.data, a.ref, [])
                      , h = r.Z.getValue(e.data, a.ref)
                      , v = r.Z.getValue(e.data, n.alternativeRef, [])
                      , b = r.Z.getValue(e.data, a.alternativeRef, [])
                      , y = r.Z.getValue(e.args.properties, n.ref, []).concat(r.Z.getValue(e.args.properties, n.alternativeRef, [])).map((e=>e.qDef.cId))
                      , x = r.Z.getValue(e.args.properties, a.ref, []).concat(r.Z.getValue(e.args.properties, a.alternativeRef, [])).map((e=>e.qDef.cId));
                    function Z(t, i) {
                        var n = o.Z.getDimensionLayout(i, e.args.layout, e.definition.hyperCubePath);
                        return n ? n.qError ? c.Z.getDimensionError(n.qError.qErrorCode) : n.qGroupFallbackTitles && n.qGroupFallbackTitles.length > 1 ? n.title || "" : n.qFallbackTitle || "" : ""
                    }
                    function q(t) {
                        var i = o.Z.getMeasureLayout(t, e.args.layout, e.definition.hyperCubePath);
                        return i && i.qError ? c.Z.getMeasureError(i.qError.qErrorCode) : i && i.qFallbackTitle || ""
                    }
                    m.forEach(((n,a)=>{
                        var l = n.qDef.cId
                          , r = {
                            title: Z(0, l),
                            index: a,
                            data: n,
                            templateSrc: "em-data-item.ng.html",
                            alternatives: t.getDimensionOptions(s, v, n, e.args.layout, !0),
                            sortable: m.length > 1,
                            type: "dimension",
                            id: l,
                            expanded: u.get(g + l) || !1
                        };
                        r.expandable = r.alternatives.length > 1,
                        r.alternatives.sort(((e,t)=>y.indexOf(e.id) - y.indexOf(t.id))),
                        i.addSortableItem(r)
                    }
                    )),
                    h.forEach(((i,n)=>{
                        var a = i.qDef.cId
                          , s = {
                            title: q(a),
                            index: n,
                            data: i,
                            component: l.Z.getComponent("items"),
                            templateSrc: "em-data-item.ng.html",
                            alternatives: t.getMeasureOptions(f, b, i, e.args.layout, !0),
                            sortable: h.length > 1,
                            type: "measure",
                            id: a,
                            expanded: u.get(g + a) || !1
                        };
                        s.alternatives.sort(((e,t)=>x.indexOf(e.id) - x.indexOf(t.id))),
                        s.expandable = s.alternatives.length > 1,
                        p.addSortableItem(s, 2)
                    }
                    )),
                    e.disabled = !1
                }
                e.disabled = !1,
                a.Z.defineLabel(e, e.definition, (function() {
                    return e.data
                }
                )),
                e.sortableItemLists = s.Z.create({
                    options: {
                        direction: "vertical",
                        listKey: "list",
                        listSelector: ".em-list",
                        itemKey: "item",
                        itemSelector: ".em-sortable",
                        itemDragSelector: ".em-sortable-handle",
                        gesture: {
                            name: "swipe",
                            options: {
                                radiusThreshold: m.Z.treatAsDesktop() ? 4 : 0,
                                preventDefault: !1
                            }
                        }
                    },
                    addPlaceholder() {
                        this._super.apply(this, arguments).classList = ["em-sortable"]
                    },
                    onBegin() {
                        v(),
                        this._super.apply(this, arguments)
                    },
                    onMove(t) {
                        var n = this._super.apply(this, arguments);
                        if (n) {
                            var a, l = [], s = [];
                            e.sortableItemLists.getList(t) === i ? (i.get().forEach((e=>{
                                l.push(e.data)
                            }
                            )),
                            r.Z.setValue(e.data, e.definition.items.dimensions.ref, l)) : (a = r.Z.getValue(e.data, e.definition.items.measures.ref, []).slice(),
                            p.get().forEach((e=>{
                                s.push(e.data)
                            }
                            )),
                            a[0] && a[0].qAttributeExpressions && a[0].qAttributeExpressions[0] && "colorByExpression" === a[0].qAttributeExpressions[0].id && s[0].qAttributeExpressions.splice(0, 0, a[0].qAttributeExpressions.splice(0, 1)[0]),
                            r.Z.setValue(e.data, e.definition.items.measures.ref, s)),
                            f.Z.colorByUpdater(e.data, "qHyperCubeDef."),
                            e.$emit("saveSoftProperties")
                        }
                        return n
                    }
                }),
                i = e.sortableItemLists.createList(1, {
                    title: n.default.get(e.definition.items.dimensions.translation),
                    tid: "dimensions"
                }),
                p = e.sortableItemLists.createList(2, {
                    title: n.default.get("Common.Measures"),
                    tid: "measures"
                }),
                h.push(i),
                h.push(p),
                e.itemClicked = function(e, t) {
                    t.disabled || (e.preventDefault(),
                    t.expanded = !t.expanded,
                    u.put(g + t.id, t.expanded),
                    v(t))
                }
                ,
                e.alternativeItemClicked = function(i, n, a) {
                    t.updateAlternativeItem(n, a, e.definition.items[a.ref].ref, e.definition.items[a.ref].alternativeRef),
                    u.put(g + a.id, !0),
                    u.put(g + n.id, !1),
                    e.$emit("saveSoftProperties")
                }
                ,
                e.$on("datachanged", (()=>{
                    b()
                }
                )),
                e.$on("applyPatches", (()=>{
                    e.disabled = !0
                }
                )),
                b()
            }
            ]
        }
    }
    ,
    87741: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>a
        });
        var n = i(33417);
        i(74959);
        const a = {
            template: '<div class="em-component em-icon-item-component lui-icon" ng-class="{ \'small\' : small }" ng-if="visible" qva-apply-style="style" tcl="icon-item">\n\t{{content}}\n</div>',
            controller: ["$scope", function(e) {
                var t = function() {
                    return e.data
                };
                e.content = e.definition.icon,
                e.small = e.definition.small || !1,
                n.Z.defineLabel(e, e.definition, t),
                n.Z.defineVisible(e, e.definition, t),
                n.Z.defineReadOnly(e, e.definition, t),
                n.Z.defineValue(e, e.definition, t)
            }
            ]
        }
    }
    ,
    32710: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>l
        });
        var n = i(95272)
          , a = i(33417);
        const l = {
            template: '<div class="em-item em-item-inner em-selection-list-component" ng-if="visible" tcl="item-selection-list">\n\t<div class="em-item-label" ng-if="label">{{label}}</div>\n\n\t<ul class="em-item-selection-list {{listClass}}" ng-class="{\'vertical\' : !horizontal}">\n\t\t<li ng-repeat="item in items" qva-activate="onChange(item)" ng-show="item.visible" ng-class="{\'em-active\' : item.value == value}">\n\t\t\t<div ng-show="item.labelPlacement == \'top\'" class="label">\n\t\t\t\t<span>{{item.label}}</span>\n\t\t\t</div>\n\t\t\t<button ng-class="{\'item\':true,\'selected\' : item.value == value}" title="{{item.label}}">\n\t\t\t\t<div include-em-component x-component="item.component" x-definition="item.definition" x-data="data" x-args="args"></div>\n\t\t\t</button>\n\t\t\t<div ng-show="item.labelPlacement == \'bottom\'" class="label">\n\t\t\t\t<span>{{item.label}}</span>\n\t\t\t</div>\n\t\t</li>\n\t</ul>\n</div>\n',
            controller: ["$scope", function(e) {
                var t = e.definition.items || {}
                  , i = function() {
                    return e.data
                };
                t = "function" == typeof t ? t() : t,
                e.items = Object.keys(t).filter((e=>t[e])).map((l=>{
                    var s = t[l]
                      , r = {
                        component: n.Z.findComponent(s),
                        definition: s,
                        data: e.data,
                        key: l,
                        value: s.value,
                        show: s.show,
                        labelPlacement: s.labelPlacement || "top",
                        labelStyle: s.labelStyle || ""
                    };
                    return a.Z.defineLabel(r, s, i),
                    a.Z.defineVisible(r, s, i),
                    r
                }
                )),
                e.horizontal = e.definition.horizontal || !1,
                e.listClass = e.items.length > 1 && e.items.length < 5 ? "em-item-list-".concat(e.items.length) : "",
                !1 === e.definition.showLabels && (e.listClass += " em-list-no-labels"),
                a.Z.defineLabel(e, e.definition, i),
                a.Z.defineVisible(e, e.definition, i),
                a.Z.defineReadOnly(e, e.definition, i),
                a.Z.defineValue(e, e.definition, i),
                a.Z.defineChange(e, e.definition, i),
                e.onChange = function(t) {
                    e.value = t.value,
                    e.change()
                }
                ,
                e.options = []
            }
            ]
        }
    }
    ,
    51266: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>l
        });
        var n = i(95272);
        var a = {
            template: '<div ng-class="{\'em-grouped\': grouped}">\n    <div ng-repeat="item in items track by item.key" tid="{{item.key}}">\n        <div include-em-component x-component="item.component" x-definition="item.definition" x-data="data" x-args="args"></div>\n    </div>\n</div>',
            controller: ["$scope", function(e) {
                var t = e.definition.items;
                function i() {
                    e.items = Object.keys(t).filter((i=>{
                        var n = t[i];
                        return "function" == typeof n.show ? n.show(e.data, e.args.layout) : "boolean" != typeof n.show || n.show
                    }
                    )).map((e=>({
                        component: n.Z.findComponent(t[e]),
                        definition: t[e],
                        key: e
                    })))
                }
                e.items = [],
                i(),
                e.grouped = e.definition.grouped,
                e.$on("datachanged", (()=>{
                    i()
                }
                )),
                e.$watch("data", (()=>{
                    i()
                }
                ))
            }
            ]
        };
        const l = a
    }
    ,
    65594: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>r
        });
        var n = i(33417)
          , a = i(30278)
          , l = i(95272)
          , s = i(41500);
        const r = {
            template: '<div class="em-component" tcl="expandable-items">\n    <ul class="em-list em-list-content">\n        <li ng-repeat="item in items track by item.id" tid="{{item.id}}">\n            <div class="em-item em-expandable em-layer-item-container" ng-click="expandClicked(item)" ng-class="{ \'expanded\': item.expanded }">\n                <span class="lui-list__aside lui-icon {{item.expanded ? \'lui-icon--triangle-bottom\' : \'lui-icon--triangle-right\'}}"></span>\n                <div class="em-layer-item-title-container">\n                    <span class="em-layer-title-text" title="{{item.title}}">{{item.title}}</span>\n                    <span class="em-layer-subtitle-text" title="{{item.label}}">{{item.label}}</span>\n               </div>\n            </div>\n            <div class="em-section-content" ng-if="item.expanded">\n                <div include-em-component x-component="item.component" x-definition="item.definition" x-data="item.data" x-args="args"></div>\n            </div>\n        </li>\n    </ul>\n</div>',
            controller: ["$scope", function(e) {
                var t = e.args.cache
                  , i = function() {
                    return e.data
                }
                  , r = "expanded_".concat(e.translation || e.label, "_");
                function o(t) {
                    var n = !0;
                    return "boolean" == typeof t.show ? n = t.show : "function" == typeof t.show && (n = t.show(i(), e.args.layout)),
                    n
                }
                function d() {
                    var d;
                    e.items = (d = {},
                    s.Z.getLayersProperties(e.data, e.definition.ref).forEach(((c,m)=>{
                        var f = a.Z.getValue(e, "definition.layers.".concat(c.type, ".definition"))
                          , p = "".concat(e.definition.ref || "layers", ".").concat(m)
                          , u = s.Z.createHyperCubeHandler(p, e.args.properties, e.args.layout, e.args.app);
                        if (f) {
                            var h = t.get(r + c.cId)
                              , g = {
                                title: "function" == typeof f.title ? f.title(c, u) : f.title,
                                id: c.cId,
                                component: l.Z.findComponent(f),
                                definition: f,
                                show: o(f),
                                expanded: h || !1,
                                data: c
                            };
                            n.Z.defineLabel(g, f, i),
                            d[c.cId] = g
                        }
                    }
                    )),
                    d)
                }
                e.expandClicked = function(e) {
                    e.expanded = !e.expanded,
                    t.put(r + e.id, e.expanded)
                }
                ,
                e.$on("datachanged", (()=>{
                    d()
                }
                )),
                e.$watch("data", (()=>{
                    d()
                }
                ))
            }
            ]
        }
    }
    ,
    90837: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>s
        });
        var n = i(65035)
          , a = i(29474)
          , l = i(33417);
        const s = {
            template: a.Z,
            controller: ["$scope", function(e) {
                var t = function() {
                    return e.data
                };
                function i() {
                    e.listID = n.default.generateId();
                    var i = e.definition.options;
                    i = "function" == typeof i ? e.definition.options(t()) : i ? e.definition.options : [],
                    e.options = i.map((e=>{
                        var i = {
                            value: e.value
                        };
                        return l.Z.defineLabel(i, e, t),
                        l.Z.defineReadOnly(i, e, t),
                        i
                    }
                    ))
                }
                e.options = [],
                l.Z.defineChange(e, e.definition, t),
                l.Z.defineValue(e, e.definition, t),
                l.Z.defineLabel(e, e.definition, t),
                i(),
                e.$on("datachanged", (()=>{
                    i()
                }
                ))
            }
            ]
        }
    }
    ,
    14739: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>a
        });
        var n = i(33417);
        const a = {
            template: '<div class="em-item em-slider-component" ng-if="visible" tcl="slider">\n\t<div class="label">{{label}}</div>\n\t<div class="value">\n\t\t<div class="slider" pp-slider="sliderOptions" ng-model="value" ng-change="change()" ng-disabled="readOnly" ></div>\n\t</div>\n</div>',
            controller: ["$scope", function(e) {
                var t = function() {
                    return e.data
                };
                e.readOnly = !1,
                n.Z.defineLabel(e, e.definition, t),
                n.Z.defineVisible(e, e.definition, t),
                n.Z.defineChange(e, e.definition, t),
                n.Z.defineValue(e, e.definition, t),
                e.sliderOptions = {
                    min: e.definition.min,
                    max: e.definition.max,
                    step: e.definition.step,
                    range: "array" === e.definition.type
                }
            }
            ]
        }
    }
    ,
    3012: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>u
        });
        var n = i(58645)
          , a = i.n(n)
          , l = i(33417)
          , s = i(95272)
          , r = i(9401)
          , o = i(30278)
          , d = i(89713)
          , c = i(89202)
          , m = i(65419)
          , f = i(41335)
          , p = i(65035);
        const u = {
            template: '<div class="em-component em-sortable-component">\n\t<div class="em-list-container" qv-sortable-list="sortableItemLists">\n\t\t<ul class="em-list em-list-content em-sortable-list">\n\t\t\t<li ng-repeat="item in sortableItemLists.lists[0].items track by item.id" ng-include src="item.templateSrc" ng-class="item.classList"></li>\n\t\t</ul>\n\t</div>\n</div>\n',
            controller: ["$scope", function(e) {
                var t, i = e.args.cache, n = "em-sortable_";
                function u(e) {
                    var t = e && e.qDef && e.qDef.cId;
                    return t || (t = e.$$hashKey || p.default.generateId()),
                    t
                }
                function h(e) {
                    t.get().forEach((t=>{
                        t !== e && (t.expanded = !1,
                        i.put(n + t.id, t.expanded))
                    }
                    ))
                }
                function g() {
                    e.sortableItemLists.reset();
                    var l = []
                      , r = e.definition.items.dimensions
                      , f = o.Z.getValue(e.data, r.ref, [])
                      , p = o.Z.getValue(e.data, e.definition.items.measures.ref, [])
                      , h = a().limitedSorting({
                        measures: p,
                        properties: e.data
                    });
                    f.forEach(((t,a)=>{
                        var o = !1
                          , f = u(t)
                          , p = !0;
                        if ("function" == typeof r.included ? p = r.included.call(null, a, e.data, e.args.handler) : "boolean" == typeof r.included && (p = r.included),
                        p) {
                            "function" == typeof r.locked && (o = r.locked.call(null, a, e.data, e.args.layout));
                            var h = {
                                title() {
                                    var i = d.Z.getDimensionLayout(t.qDef.cId, e.args.layout, e.definition.hyperCubePath);
                                    return i && i.qError && !m.Z.isCalcCondNotCalculatedErr(i.qError) ? c.Z.getDimensionError(i.qError.qErrorCode) : i && i.qLibraryId ? i.title || "" : i && i.qFallbackTitle || ""
                                },
                                component: s.Z.getComponent("items"),
                                templateSrc: "em-sorting-item.ng.html",
                                definition: {
                                    type: "items",
                                    items: e.definition.items.dimensions.items
                                },
                                data: t,
                                interColIdx: a,
                                sortable: !o,
                                type: "dimension",
                                typeFlag: 1,
                                id: f,
                                state: {},
                                expanded: i.get(n + f) || !1,
                                expandable: !0,
                                showPriority: !1 !== r.showPriority
                            };
                            l.push(h)
                        }
                    }
                    )),
                    p.forEach(((t,a)=>{
                        var o = u(t)
                          , m = {
                            title() {
                                var i = d.Z.getMeasureLayout(t.qDef.cId, e.args.layout);
                                return i && i.qError ? c.Z.getDimensionError(i.qError.qErrorCode) : i && i.qFallbackTitle || ""
                            },
                            component: s.Z.getComponent("items"),
                            templateSrc: "em-sorting-item.ng.html",
                            definition: {
                                type: "items",
                                items: e.definition.items.measures.items
                            },
                            interColIdx: f.length + a,
                            sortable: !h,
                            type: "measure",
                            id: o,
                            expanded: i.get(n + o) || !1,
                            data: t,
                            state: {},
                            expandable: !h,
                            disabled: h,
                            showPriority: !1 !== r.showPriority
                        };
                        l.push(m)
                    }
                    ));
                    var g = o.Z.getValue(e.data, e.definition.sortIndexRef);
                    (g && g.length ? g.map((e=>l[e])) : l).forEach(((e,i)=>{
                        e.priority = i + 1,
                        t.addSortableItem(e)
                    }
                    ))
                }
                l.Z.defineLabel(e, e.definition, (function() {
                    return e.data
                }
                )),
                e.sortableItemLists = r.Z.create({
                    options: {
                        direction: "vertical",
                        listKey: "list",
                        listSelector: ".em-list",
                        itemKey: "item",
                        itemSelector: ".em-sortable",
                        itemDragSelector: ".em-sortable-handle",
                        gesture: {
                            name: "swipe",
                            options: {
                                radiusThreshold: f.Z.treatAsDesktop() ? 4 : 0,
                                preventDefault: !1
                            }
                        }
                    },
                    addPlaceholder() {
                        this._super.apply(this, arguments).classList = ["em-sortable"]
                    },
                    onBegin() {
                        h(),
                        this._super.apply(this, arguments)
                    },
                    onMove() {
                        var i = this._super.apply(this, arguments);
                        if (i) {
                            var n = t.get().map((e=>e.interColIdx));
                            e.data.qHyperCubeDef.qInterColumnSortOrder = n,
                            e.$emit("saveSoftProperties")
                        }
                        return i
                    }
                }),
                t = e.sortableItemLists.createList(1, {
                    tid: "em-list"
                }),
                e.itemClicked = function(e, t) {
                    t.disabled || (e.preventDefault(),
                    t.expanded = !t.expanded,
                    i.put(n + t.id, t.expanded),
                    h(t))
                }
                ,
                Object.keys(e.definition.items).forEach((t=>{
                    e.$watchCollection("data.".concat(e.definition.items[t].ref), g)
                }
                )),
                e.$watchCollection("data.".concat(e.definition.sortIndexRef), g),
                e.$on("datachanged", (()=>{
                    g()
                }
                ))
            }
            ]
        }
    }
    ,
    47960: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>l
        });
        var n = i(30248)
          , a = i(33417);
        const l = {
            template: '<div class="em-switch-component" ng-if="visible" tcl="switch">\n\t<div class="label" ng-if="label" ng-disabled="readOnly">\n\t\t<div class="title">{{label}}</div>\n\t\t<div class="value">{{getDescription(value)}}</div>\n\t</div>\n\t<lui-switch x-variant="inverse" x-model="switchValue" x-disabled="readOnly" tid="{{key}}"></lui-switch>\n</div>\n',
            controller: ["$scope", function(e) {
                var t, i, l = function() {
                    return e.data
                };
                e.readOnly = !1,
                a.Z.defineLabel(e, e.definition, l),
                a.Z.defineVisible(e, e.definition, l),
                a.Z.defineChange(e, e.definition, l),
                a.Z.defineValue(e, e.definition, l),
                void 0 !== e.definition.trueOption ? (t = e.definition.trueOption,
                i = e.definition.falseOption) : !0 === e.definition.options[0].value ? (t = e.definition.options[0],
                i = e.definition.options[1]) : (t = e.definition.options[1],
                i = e.definition.options[0]),
                t.translation && (t.label = n.default.get(t.translation),
                delete t.translation),
                i.translation && (i.label = n.default.get(i.translation),
                delete i.translation),
                e.trueOption = t,
                e.falseOption = i,
                e.getDescription = function(e) {
                    return e === t.value ? t.label : i.label
                }
                ,
                Object.defineProperty(e, "switchValue", {
                    get: ()=>e.value === t.value,
                    set(n) {
                        e.value = n ? t.value : i.value,
                        e.change()
                    }
                })
            }
            ]
        }
    }
    ,
    64947: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>a
        });
        var n = i(33417);
        const a = {
            template: '<div class="em-item em-item-text" ng-if="visible">\n    <div class="em-item-text-content">\n        <span class="em-item-text-label">{{label}}</span>\n    </div>\n</div>',
            controller: ["$scope", function(e) {
                n.Z.defineLabel(e, e.definition, e.data),
                n.Z.defineVisible(e, e.definition, e.data)
            }
            ]
        }
    }
    ,
    9401: (e,t,i)=>{
        i.d(t, {
            Z: ()=>d
        });
        var n = i(27909)
          , a = i(65035)
          , l = i(93792)
          , s = i(82176)
          , r = n.Z.extend("SortableItemList", {
            init(e, t) {
                this.items = [],
                this.disabled = !1,
                this.typeFlag = e || 1,
                this.locked = !1,
                Object.keys(t || {}).forEach((function(e) {
                    this[e] = t[e]
                }
                ), this)
            },
            addSortableItem(e, t) {
                Object.defineProperty(e, "__sortableItem__", {
                    configurable: !1,
                    enumerable: !0,
                    writable: !0,
                    value: {
                        typeFlag: t || 1
                    }
                }),
                this.items.push(e)
            },
            moveItem(e, t) {
                this.items.splice(t, 0, this.items.splice(e, 1)[0])
            },
            getIndexByItem(e) {
                return this.items.indexOf(e)
            },
            get(e) {
                return this.items.filter(e || (()=>!0))
            },
            getLockedIndices() {
                return this.get((e=>!!(e.__sortableItem__.typeFlag & s.Z.TYPEFLAG_LOCKED))).map((function(e) {
                    return this.getIndexByItem(e)
                }
                ), this)
            },
            reset() {
                this.items.length = 0,
                this.disabled = !1
            },
            isEmpty() {
                return 0 === this.items.length
            },
            setLocked(e) {
                this.locked = e
            }
        });
        Object.defineProperties(r.prototype, {
            length: {
                get() {
                    return this.items.length
                }
            }
        });
        var o = l.Z.extend("SortableItemLists", {
            init() {
                this._super.apply(this, arguments),
                this.lists = [],
                this.dragPlaceholder = null
            },
            addPlaceholder(e) {
                var t = this.getList(e)
                  , i = t ? t.items.indexOf(e) : -1;
                return this.dragPlaceholder = a.default.extend(!0, {}, e),
                this.dragPlaceholder.id = "placeholder",
                this.dragPlaceholder.__sortableItem__.typeFlag = s.Z.TYPEFLAG_PLACEHOLDER,
                this.dragPlaceholder.style = {
                    opacity: "0.3"
                },
                t && t.items.splice(i, 0, this.dragPlaceholder),
                this.dragPlaceholder
            },
            removePlaceholder() {
                if (this.dragPlaceholder) {
                    var e = this.getList(this.dragPlaceholder)
                      , t = e ? e.items.indexOf(this.dragPlaceholder) : -1;
                    -1 !== t && (e.items.splice(t, 1),
                    this.dragPlaceholder = null)
                }
            },
            getPlaceholder() {
                return this.dragPlaceholder
            },
            createList(e, t) {
                var i = new r(e,t);
                return this.lists.push(i),
                i
            },
            reset() {
                this.lists.forEach((e=>{
                    e.reset()
                }
                ))
            },
            getList(e) {
                return this.lists.filter((t=>-1 !== t.items.indexOf(e)))[0]
            },
            disable(e) {
                this.lists.forEach((t=>{
                    t.disabled = !(e.__sortableItem__.typeFlag & t.typeFlag)
                }
                ))
            },
            enable() {
                this.lists.forEach((e=>{
                    e.disabled = !1
                }
                ))
            },
            getIndexOfItem(e) {
                var t = this.getList(e);
                return t ? t.items.indexOf(e) : -1
            },
            moveItem(e, t) {
                var i = this.getList(e)
                  , n = this.getList(t);
                if (i && n) {
                    var a = n.items.indexOf(t)
                      , l = i.items.indexOf(e);
                    i.items.splice(l, 1),
                    n.items.splice(a, 0, e)
                }
            },
            onBegin(e, t) {
                this.addPlaceholder(e, t),
                this.disable(e)
            },
            onEnter(e, t) {
                var i = this.getList(e)
                  , n = i.getLockedIndices();
                if (e !== this.dragPlaceholder) {
                    if (t === s.Z.ENTER_BEFORE || t === s.Z.ENTER_AFTER) {
                        var a = this.getList(this.dragPlaceholder);
                        if (!a || !i)
                            return;
                        var l = a.getIndexByItem(this.dragPlaceholder);
                        a.items.splice(l, 1);
                        var r = i.getIndexByItem(e);
                        r += t === s.Z.ENTER_AFTER ? 1 : 0,
                        i.items.splice(r, 0, this.dragPlaceholder)
                    } else
                        this.moveItem(this.dragPlaceholder, e);
                    var o = i.getLockedIndices();
                    n.forEach(((e,t)=>{
                        i.moveItem(o[t], e)
                    }
                    ))
                }
            },
            onEnterList(e) {
                if (!e.disabled && !e.locked) {
                    var t = this.getList(this.dragPlaceholder);
                    if (t) {
                        var i = t.getIndexByItem(this.dragPlaceholder);
                        t.items.splice(i, 1),
                        e.items.push(this.dragPlaceholder)
                    }
                }
            },
            onMove(e) {
                if (-1 === this.getIndexOfItem(e))
                    return this.onCancel(),
                    !1;
                var t = this.dragPlaceholder;
                return this.moveItem(e, t),
                this.removePlaceholder(),
                this.enable(),
                !0
            },
            onMoveToList(e, t) {
                var i = this.getList(e);
                if (i && !t.disabled && !t.locked) {
                    var n = i.items.indexOf(e);
                    if (i === t)
                        return this.onMove(e, this.dragPlaceholder),
                        !0;
                    i.items.splice(n, 1),
                    t.items.push(e)
                }
                return this.removePlaceholder(),
                this.enable(),
                !!i
            },
            onCancel() {
                this.removePlaceholder(),
                this.enable()
            },
            allowEnter(e, t) {
                var i = this.getList(e);
                return void 0 !== i && !i.disabled && !i.locked && !!(t.__sortableItem__.typeFlag & i.typeFlag)
            },
            allowEnterList: (e,t)=>!e.disabled && !e.locked && !!(t.__sortableItem__.typeFlag & e.typeFlag)
        });
        o.create = function(e) {
            return e = new (o.extend(e || {}))(e && e.options)
        }
        ;
        const d = o
    }
    ,
    8900: (e,t,i)=>{
        i.d(t, {
            Z: ()=>p
        });
        var n = i(58645)
          , a = i.n(n)
          , l = i(30248)
          , s = i(54743)
          , r = i(57964);
        function o() {
            this.titles = {}
        }
        o.prototype.getDimensionTitle = function(e, t, i) {
            return f(this),
            c.call(this, e, t, i, !0)
        }
        ,
        o.prototype.getMeasureTitle = function(e, t, i) {
            return f(this),
            c.call(this, e, t, i, !1)
        }
        ,
        o.prototype.resetTitles = function() {
            this.titles = {}
        }
        ;
        const d = o;
        function c(e, t, i, n) {
            var o, d, c, f = (o = e,
            d = this.titles,
            c = m(o),
            d[c]);
            return f || (f = function(e, t) {
                var i = m(e)
                  , n = {
                    id: i,
                    promise: null
                };
                return t[i] = n,
                n
            }(e, this.titles),
            f.promise = function(e, t, i, n) {
                var o = "H" === e.qDef.qGrouping
                  , d = !!e.qLibraryId;
                if (o)
                    return s.Z.when(e.qData.title);
                if (d) {
                    return (n ? t.getDimensionList : t.getMeasureList).call(t).then((t=>{
                        var a = (n ? r.Z.findLibraryDimension : r.Z.findLibraryMeasure)(e.qLibraryId, t)
                          , s = a && a.qData.labelExpression;
                        return a ? !i && s ? s : a.qData.title : l.default.get(n ? "Object.ErrorMessage.MissingDimension" : "Object.ErrorMessage.MissingMeasure")
                    }
                    ))
                }
                var c, m = e.qDef.qLabelExpression;
                if (m)
                    return i ? s.Z.when(m) : t.evaluate(m);
                if (n) {
                    c = e.qDef.qFieldLabels[0] || e.qDef.qFieldDefs[0]
                } else
                    c = e.qDef.qLabel || a().measureBase.getExpression(e);
                return s.Z.when(c)
            }(e, t, i, n)),
            f.promise
        }
        function m(e) {
            return e.qDef.cId
        }
        function f(e) {
            if (!e)
                throw new Error("AlternativeTitleRetriever: Called without a context")
        }
        const p = {
            create: function() {
                return new d
            }
        }
    }
    ,
    22544: (e,t,i)=>{
        i.d(t, {
            Z: ()=>o
        });
        var n = i(8900);
        function a() {
            this.alternativeTitleRetriever = n.Z.create(),
            this.cache = {}
        }
        a.prototype.getDimensionTitle = function(e, t, i) {
            var n = this;
            return this.alternativeTitleRetriever.getDimensionTitle(e, t, i).then((t=>(r(n.cache, e.qDef.cId, t),
            t)))
        }
        ,
        a.prototype.getCachedDimensionTitle = function(e) {
            return s(this.cache, e.qDef.cId)
        }
        ,
        a.prototype.getMeasureTitle = function(e, t, i) {
            var n = this;
            return this.alternativeTitleRetriever.getMeasureTitle(e, t, i).then((t=>(r(n.cache, e.qDef.cId, t),
            t)))
        }
        ,
        a.prototype.getCachedMeasureTitle = function(e) {
            return s(this.cache, e.qDef.cId)
        }
        ,
        a.prototype.resetTitles = function() {
            this.alternativeTitleRetriever.resetTitles()
        }
        ;
        const l = a;
        function s(e, t) {
            return e[t] || ""
        }
        function r(e, t, i) {
            e[t] = i
        }
        const o = {
            create: function() {
                return new l
            }
        }
    }
    ,
    86642: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>n
        });
        const n = '<div class="em-item em-expandable" ng-class="{\'em-sortable\': item.sortable, \'em-disabled\': !item.expandable }" ng-style="item.style" qva-activate="item.expandable && itemClicked($event,item);">\n\t<i class="em-toggle-expand em-item-icon lui-icon {{item.expanded ? \'lui-icon--triangle-bottom\' : \'lui-icon--triangle-right\'}}" ng-class="{\'em-hidden\': !item.expandable}"></i>\n    <span class="em-text" title="{{item.title}}">{{item.title}}&nbsp;</span>\n    <span class="lui-icon lui-icon--handle em-move-item em-sortable-handle" ng-if="item.sortable" q-title-translation="Common.Move"></span>\n</div>\n<div class="em-section-content em-alternative-data" ng-if="item.expanded">\n\t<div hypercube-data-item ng-repeat="alternative in item.alternatives"></div>\n</div>\n'
    }
    ,
    29474: (e,t,i)=>{
        i.d(t, {
            Z: ()=>n
        });
        const n = '<div>\n  <div class="em-item em-item-inner" ng-if="label">{{label}}</div>\n  <div class="em-item em-item-inner em-radiobuttons-component" ng-repeat="option in options track by option.value">\n    <label class="lui-radiobutton  lui-radiobutton--inverse" tid="{{option.value}}" title="{{option.label}}">\n      <input class="lui-radiobutton__input" type="radio" ng-value="option.value" ng-model="value" ng-disabled="option.readOnly" ng-change="change(option.value)" name="{{listID}}">\n      <div class="lui-radiobutton__radio-wrap" qva-tabindex="0">\n          <span class="lui-radiobutton__radio"></span>\n          <span class="lui-radiobutton__radio-text">{{option.label}}</span>\n      </div>\n    </label>\n  </div>\n</div>\n'
    }
    ,
    80476: (e,t,i)=>{
        i.r(t),
        i.d(t, {
            default: ()=>n
        });
        const n = '<div class="em-item em-expandable" ng-class="{\'disabled\': item.disabled, \'em-sortable\': item.sortable }" ng-style="item.style" qva-activate="itemClicked($event,item);">\n    <div class="em-list-index" ng-if="item.showPriority">{{item.priority}}</div>\n    <span class="em-toggle-expand em-item-icon lui-icon {{item.expanded ? \'lui-icon--triangle-bottom\' : \'lui-icon--triangle-right\'}}"></span>\n    <span class="em-text" title="{{item.title()}}">{{item.title()}}</span>\n    <span class="lui-icon lui-icon--handle em-move-item em-sortable-handle" ng-if="item.sortable" q-title-translation="Common.Move"></span>\n</div>\n<div class="em-section-content" ng-if="item.expanded">\n    <div include-em-component x-component="item.component" x-definition="item.definition"\n     x-data="item.data" x-args="args">\n    </div>\n</div>\n'
    }
}]);
