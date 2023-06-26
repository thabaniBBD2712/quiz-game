import express from 'express';
import argon from 'argon2';
import UUID from 'pure-uuid';


async function handleRegister(request, response){
    if(typeof request.body.username !== 'string' || request.body.username.length < 1){
        return response.sendStatus(400);
    }

    if(typeof request.body.password !== 'string' || request.body.password.length < 8){
        return response.sendStatus(400);
    }

    //register
    const hash = await argon.hash(request.body.password);
    const username = request.body.username.trim();
    const lowerCaseUsername = username.toLowerCase();
    const credentialsKey = `credentials:${lowerCaseUsername}`;

    const store = request.app.locals.store;

    if(await store.get(credentialsKey).catch(() => undefined)){
        return response.sendStatus(409); //already exisits
    }

    const uuid = new UUID(4).format();
    const identity = {
        id: uuid,
        primaryUsername: username
    };

    //store identity
    await store.put(`identity:${uuid}`, JSON.stringify(identity));
    //store new credentials (our own database)
    await store.put(credentialsKey, {
        hash: hash,
        identity: uuid
    },{valueEncoding: 'json'});

    //return 201, new id.

    return response.status(201).json({
        id: uuid
    });

}

function handleRegisterRoute(request, response, next){
    if(!request.body){
        return response.sendStatus(400);
    }
    //credential types
    switch(request.body.type){
        case 'username-password': return handleRegister(request, response).catch(next);
        default: response.sendStatus(400);
    }
}

export default [
    //parse body as json
    express.json(), handleRegisterRoute
];