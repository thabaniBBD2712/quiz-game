import express from 'express';
import argon, { hash } from 'argon2';
import crypto from 'crypto';
import JSONWebToken from 'jsonwebtoken';
import ms from 'ms';
//used to identify certificate
import UUID from 'pure-uuid';


async function getIdentity(request, response){
    if(typeof request.body.username !== 'string' || request.body.username.length < 1){
        return response.sendStatus(400);
    }

    if(typeof request.body.password !== 'string' || request.body.password.length < 1){
        return response.sendStatus(400);
    }

    //validation of password and return associated identity
    const store = request.app.locals.store;
    const username = request.body.username.trim();
    const lowerCaseUsername = username.toLowerCase();
    const credentialsKey = `credentials:${lowerCaseUsername}`;
    const passwordInformation = await store.get(credentialsKey).catch(() => undefined);
    

    let obj = JSON.parse(passwordInformation)

    if (!(passwordInformation && obj.hash && obj.identity)) {
        response.sendStatus(401);
     //handled
     return undefined;
   }

   const match = await argon.verify(obj.hash, request.body.password);
   if(!match){
    response.sendStatus(401);
    //handled
    return undefined;
   }
   return obj.identity;
}

async function getIdentityForCredentials(request, response){
    switch(request.body.from){
        case 'username-password': return getIdentity(request, response);
        default: response.sendStatus(400);
    }
}

async function createKeyPair(){
    //create key pair using jsonwebtoken
    return new Promise(
        (resolve, reject) => crypto.generateKeyPair(
            'rsa',
            {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding:{
                    type: 'pkcs8',
                    format: 'pem'
                }
            },
            (error, publicKey, privateKey) => error? reject(error) : resolve({publicKey, privateKey})
        )
    );
}

async function generateBearerToken(request, response, identity){
    const {publicKey, privateKey} = await createKeyPair();
    const expiryInMS = ms('2h');
    const expiresAtInMS = Date.now() + expiryInMS;
    const payload = {
        sub: identity,
        exp: Math.floor(expiresAtInMS / 1000)
    };

    const keyid = new UUID(4).format();
    const algorithm = 'RS256';
    const token = await new Promise(
        (resolve, reject) => JSONWebToken.sign(
            payload,
            privateKey,
            {
                algorithm,
                keyid
            },
            (error, token) => error ? reject(error) : resolve(token)
        )
    );

    console.log(token);
    const store = request.app.locals.store;
    //can be retrieved later for validation
    await store.put(`jwt-key:${keyid}`, {
        algorithm,
        publicKey
    }, {valueEncoding: 'json'});

    /*
    //mark value for expiry
    await new Promise(
        (resolve, reject) => request.app.locals.ttl.ttl(
            `jwt-key:${keyid}`,
            expiryInMS,
            (error) => error ? reject(error) : resolve()
        )
    );
    */

    response.json({
        token,
        tokenType: 'bearer',
        expiresAt: expiresAtInMS
    });
}

async function generateCredentials(request, response, identity){
    switch(request.body.to){
        case 'bearer': return generateBearerToken(request, response, identity);
        default: response.sendStatus(400);
    }
}

function handleExchangeCredentialsRoute(request, response, next){
    if(!request.body){
        return response.sendStatus(400);
    }
    getIdentityForCredentials(request, response)
        .then(identity => {
            if(!identity){
                //handled
                return;
            };
            return generateCredentials(request, response, identity);
        })
        .catch(next);
}

export default [
    express.json(),
    handleExchangeCredentialsRoute
];