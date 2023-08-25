var fs=require('fs')
var crypto= require('crypto')
signExample = (str) => {
    crypto.generateKeyPair('rsa', {
        modulusLength: 1024,
        publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
        },
        privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
        }
    }, (err, publicKey, privateKey) => {
        if(!fs.existsSync('security'))
        {
            fs.mkdirSync('security')
        }
        fs.writeFileSync('security/jwtRS256.key',privateKey)
        fs.writeFileSync('security/jwtRS256.key.pub',publicKey) 
    });
}
signExample('test')