import { ElectrumApiInterface } from '../api/electrum-api.interface';
import { CommandInterface } from './command.interface';
import { detectAddressTypeToScripthash } from '../utils/address-helpers';
import { Network } from 'bitcoinjs-lib';
import { NETWORK } from './command-helpers';

export class AddressHistoryCommand implements CommandInterface {
    constructor(
        private electrumApi: ElectrumApiInterface,
        private address: string,
        private network: Network = NETWORK
    ) {
    }

    async run(): Promise<any> {
        const { scripthash } = detectAddressTypeToScripthash(this.address, this.network);
        return {
            success: true,
            data: {
                address: this.address,
                scripthash: scripthash,
                history: await this.electrumApi.history(scripthash)
            }
        };
    }
}