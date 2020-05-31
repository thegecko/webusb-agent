import * as NodeWS from 'ws';
import { USBAdapter } from 'webusb'

export class WSServer {
    protected ws!: NodeWS;
    protected adapter = new USBAdapter();

    constructor(port: number = 8080) {
        const wss = new NodeWS.Server({ port });

        wss.on('connection', ws => {
            this.ws = ws;
            this.ws.on('message', message => this.handleMessage(message));
        });
    }

    protected async handleMessage(message: NodeWS.Data) {
        const request = JSON.parse(message.toString());
        console.log(request);
        let result;

        switch(request.command) {
            case "listUSBDevices":
                result = await this.adapter.listUSBDevices.apply(this.adapter, request.data);
                break;
            case "open":
                result = await this.adapter.open.apply(this.adapter, request.data);
                break;
            case "close":
                result = await this.adapter.close.apply(this.adapter, request.data);
                break;
            case "selectConfiguration":
                result = await this.adapter.selectConfiguration.apply(this.adapter, request.data);
                break;
            case "claimInterface":
                result = await this.adapter.claimInterface.apply(this.adapter, request.data);
                break;
            case "releaseInterface":
                result = await this.adapter.releaseInterface.apply(this.adapter, request.data);
                break;
            case "selectAlternateInterface":
                result = await this.adapter.selectAlternateInterface.apply(this.adapter, request.data);
                break;
            case "controlTransferIn":
                result = await this.adapter.controlTransferIn.apply(this.adapter, request.data);
                break;
            case "controlTransferOut":
                result = await this.adapter.controlTransferOut.apply(this.adapter, request.data);
                break;
            case "clearHalt":
                result = await this.adapter.clearHalt.apply(this.adapter, request.data);
                break;
            case "transferIn":
                result = await this.adapter.transferIn.apply(this.adapter, request.data);
                break;
            case "transferOut":
                result = await this.adapter.transferOut.apply(this.adapter, request.data);
                break;
            case "isochronousTransferIn":
                result = await this.adapter.isochronousTransferIn.apply(this.adapter, request.data);
                break;
            case "isochronousTransferOut":
                result = await this.adapter.isochronousTransferOut.apply(this.adapter, request.data);
                break;
            case "reset":
                result = await this.adapter.reset.apply(this.adapter, request.data);
                break;
        }

        const response = {
            sequence: request.sequence,
            data: JSON.stringify(result)
        }
        console.log(response);
        this.ws.send(JSON.stringify(response));
    }
}
