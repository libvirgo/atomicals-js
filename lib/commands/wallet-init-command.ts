import {CommandResultInterface} from "./command-result.interface";
import {CommandInterface} from "./command.interface";
import {createPrimaryAndFundingImportedKeyPairs} from "../utils/create-key-pair";
import {jsonFileExists, jsonFileWriter} from "../utils/file-utils";
import * as fs from 'fs';


export class WalletInitCommand implements CommandInterface {
    constructor(private phrase: string | undefined, private path: string, private filepath: string, private filename: string, private n?: number, private needFile:boolean = true) {

    }

    walletPath = `${this.filepath}/${this.filename}`

    async run(): Promise<CommandResultInterface> {
        if (this.needFile) {
            if (await this.walletExists()) {
                throw "wallet.json exists, please remove it first to initialize another wallet. You may also use 'wallet-create' command to generate a new wallet."
            }
        }

        const {wallet, imported} = await createPrimaryAndFundingImportedKeyPairs(this.phrase, this.path, this.n);
        const created = {
            phrase: wallet.phrase,
            primary: {
                address: wallet.primary.address,
                path: wallet.primary.path,
                WIF: wallet.primary.WIF
            },
            funding: {
                address: wallet.funding.address,
                path: wallet.funding.path,
                WIF: wallet.funding.WIF
            },
            imported
        };
        if (this.needFile) {
            const walletDir = `${this.filepath}/`;
            if (!fs.existsSync(walletDir)) {
                fs.mkdirSync(walletDir);
            }
            await jsonFileWriter(this.walletPath, created);
        }
        return {
            success: true,
            data: created
        }
    }

    async walletExists() {
        if (await jsonFileExists(this.walletPath)) {
            return true;
        }
    }
}
