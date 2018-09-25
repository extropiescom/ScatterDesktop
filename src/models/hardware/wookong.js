const {remote} = window.require('electron');
const { GetAddress } = remote.getGlobal('services').EOSGetAddress;
const { EOSTXSign } = remote.getGlobal('services').EOSTXSign;

const cache = {};

export default class wookong {
    constructor(blockchain){
        console.log("wookong constructor");
        this.blockchain = blockchain;
        this.init();
        
    }

    static typeToInterface(blockchain){
        console.log("wookong typeToInterface");
        if(!cache.hasOwnProperty(blockchain)) cache[blockchain] = new wookong(blockchain);
        return cache[blockchain];
    };

    async init(){
        this.canConnect = async () => { 
            console.log("wookong canConnect");
            return true; 
        };
        this.getPublicKey = async () => {
            console.log("wookong getPublicKey");
            const res = await GetAddress([0, 2147483692, 2147483842, 2147483648, 0, 0]);
          
            console.log("res payload"+res.payload);
            return res.payload;
        };
        this.sign = async (publicKey, rawTxHex, abi) => {
            console.log("wookong sign");
            console.log('rawTxHex is:', JSON.stringify(rawTxHex));
            console.log('rawTxHex.buf is:', JSON.stringify(rawTxHex.buf));
            let res = {};
            try {
                res = await EOSTXSign(null, null, null, [0, 2147483692, 2147483842, 2147483648, 0, 0], rawTxHex.buf);
            } catch (error) {
                console.log('sign exception: ', error);
            }

            console.log("res payload" + res.payload);
            return res.payload;
        }
    }


}
/*
    static typeToInterface(){
        const url = 'http://raspberrypi.local:3000';
        return new ExternalWalletInterface({
            sign(publicKey, trx, abi){
            },
            getPublicKey(){ return Http.get(url).then(res => {
                if(!res) return null;
                return res.key
            })},
            async canConnect(){
                return true;
            }
        });
    };
}*/