const redis = require('redis')
const client = redis.createClient(6379, '127.0.0.1')
const rds_pw='';
const private='-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOEPbjMW0rlokiP5Cdl2mLXXN3\n' +
    'U3VIFSCVvwHsIb4vwx8f92/R6eFVYV/t9SlGBXw8N3mABGrCRjoz4eDIOGDPt6WU\n' +
    'mDY5/bMHD5hBYIVSbvzKwXeatyHxg1964ROSaE6M5J8f8zJRqOtRHvduDbhVrt+n\n' +
    'EdVhYgI+6JFaBmF49QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';

const public='-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOEPbjMW0rlokiP5Cdl2mLXXN3\n' +
    'U3VIFSCVvwHsIb4vwx8f92/R6eFVYV/t9SlGBXw8N3mABGrCRjoz4eDIOGDPt6WU\n' +
    'mDY5/bMHD5hBYIVSbvzKwXeatyHxg1964ROSaE6M5J8f8zJRqOtRHvduDbhVrt+n\n' +
    'EdVhYgI+6JFaBmF49QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';
// client.auth(rds_pw,function () {
//     console.log("通过认证")
// })

client.on('error', function (err) {
    console.log('Error ' + err);
});

client.on("connect",function () {
    console.log("连接成功")
    client.set("private_key",private,redis.print)
    client.set("public_key",public,redis.print)
});


client.on('ready',function (res,red) {
    console.log("success.....")
});

