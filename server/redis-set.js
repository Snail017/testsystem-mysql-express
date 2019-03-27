const redis = require('redis')

var client = redis.createClient(6379, '127.0.0.1')
client.on('error', function (err) {
    console.log('Error ' + err);
});

var private='-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOEPbjMW0rlokiP5Cdl2mLXXN3\n' +
    'U3VIFSCVvwHsIb4vwx8f92/R6eFVYV/t9SlGBXw8N3mABGrCRjoz4eDIOGDPt6WU\n' +
    'mDY5/bMHD5hBYIVSbvzKwXeatyHxg1964ROSaE6M5J8f8zJRqOtRHvduDbhVrt+n\n' +
    'EdVhYgI+6JFaBmF49QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';

var public='-----BEGIN PUBLIC KEY-----\n' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOEPbjMW0rlokiP5Cdl2mLXXN3\n' +
    'U3VIFSCVvwHsIb4vwx8f92/R6eFVYV/t9SlGBXw8N3mABGrCRjoz4eDIOGDPt6WU\n' +
    'mDY5/bMHD5hBYIVSbvzKwXeatyHxg1964ROSaE6M5J8f8zJRqOtRHvduDbhVrt+n\n' +
    'EdVhYgI+6JFaBmF49QIDAQAB\n' +
    '-----END PUBLIC KEY-----\n';

client.set("private_key",private)
client.set("public_key",public)
