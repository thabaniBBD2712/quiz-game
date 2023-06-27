import express from 'express';
import argon from 'argon2';
import UUID from 'pure-uuid';
import { addUser, getUser } from '../config/dboperations.js';


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

    const store = request.app.locals.store;

     //check if username already exists
    if(await getUser(username).catch(() => undefined)){
        return response.sendStatus(409);
    }

    const uuid = new UUID(4).format();

    //Store credentials to our db
    addUser(uuid, username, hash);

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