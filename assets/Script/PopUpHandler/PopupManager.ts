import { Prefab, Node, isValid, warn, _decorator, instantiate, resources, director, log } from "cc";
import PopupBase from "./PopupBase";
import { ASSET_CACHE_MODE, PopupStruct, PopupParams } from "../constants/Popup";

const { ccclass } = _decorator;

/**
 * Pop -up cache mode
 */
// export enum CacheMode {
//   /** 一Secondary (immediately destroy nodes, prefabricated body resources are released immediately） */
//   Once = 1,
//   /** Normal (destroy the node immediately, but cache prefabricated resources） */
//   Normal,
//   /** Frequent (only close the node, and cache prefabricated body resources) */
//   Frequent,
// }

/**
 * Pop -up request results type
 */
enum ShowResultType {
    /** Show successfully (closed） */
    Done = 1,
    /** Show failed (failed to load） */
    Failed,
    /** Waiting (have joined the waiting queue） */
    Waiting,
}

/**ß
 * Popping window manager
 * @author Chandan Krishnani
 * @version 0.0.1
 */

@ccclass("PopupManager")
export class PopupManager {
    /**
     * Prefabrication cache
     */
    public static get prefabCache() {
        return this._prefabCache;
    }
    private static _prefabCache: Map<string, Prefab> = new Map<string, Prefab>();

    /**
     * Node cache
     */
    public static get nodeCache() {
        return this._nodeCache;
    }
    private static _nodeCache: Map<string, Node> = new Map<string, Node>();

    /**
     * Current pop -up request
     */
    public static get current() {
        return this._current;
    }
    private static _current: PopupRequestType = null;

    /**
     * Waiting for queue
     */
    public static get queue() {
        return this._queue;
    }
    private static _queue: PopupRequestType[] = [];

    /**
     * Hanging pop -up window column
     */
    public static get suspended() {
        return this._suspended;
    }
    private static _suspended: PopupRequestType[] = [];

    /**
     * Locking status
     */
    private static locked: boolean = false;

    /**
     * The container nodes used to store pop -up window nodes (if it is not set, it defaults to the current Canvas)
     */
    public static get container() {
        return this._container || director.getScene().getChildByName("Canvas");
    }
    public static set container(value) {
        this._container = value;
    }
    public static _container: Node = null;

    /**
     * Continuously display the time interval of pop -up window (seconds)
     */
    public static interval: number = 0.05;

    /**
     * Pop -up cache mode
     */
    public static get CacheMode() {
        return ASSET_CACHE_MODE;
    }

    /**
     * Pop -up request results type
     */
    public static get ShowResultType() {
        return ShowResultType;
    }

    /**
     * Popcopic dynamic loading starts to call back
     * @example
     * PopupManager.loadStartCallback = () => {
     *     LoadingTip.show();
     * };
     */
    public static loadStartCallback: () => void = null;

    /**
     * Popchen windows dynamic loading ends back
     * @example
     * PopupManager.loadFinishCallback = () => {
     *     LoadingTip.hide();
     * };
     */
    public static loadFinishCallback: () => void = null;

    /**
     * Show the pop -up window.
     * @Param Path pop -up window pre -pre -pre -pre -made path (such as prefabs/mypopup)
     * @param Options pop -up window options
     * @param Params pop -up display parameters
     * @example
     * const options = {
     *     title: 'Hello',
     *     content: 'This is a popup!'
     * };
     * const params = {
     *     mode: PopupCacheMode.Normal
     * };
     * PopupManager.show('prefabs/MyPopup', options, params);
     */
    public static show<Options>(
        popupSetting: PopupStruct,
        options?: Options
        // params?: PopupParamsType
    ): Promise<ShowResultType> {
        return new Promise(async (res) => {
            // Analysis processing parameters
            let params: PopupParams = popupSetting.params;
            // At present, there are already pop -up windows in the display to join the waiting queue
            console.log("Inside promise");
            if (this._current || this.locked) {
                // Whether to show immediately
                if (params && params.immediately) {
                    this.locked = false;
                    // Hanging the current pop -up window
                    await this.suspend();
                } else {
                    // Push the request into the waiting queue
                    this.push(popupSetting.path, options, params);
                    res(ShowResultType.Waiting);
                    return;
                }
            }
            // Save as the current pop -up window, prevent new pop -up requests
            this._current = { path: popupSetting.path, options, params };
            // ß
            let node = this.getNodeFromCache(popupSetting.path);
            // No in the cache, dynamically load prefabricated body resources
            if (!node || !isValid(node)) {
                // Start the callback
                this.loadStartCallback && this.loadStartCallback();
                // Waiting for loading
                const prefab = await this.load(popupSetting.path);
                // Complete the callback
                this.loadFinishCallback && this.loadFinishCallback();
                // Load failure (generally caused by path errors)

                if (!isValid(prefab)) {
                    warn("[PopupManager]", "Popping window load failed", popupSetting.path);
                    this._current = null;
                    res(ShowResultType.Failed);
                    return;
                }
                // instantiated node
                console.log("Prefab loaded", prefab);
                node = instantiate(prefab);
            }
            console.log("Node we have", node);
            // Get a pop -up component inherited from PopupBase
            const popup = node.getComponent(PopupBase);

            if (!popup) {
                warn("[PopupManager]", "No pop -up component was found", popupSetting.path);
                this._current = null;
                res(ShowResultType.Failed);
                return;
            }
            // Save component reference
            this._current.popup = popup;
            // Save node reference
            this._current.node = node;
            // Add to the scene
            node.setParent(this.container);
            // Show at the top level
            // node.setSiblingIndex(1000);
            // Set up to complete the callback
            // @ts-ignore
            popup.finishCallback = async (suspended: boolean) => {
                console.log("Finished call recived", suspended);
                if (suspended) {
                    return;
                }
                // Whether to lock
                this.locked = this._suspended.length > 0 || this._queue.length > 0;
                // Recycle
                this.recycle(popupSetting.path, node, params.mode);
                this._current = null;
                res(ShowResultType.Done);
                // Delay for a while

                await new Promise((_res) => {
                    setTimeout(_res, this.interval);
                    //   this.scheduleOnce(_res, this.interval); //Checking for the issue
                });
                // );
                // Next pop -up window

                this.next();
            };
            // exhibit
            popup.show(options);
        });
    }

    /**
     * Hide the current pop -up window
     */
    public static hide() {
        if (!isValid(this._current.popup)) {
            this._current.popup.hide();
        }
    }

    /**
     * Get the node from the cache
     * @param path Pop -up path
     */
    private static getNodeFromCache(path: string): Node {
        // Get from the node cache
        const nodeCache = this._nodeCache;
        if (nodeCache.has(path)) {
            const node = nodeCache.get(path);
            if (isValid(node)) {
                return node;
            }
            // Delete invalid reference
            nodeCache.delete(path);
        }
        // Get from the prefabrication cache
        const prefabCache = this._prefabCache;
        if (prefabCache.has(path)) {
            const prefab = prefabCache.get(path);
            if (isValid(prefab)) {
                // Add reference count
                prefab.addRef();
                // Instantiated and returned
                return instantiate(prefab);
            }
            // Delete invalid reference
            prefabCache.delete(path);
        }
        // none
        return null;
    }

    /**
     * Show pending or waiting for the next popup in the queue
     */
    private static next() {
        if (this._current || (this._suspended.length === 0 && this._queue.length === 0)) {
            return;
        }
        // Take out a request
        let request: PopupRequestType = null;
        if (this._suspended.length > 0) {
            // Linked queue
            request = this._suspended.shift();
        } else {
            // Wait for queue
            request = this._queue.shift();
        }
        // unlock
        this.locked = false;
        // Existing examples
        if (isValid(request.popup)) {
            // Set to the current pop -up window
            this._current = request;
            // Display directly
            request.node.setParent(this.container);
            request.popup.show(request.options);
            return;
        }
        // Load and display
        let settings: PopupStruct = {
            path: request.path,
            params: request.params,
        };
        this.show(settings, request.options);
    }

    /**
     * Add a pop -up request to the waiting queue. If there is no pop -up window in the display, the pop -up window is directly displayed.
     * @Param Path pop -up window pre -pre -pre -pre -made path (such as prefabs/mypopup)
     * @param Options pop -up window options
     * @param Params pop -up display parameters
     */
    private static push<Options>(path: string, options?: Options, params?: PopupParamsType) {
        // Display directly
        if (!this._current && !this.locked) {
            let settings: PopupStruct = {
                path: path,
                params: params,
            };
            this.show(settings, options);
            return;
        }
        // Join the queue
        this._queue.push({ path, options, params });
        // Sort by priority from small to large
        this._queue.sort((a, b) => a.params.priority - b.params.priority);
    }

    /**
     * Hanging the pop -up window in the current display
     */
    private static async suspend() {
        if (!this._current) {
            return;
        }
        const request = this._current;
        // Push the current pop -up window to hang the queue
        this._suspended.push(request);
        // @ts-ignore
        await request.popup.onSuspended();
        // Close the current pop -up window (hanging)
        await request.popup.hide(true);
        // Putting on the current
        this._current = null;
    }

    /**
     * Recycling pop -up window
     * @param Path pop -up path
     * @param Node pop -up window node
     * @param Mode cache mode
     */
    private static recycle(path: string, node: Node, mode: ASSET_CACHE_MODE) {
        console.log("Node release call  recycle recived and ", path, node, mode);
        switch (mode) {
            // One -time
            case ASSET_CACHE_MODE.Once: {
                console.log("1");
                this._nodeCache.delete(path);
                console.log("21");
                node.destroy();
                console.log("3");
                // freed
                this.release(path);
                break;
            }
            // normal
            case ASSET_CACHE_MODE.Normal: {
                console.log("1");
                this._nodeCache.delete(path);
                node.destroy();
                console.log("2");
                break;
            }
            // frequently
            case ASSET_CACHE_MODE.Frequent: {
                console.log("1");
                node.removeFromParent();

                console.log("22");
                this._nodeCache.set(path, node);
                break;
            }
        }
    }

    /**
     * Load and cache the pop -up pre -pre -made body resources
     * @param Path pop -up path
     */
    public static load(path: string): Promise<Prefab> {
        return new Promise((res) => {
            const prefabMap = this._prefabCache;
            // See if there is any in the cache, avoid repeated loading
            if (prefabMap.has(path)) {
                const prefab = prefabMap.get(path);
                // Whether the cache is effective
                if (isValid(prefab)) {
                    res(prefab);
                    return;
                } else {
                    // Delete invalid reference
                    prefabMap.delete(path);
                }
            }

            // Dynamic load
            resources.load(path, (error: Error, prefab: Prefab) => {
                if (error) {
                    console.log("Error loadingprefab", path, error);
                    res(null);
                    return;
                }
                console.log("Prefab loaded", path);
                prefabMap.set(path, prefab);
                // return
                res(prefab);
            });
        });
    }

    /**
     * Try to release the pop -up resource (note: please release the resource loaded in the pop -up window)
     * @param path Pop -up path
     */
    public static release(path: string) {
        // Remove nodes
        const nodeCache = this._nodeCache;
        let node = nodeCache.get(path);
        if (node) {
            nodeCache.delete(path);
            if (isValid(node)) {
                node.destroy();
            }
            node = null;
        }
        // Remove the prefabrication
        const prefabCache = this._prefabCache;
        let prefab = prefabCache.get(path);
        if (prefab) {
            // Delete cache
            if (prefab.refCount <= 1) {
                prefabCache.delete(path);
            }
            // Reduce reference
            prefab.decRef();
            prefab = null;
        }
    }

    /**
     * Analysis parameter
     * @param Params parameters
     */
    private static parseParams(params: PopupParamsType) {
        if (params == undefined) {
            return new PopupParamsType();
        }
        // Whether to
        if (Object.prototype.toString.call(params) !== "[object Object]") {
            warn("[PopupManager]", "The pop -up parameters are invalid, using the default parameter");
            return new PopupParamsType();
        }
        // Cache mode
        if (params.mode == undefined) {
            params.mode = ASSET_CACHE_MODE.Normal;
        }
        // priority
        if (params.priority == undefined) {
            params.priority = 0;
        }
        // Immediately show
        if (params.immediately == undefined) {
            params.immediately = false;
        }
        return params;
    }
}

/**
 * Popping window display parameter type
 */
class PopupParamsType {
    /** Cache mode */
    mode?: ASSET_CACHE_MODE = ASSET_CACHE_MODE.Normal;
    /** Priority (priority priority display) */
    priority?: number = 0;
    /** Show immediately (will hang the pop -up window in the current display) */
    immediately?: boolean = false;
}

/**
 * Pop -up display request type
 */
class PopupRequestType {
    /** Practical prefabricated path */
    path: string;
    /** Pop -up option */
    options: any;
    /** Cache mode */
    params: PopupParamsType;
    /** Pop -up component */
    popup?: PopupBase;
    /** Pop -up node */
    node?: Node;
}
