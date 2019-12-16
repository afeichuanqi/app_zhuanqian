import {NativeModules} from 'react-native';

const {WebSocketModule} = NativeModules;

let timeout;
let settings = {
    /** The number of milliseconds to delay before attempting to reconnect. */
    reconnectInterval: 1000,
    /** The maximum number of milliseconds to delay a reconnection attempt. */
    maxReconnectInterval: 30000,
    /** The rate of increase of the reconnect delay. Allows reconnect attempts to back off when problems persist. */
    reconnectDecay: 1.5,

    /** The maximum time in milliseconds to wait for a connection to succeed before closing and retrying. */
    timeoutInterval: 2000,

    /** The maximum number of reconnection attempts to make. Unlimited if null. */
    maxReconnectAttempts: null,
};


class ReconnectingWebSocket extends WebSocket {
    constructor(url, protocols, options) {
        if (!options) {
            options = {};
        }
        super(url, protocols, {headers: options.headers});

        // Overwrite and define settings with options if they exist.
        for (let key in settings) {
            if (typeof options[key] !== 'undefined') {
                this[key] = options[key];
            } else {
                this[key] = settings[key];
            }
        }
        // These should be treated as read-only properties

        /** The URL as resolved by the constructor. This is always an absolute URL. Read only. */
        this.url = url;

        /** The number of attempted reconnects since starting, or the last successful connection. Read only. */
        this.reconnectAttempts = 0;

        this.protocols = protocols;
    }

    _unregisterEvents() {
        if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
            return super._unregisterEvents();
        }
    }

    _registerEvents() {
        super._registerEvents();
        this._subscriptions.push(
            /** @Override onopen **/
            this._eventEmitter.addListener('websocketOpen', ev => {
                console.log(ev.id, 'websocketOpen', this._socketId);
                // if (ev.id !== this._socketId) {
                //     return;
                // }

                clearTimeout(timeout);
                this.reconnectAttempts = 0;
            }),

            /** @Override onclose **/
            this._eventEmitter.addListener('websocketClosed', ev => {
                console.log(ev.id, 'websocketClosed', this._socketId);
                // console.log(ev.id ,'websocketClosed', this._socketId);
                // if (ev.id !== this._socketId) {
                //     return;
                // }

                let _timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        this.reconnect();
                    }, _timeout > this.maxReconnectInterval ? this.maxReconnectInterval : _timeout);
                }

            }),

            /** @Override onerror **/
            this._eventEmitter.addListener('websocketFailed', ev => {
                console.log(ev.id, 'websocketFailed', this._socketId);
                // if (ev.id !== this._socketId) {
                //     return;
                // }
                let _timeout = this.reconnectInterval * Math.pow(this.reconnectDecay, this.reconnectAttempts);
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        this.reconnect();
                    }, _timeout > this.maxReconnectInterval ? this.maxReconnectInterval : _timeout);
                }

            }),
        );
    }

    reconnect = () => {
        if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
            return;
        }
        setTimeout(() => {

            WebSocketModule.connect(
                this.url,
                this.protocols,
                this.headers,
                this._socketId,
            );

            timeout = setTimeout(() => {
                this.reconnect();
            }, this.timeoutInterval);

        }, this.reconnectInterval);

    };
}

export default ReconnectingWebSocket;
