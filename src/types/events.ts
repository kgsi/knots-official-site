// カスタムイベントの型定義
export interface MenuToggleEvent extends CustomEvent {
  detail: {
    isOpen: boolean;
  };
}

// グローバルイベントマップの拡張
declare global {
  interface DocumentEventMap {
    'menu:toggle': MenuToggleEvent;
  }
}