import KeyboardNavigatable from 'flarum/utils/KeyboardNavigatable';

export default class FixedKeyboardNavigatable extends KeyboardNavigatable {
    /**
     * Interpret the given keyboard event as navigation commands.
     *
     * This is the same as the original method, with the addition of passing the event to whenCallback, so it can decide based on the key
     *
     * @public
     * @param {KeyboardEvent} event
     */
    navigate(event) {
        if (!this.whenCallback(event)) return;

        const keyCallback = this.callbacks[event.which];
        if (keyCallback) {
            keyCallback(event);
        }
    }
}
