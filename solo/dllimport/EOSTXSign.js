const ref = require("ref");
const { DLLAPI, callback, CallbackParam, TYPE} = require("./dllfunction");
const { DLLRET, DLLDEVINFO, DLLCONST, DLLCOINTYPE, DLLDEVTYPE } = require("./dllconst");
const { PAEW_DevInfo } = require("./dllstruct");
const { DLLUTIL } = require("./dllutility");

const { DLLTYPE } = require("./dllstruct");
const { voidPP, uint32Array, ucharArray } = TYPE;
//const { uint32Array } = DLLTYPE;

//const voidPP = ref.refType(ref.refType(ref.types.void));

let {
    PAEW_InitContextWithDevName,
    PAEW_InitContext,
    PAEW_FreeContext,
    PAEW_GetDevInfo,
    PAEW_DeriveTradeAddress,
    PAEW_GetTradeAddress,
    PAEW_EOS_TXSign
} = DLLAPI;

const EOSTXSign = async (
    szDevName,
    callbackFunc,
    callbackParam,
    derivePath,
    txData
) => {
    let ppPAEWContext = ref.alloc(voidPP);
    let pnDevCount = ref.alloc("size_t");
    let pDevInfo = ref.alloc(PAEW_DevInfo);
    let devInfo = pDevInfo.deref();

    let puiDerivePath = uint32Array(derivePath);
    let nDerivePathLen = derivePath.length;

    let pbTradeAddress = new Buffer(DLLCONST.PAEW_COIN_ADDRESS_MAX_LEN);
    let pnTradeAddressLen = ref.alloc("size_t", DLLCONST.PAEW_COIN_ADDRESS_MAX_LEN);

    let pbCurrentTX = txData;
    let nCurrentTXLen = pbCurrentTX.length;
    let pbTXSig = new Buffer(DLLCONST.PAEW_EOS_SIG_MAX_LEN);
    let pnTXSigLen = ref.alloc("size_t", DLLCONST.PAEW_EOS_SIG_MAX_LEN);
    let res = 0;
    callbackFunc = null;//callback;
    callbackParam = new CallbackParam();

    try {
        if (szDevName != undefined && szDevName != '' ) {
            console.log('step 0.1------');
            res = await new Promise((resolve, reject) => {
                PAEW_InitContextWithDevName.async(
                    ppPAEWContext,
                    szDevName,
                    DLLDEVTYPE.PAEW_DEV_TYPE_HID,
                    callbackFunc,
                    callbackParam.ref(),
                    (err, res) => {
                        if (res == DLLRET.PAEW_RET_SUCCESS) {
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    }
                );
            });
        } else {
            console.log('step 0.2------');
            res = await new Promise((resolve, reject) => {
                PAEW_InitContext.async(
                    ppPAEWContext,
                    pnDevCount,
                    callbackFunc,
                    callbackParam.ref(),
                    (err, res) => {
                        if (res == DLLRET.PAEW_RET_SUCCESS) {
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    }
                );
            });
        }
        console.log(`step 1------, res is ${res}`);
        res = await new Promise((resolve, reject) => {
            PAEW_GetDevInfo.async(
                ppPAEWContext.deref(),
                0,
                DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_PIN_STATE +
                    DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_COS_TYPE +
                    DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_CHAIN_TYPE +
                    DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_SN +
                    DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_COS_VERSION +
                    DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_LIFECYCLE,
                pDevInfo,
                (err, res) => {
                    if (res == DLLRET.PAEW_RET_SUCCESS) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }
            );
        });

        console.log(`step 2------, res is ${res}`);
        console.log('ppPAEWContext.deref() is: ', ppPAEWContext.deref());

        if (
            devInfo.ucCOSType ==
            DLLDEVINFO.COSTYPE.PAEW_DEV_INFO_COS_TYPE_DRAGONBALL
        ) {
            res = await new Promise((resolve, reject) => {
                PAEW_GetDevInfo.async(
                    ppPAEWContext.deref(),
                    0,
                    DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_PIN_STATE +
                        DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_COS_TYPE +
                        DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_CHAIN_TYPE +
                        DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_SN +
                        DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_COS_VERSION +
                        DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_LIFECYCLE +
                        DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_N_T +
                        DLLDEVINFO.TYPE.PAEW_DEV_INFOTYPE_SESSKEY_HASH,
                    pDevInfo,
                    (err, res) => {
                        if (res == DLLRET.PAEW_RET_SUCCESS) {
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    }
                );
            });
        }

        console.log(`step 3------, res is ${res}`);
        console.log('ppPAEWContext.deref() is: ', ppPAEWContext.deref());
        console.log('puiDerivePath is: ', puiDerivePath);
        console.log('nDerivePathLen is: ', nDerivePathLen);
        /*res = await new Promise((resolve, reject) => {
            PAEW_DeriveTradeAddress.async(
                ppPAEWContext.deref(),
                0,
                DLLCOINTYPE.PAEW_COIN_TYPE_EOS,
                puiDerivePath,
                nDerivePathLen,
                (err, res) => {
                    if (res == DLLRET.PAEW_RET_SUCCESS) {
                        console.log('res == DLLRET.PAEW_RET_SUCCESS');
                        resolve(res);
                    } else {
                        console.log(`res is: ${res}`);
                        reject(res);
                    }
                }
            );
        });*/
        res = await PAEW_DeriveTradeAddress(ppPAEWContext.deref(), 0, DLLCOINTYPE.PAEW_COIN_TYPE_EOS, puiDerivePath, nDerivePathLen);

        console.log(`step 4------, res is ${res}`);
        /*res = await new Promise((resolve, reject) => {
            PAEW_GetTradeAddress.async(
                ppPAEWContext.deref(),
                0,
                DLLCOINTYPE.PAEW_COIN_TYPE_EOS,
                pbTradeAddress,
                pnTradeAddressLen,
                (err, res) => {
                    if (res == DLLRET.PAEW_RET_SUCCESS) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }
            );
        });*/

        console.log('step 5------');
        res = await new Promise((resolve, reject) => {
            PAEW_EOS_TXSign.async(
                ppPAEWContext.deref(),
                0,
                pbCurrentTX,
                nCurrentTXLen,
                pbTXSig,
                pnTXSigLen,
                (err, res) => {
                    if (res == DLLRET.PAEW_RET_SUCCESS) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }
            );
        });

        console.log('step 6------');

        
    } catch (err) {
        throw { result: err, payload: null };
    } finally {
        res = await new Promise((resolve, reject) => {
            PAEW_FreeContext.async(ppPAEWContext.deref(), (err, res) => {
                if (res == DLLRET.PAEW_RET_SUCCESS) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        });
        console.log(`PAEW_FreeContext returns ${res}`);
    }

    return {
        result: res,
        payload: DLLUTIL.ewallet_chararray_to_string(
            pbTXSig,
            pnTXSigLen.deref() - 1
        )
    };
};

module.exports = { EOSTXSign };
