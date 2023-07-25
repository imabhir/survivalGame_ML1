import { PopupManager } from "../PopUpHandler/PopupManager";
export enum POPUP_PRIORITY {
  LOW = -1,
  HIGH = 1,
  MEDIUM = 0,
}
export interface PopupStruct {
  // Path of Popup
  path?: string;
  params: PopupParams;
}
export enum ASSET_CACHE_MODE {
  /** 一Secondary (immediately destroy nodes, prefabricated body resources are released immediately） */
  Once = 1,
  /** Normal (destroy the node immediately, but cache prefabricated resources） */
  Normal,
  /** Frequent (only close the node, and cache prefabricated body resources) */
  Frequent,
}

export interface PopupParams {
  //Cache Mode of popup like ( Normal , once and frequent )
  mode?: ASSET_CACHE_MODE;
  //Priority of popup to be opened
  priority?: POPUP_PRIORITY;
  //Popup true if
  immediately?: boolean;
}

export const POPUPS: Record<string, PopupStruct> = {
  SETTINGS: {
    path: "prefabs/SettingPanel",
    params: {
      mode: ASSET_CACHE_MODE.Frequent,
      priority: POPUP_PRIORITY.HIGH,
      immediately: false,
    },
  },
  ACCOUNT: {
    path: "prefabs/AccountPopUp",
    params: {
      mode: ASSET_CACHE_MODE.Frequent,
      priority: POPUP_PRIORITY.HIGH,
      immediately: false,
    },
  },
  // TEST2: {
  //     path: "prefabs/settingsPopup-1",
  //     params: {
  //         mode: ASSET_CACHE_MODE.Frequent,
  //         priority: POPUP_PRIORITY.MEDIUM,
  //         immediately: false,
  //     },
  // },
  // MANAGE_PROFILE: {
  //     // path: "assets/Prefab/Setting/manageProfile",
  //     path: "Prefab/Setting/manageProfile",
  //     params: {
  //         mode: ASSET_CACHE_MODE.Normal,
  //         priority: POPUP_PRIORITY.HIGH,
  //         immediately: true,
  //     },
  // },
  // LOGOUT: {
  //     // path: "assets/Prefab/Setting/manageProfile",
  //     path: "Prefab/Setting/confirmLogout",
  //     params: {
  //         mode: ASSET_CACHE_MODE.Frequent,
  //         priority: POPUP_PRIORITY.LOW,
  //         immediately: false,
  //     },
  // },
};
/**
 * Pop -up cache mode
 */
