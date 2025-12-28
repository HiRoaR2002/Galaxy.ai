(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/useStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
;
;
const useStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        nodes: [],
        edges: [],
        history: {
            past: [],
            future: []
        },
        onNodesChange: (changes)=>{
            // Basic snapshot on meaningful changes (drag end, selection change etc might be too frequent, 
            // but for now we snapshot on every change for simplicity or filter types)
            // Real implementation would debounce or filter 'position' changes on dragEnd.
            set({
                nodes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNodeChanges"])(changes, get().nodes)
            });
        },
        onEdgesChange: (changes)=>{
            set({
                edges: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyEdgeChanges"])(changes, get().edges)
            });
        },
        onConnect: (connection)=>{
            get().takeSnapshot();
            set({
                edges: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addEdge"])({
                    ...connection,
                    animated: true,
                    style: {
                        stroke: '#7c3aed'
                    }
                }, get().edges)
            });
        },
        setNodes: (nodes)=>set({
                nodes
            }),
        setEdges: (edges)=>set({
                edges
            }),
        addNode: (node)=>{
            get().takeSnapshot();
            set({
                nodes: [
                    ...get().nodes,
                    node
                ]
            });
        },
        updateNodeData: (id, data)=>{
            // Don't snapshot on every text keystroke, parent component should handle debounce/snapshot call if needed.
            set({
                nodes: get().nodes.map((node)=>node.id === id ? {
                        ...node,
                        data: {
                            ...node.data,
                            ...data
                        }
                    } : node)
            });
        },
        takeSnapshot: ()=>{
            const { nodes, edges, history } = get();
            // Limit history size to 50
            const newPast = [
                ...history.past,
                {
                    nodes,
                    edges
                }
            ].slice(-50);
            set({
                history: {
                    past: newPast,
                    future: []
                }
            });
        },
        undo: ()=>{
            const { history, nodes, edges } = get();
            if (history.past.length === 0) return;
            const previous = history.past[history.past.length - 1];
            const newPast = history.past.slice(0, history.past.length - 1);
            set({
                nodes: previous.nodes,
                edges: previous.edges,
                history: {
                    past: newPast,
                    future: [
                        {
                            nodes,
                            edges
                        },
                        ...history.future
                    ]
                }
            });
        },
        redo: ()=>{
            const { history, nodes, edges } = get();
            if (history.future.length === 0) return;
            const next = history.future[0];
            const newFuture = history.future.slice(1);
            set({
                nodes: next.nodes,
                edges: next.edges,
                history: {
                    past: [
                        ...history.past,
                        {
                            nodes,
                            edges
                        }
                    ],
                    future: newFuture
                }
            });
        },
        saveWorkflow: ()=>{
            const { nodes, edges } = get();
            const workflow = {
                nodes,
                edges
            };
            localStorage.setItem('galaxy-workflow', JSON.stringify(workflow));
            // In a real app, this would POST to DB
            console.log('Saved to local storage');
        },
        loadWorkflow: (workflow)=>{
            set({
                nodes: workflow.nodes,
                edges: workflow.edges,
                history: {
                    past: [],
                    future: []
                }
            });
        }
    }));
const __TURBOPACK__default__export__ = useStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/defaultWorkflow.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultEdges",
    ()=>defaultEdges,
    "defaultNodes",
    ()=>defaultNodes
]);
const defaultNodes = [
    // Inputs
    {
        id: 'img1',
        type: 'imageNode',
        position: {
            x: 50,
            y: 50
        },
        data: {
            label: 'Product Photo 1'
        }
    },
    {
        id: 'img2',
        type: 'imageNode',
        position: {
            x: 50,
            y: 350
        },
        data: {
            label: 'Product Photo 2'
        }
    },
    {
        id: 'img3',
        type: 'imageNode',
        position: {
            x: 50,
            y: 650
        },
        data: {
            label: 'Product Photo 3'
        }
    },
    {
        id: 'sys',
        type: 'textNode',
        position: {
            x: 400,
            y: 50
        },
        data: {
            label: 'Generic System Prompt',
            text: 'You are an expert e-commerce copywriter. Analyze the product images and details provided.'
        }
    },
    {
        id: 'prod',
        type: 'textNode',
        position: {
            x: 400,
            y: 350
        },
        data: {
            label: 'Product Details',
            text: 'Product: Noise Cancelling Headphones. Features: 30h battery, active noise cancellation, deep bass.'
        }
    },
    // Analyzer LLM
    {
        id: 'analyze',
        type: 'llmNode',
        position: {
            x: 800,
            y: 200
        },
        data: {
            label: 'Analyze Product',
            model: 'gemini-2.0-flash'
        }
    },
    // Instructions for Branches
    {
        id: 'inst1',
        type: 'textNode',
        position: {
            x: 900,
            y: -100
        },
        data: {
            label: 'Amazon Prompt',
            text: 'Write a professional Amazon listing based on the product analysis.'
        }
    },
    {
        id: 'inst2',
        type: 'textNode',
        position: {
            x: 900,
            y: 250
        },
        data: {
            label: 'Instagram Prompt',
            text: 'Write a fun Instagram caption with hashtags based on the analysis.'
        }
    },
    {
        id: 'inst3',
        type: 'textNode',
        position: {
            x: 900,
            y: 550
        },
        data: {
            label: 'SEO Prompt',
            text: 'Write a concise SEO meta description.'
        }
    },
    // Branching LLMs
    {
        id: 'amazon',
        type: 'llmNode',
        position: {
            x: 1200,
            y: 0
        },
        data: {
            label: 'Write Amazon Listing',
            model: 'gemini-2.0-flash'
        }
    },
    {
        id: 'insta',
        type: 'llmNode',
        position: {
            x: 1200,
            y: 300
        },
        data: {
            label: 'Write Instagram Caption',
            model: 'gemini-2.0-flash'
        }
    },
    {
        id: 'seo',
        type: 'llmNode',
        position: {
            x: 1200,
            y: 600
        },
        data: {
            label: 'Write SEO Description',
            model: 'gemini-2.0-flash'
        }
    },
    // Display Outputs
    {
        id: 'out1',
        type: 'textNode',
        position: {
            x: 1600,
            y: 0
        },
        data: {
            label: 'Amazon Output',
            text: ''
        }
    },
    {
        id: 'out2',
        type: 'textNode',
        position: {
            x: 1600,
            y: 300
        },
        data: {
            label: 'Insta Output',
            text: ''
        }
    },
    {
        id: 'out3',
        type: 'textNode',
        position: {
            x: 1600,
            y: 600
        },
        data: {
            label: 'SEO Output',
            text: ''
        }
    }
];
const defaultEdges = [
    // Connect Images to Analyzer
    {
        id: 'e1',
        source: 'img1',
        target: 'analyze',
        targetHandle: 'images',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e2',
        source: 'img2',
        target: 'analyze',
        targetHandle: 'images',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e3',
        source: 'img3',
        target: 'analyze',
        targetHandle: 'images',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    // Connect Texts to Analyzer
    {
        id: 'e4',
        source: 'sys',
        target: 'analyze',
        targetHandle: 'system',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e5',
        source: 'prod',
        target: 'analyze',
        targetHandle: 'user',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    // Instructions to Branches
    {
        id: 'e_inst1',
        source: 'inst1',
        target: 'amazon',
        targetHandle: 'system',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e_inst2',
        source: 'inst2',
        target: 'insta',
        targetHandle: 'system',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e_inst3',
        source: 'inst3',
        target: 'seo',
        targetHandle: 'system',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    // Connect Analyzer Output to Branching LLMs
    {
        id: 'e6',
        source: 'analyze',
        target: 'amazon',
        targetHandle: 'user',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e7',
        source: 'analyze',
        target: 'insta',
        targetHandle: 'user',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e8',
        source: 'analyze',
        target: 'seo',
        targetHandle: 'user',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    // Outputs to Display TextNodes
    {
        id: 'e9',
        source: 'amazon',
        target: 'out1',
        targetHandle: 'target',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e10',
        source: 'insta',
        target: 'out2',
        targetHandle: 'target',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    },
    {
        id: 'e11',
        source: 'seo',
        target: 'out3',
        targetHandle: 'target',
        animated: true,
        style: {
            stroke: '#7c3aed'
        }
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript) <export ReactFlow as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/controls/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$background$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/background/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$minimap$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/minimap/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reactflow/core/dist/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useStore.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/Sidebar'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/nodes/TextNode'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/nodes/ImageNode'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/nodes/LLMNode'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$defaultWorkflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/defaultWorkflow.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
const nodeTypes = {
    textNode: TextNode,
    imageNode: ImageNode,
    llmNode: LLMNode
};
function Flow() {
    _s();
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setNodes, setEdges } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    const { screenToFlowPosition } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactFlow"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Flow.useEffect": ()=>{
            // Load default workflow if empty
            // Check if we have nodes in store (could be empty array)
            // To strictly load the requirement every time or just once? "Pre-build... that loads by default".
            // I'll check if edges/nodes are empty.
            if (nodes.length === 0) {
                setNodes(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$defaultWorkflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultNodes"]);
                setEdges(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$defaultWorkflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultEdges"]);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Flow.useEffect"], []);
    const onDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Flow.useCallback[onDragOver]": (event)=>{
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        }
    }["Flow.useCallback[onDragOver]"], []);
    const onDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Flow.useCallback[onDrop]": (event)=>{
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) {
                return;
            }
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY
            });
            const newNode = {
                id: crypto.randomUUID(),
                type,
                position,
                data: {}
            };
            if (type === 'llmNode') newNode.data = {
                label: 'New Model',
                model: 'gemini-2.0-flash'
            };
            if (type === 'textNode') newNode.data = {
                label: 'Text',
                text: ''
            };
            if (type === 'imageNode') newNode.data = {
                label: 'Image',
                imageData: null
            };
            addNode(newNode);
        }
    }["Flow.useCallback[onDrop]"], [
        screenToFlowPosition,
        addNode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex w-full h-screen overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sidebar, {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 h-full relative bg-slate-50 dark:bg-slate-950",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ReactFlow__as__default$3e$__["default"], {
                    nodes: nodes,
                    edges: edges,
                    onNodesChange: onNodesChange,
                    onEdgesChange: onEdgesChange,
                    onConnect: onConnect,
                    nodeTypes: nodeTypes,
                    onDragOver: onDragOver,
                    onDrop: onDrop,
                    fitView: true,
                    className: "bg-slate-50 dark:bg-slate-950",
                    minZoom: 0.1,
                    maxZoom: 4,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$background$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Background"], {
                            color: "#94a3b8",
                            gap: 20,
                            size: 1,
                            className: "opacity-20"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 95,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$controls$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controls"], {
                            className: "!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 !fill-current !text-slate-600 dark:!text-slate-300"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 96,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$minimap$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniMap"], {
                            className: "!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 rounded-lg overflow-hidden",
                            nodeColor: (n)=>{
                                if (n.type === 'llmNode') return '#7c3aed';
                                if (n.type === 'imageNode') return '#ec4899';
                                if (n.type === 'textNode') return '#3b82f6';
                                return '#64748b';
                            },
                            maskColor: "rgba(0, 0, 0, 0.1)"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 97,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 81,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 78,
        columnNumber: 7
    }, this);
}
_s(Flow, "LgaI6yNwaF1wFPXSC+e678kKx5k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReactFlow"]
    ];
});
_c = Flow;
function Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reactflow$2f$core$2f$dist$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReactFlowProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Flow, {}, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 116,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 115,
        columnNumber: 9
    }, this);
}
_c1 = Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "Flow");
__turbopack_context__.k.register(_c1, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_75f8e164._.js.map