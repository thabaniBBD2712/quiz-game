import express from 'express';
import {db_config} from './dbconfig.js';
import mssql from 'mssql';

export async function getUser(userId){
    try{
        mssql.connect(db_config).then(pool => {
            return pool.request().input('input_parameter', mssql.VarChar, userId).query('select * from Player where playerID = @input_parameter')
        }).then(result =>{
            const user = result.recordsets[0];
            return user;
        }).catch(err => {console.log(err)})
    }
    catch(error){
        console.log(error);
    }
}

/*
export default[
    express.json(),
    getUser,
];*/