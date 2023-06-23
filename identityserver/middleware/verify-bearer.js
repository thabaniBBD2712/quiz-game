import JSONWebtoken from 'jsonwebtoken';
import bearerToken from 'express-bearer-token';

async function verify(request, response, next){
    if(!request.token){
        //no token no pass
        return response.sendStatus(401);
    }
    const decoded = JSONWebtoken.decode(request.token, {complete: true});
    if(!decoded.header.kid){
        //no kid, no pass, we didn't generate this
        return response.sendStatus(401);
    }

    const store = request.app.locals.store;
    const keyInformation = await store.get(`jwt-key:${decoded.header.kid}`)
        .then(value => JSON.parse(value))
        .catch(() => undefined);

    if(!(keyInformation && keyInformation.algorithm && keyInformation.publicKey)){
        //no key information to comapare to
        return response.sendStatus(401);
    }

    const verified = await new Promise(
        resolve => JSONWebtoken.verify(
            request.token,
            keyInformation.publicKey,
            {
                algorithms: [
                    keyInformation.algorithm
                ]
            },
            (error, verified) => resolve(error ? undefined : verified)
        )
    );
    if(!verified){
        //not valid
        return response.sendStatus(401);
    }

    request.user = {
        id: verified.sub
    };
    next(undefined);
}

function handler(request, response, next){
    verify(request, response, next)
        .catch(next);
}

export default [
    bearerToken(),
    handler
];