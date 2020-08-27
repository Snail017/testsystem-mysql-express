import cryptoJs from 'crypto-js'

const key = '1241241sdadwafsd';
//des 加密
export const encryptDes = (message) => {
    message=String(message);
    var keyHex = cryptoJs.enc.Utf8.parse(key);
    var option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 }
    var encrypted = cryptoJs.DES.encrypt(message, keyHex, option)
    return encrypted.ciphertext.toString()
}
//des 解密
export const decryptDes = (message) => {
    message=String(message);
    var keyHex = cryptoJs.enc.Utf8.parse(key)
    var decrypted = cryptoJs.DES.decrypt(
        {
            ciphertext: cryptoJs.enc.Hex.parse(message)
        },
        keyHex,
        {
            mode: cryptoJs.mode.ECB,
            padding: cryptoJs.pad.Pkcs7
        }
    )
    return decrypted.toString(cryptoJs.enc.Utf8)
}
