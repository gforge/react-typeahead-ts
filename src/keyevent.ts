/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * PolyFills make me sad
 */
const KeyEvent: {
  [propName: string]: number;
  DOM_VK_UP: number;
  DOM_VK_DOWN: number;
  DOM_VK_BACK_SPACE: number;
  DOM_VK_RETURN: number;
  DOM_VK_ENTER: number;
  DOM_VK_ESCAPE: number;
  DOM_VK_TAB: number;
  DOM_VK_COMMA: number;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
} = KeyEvent || {};

KeyEvent.DOM_VK_UP = KeyEvent.DOM_VK_UP || 38;
KeyEvent.DOM_VK_DOWN = KeyEvent.DOM_VK_DOWN || 40;
KeyEvent.DOM_VK_BACK_SPACE = KeyEvent.DOM_VK_BACK_SPACE || 8;
KeyEvent.DOM_VK_RETURN = KeyEvent.DOM_VK_RETURN || 13;
KeyEvent.DOM_VK_ENTER = KeyEvent.DOM_VK_ENTER || 14;
KeyEvent.DOM_VK_ESCAPE = KeyEvent.DOM_VK_ESCAPE || 27;
KeyEvent.DOM_VK_TAB = KeyEvent.DOM_VK_TAB || 9;
KeyEvent.DOM_VK_COMMA = KeyEvent.DOM_VK_COMMA || 188;

export default KeyEvent;
