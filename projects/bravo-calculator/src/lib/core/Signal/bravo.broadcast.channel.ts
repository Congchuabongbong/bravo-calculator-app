import { Event, EventArgs } from '@grapecity/wijmo';

export class BravoBroadcastChannel {
    private _broadCast!: BroadcastChannel;

    private _zChannelName: string;

    public get channelName(): string {
        return this._zChannelName;
    }

    public onDataChanged = new Event<BravoBroadcastChannel,BroadCastEventArgs>();

    constructor(pzChannelName: string, pbUsingBroadCastChannel: boolean = true) {
        if ('BroadcastChannel' in self && pbUsingBroadCastChannel) {
            this._broadCast = new BroadcastChannel(pzChannelName);
            this._broadCast.onmessage = this.broadCastChanged.bind(this);
        }
        else {
            window.removeEventListener('storage', this._bindHandleStorage);
            window.addEventListener('storage', this._bindHandleStorage);
        }

        this._zChannelName = pzChannelName;
    }

    public dispose() {
        if (this._broadCast) {
            this._broadCast.close();
            this._broadCast && this._broadCast.close();
        }
        else {
            window.removeEventListener('storage', this._bindHandleStorage);
        }

        if (this.onDataChanged)
            this.onDataChanged.removeAllHandlers();
    }

    public postMessage(pzMessage: any) {
        if (this._broadCast) {
            this._broadCast.postMessage(pzMessage);
        }
        else {
            localStorage.setItem(this.channelName, pzMessage);
            localStorage.removeItem(this.channelName);
        }
    }

    private broadCastChanged(e: MessageEvent) {
        if (e.data && e.data.windowGuid == window.name)
            return;

        const _e = new BroadCastEventArgs(e.data);
        this.onDataChanged.raise(this, _e);
    }

    private _bindHandleStorage = this.window_storage.bind(this);

    private window_storage(e: StorageEvent) {
        if (e.storageArea != localStorage || this._isStringNullOrEmpty(e.key) || this._isStringNullOrEmpty(this.channelName))
            return;

        if (e.newValue == null)
            return;

        const _e = new BroadCastEventArgs(e.newValue);

        this.onDataChanged.raise(this, _e);
    }

    private _isStringNullOrEmpty(val:any):boolean  {
        return val == null || val === "" || val === void 0;
    }

}
export class BroadCastEventArgs extends EventArgs {
    public readonly data: any;

    constructor(data: any) {
        super();
        this.data = data;
    }
}
