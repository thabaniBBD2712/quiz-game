import {db_config} from './dbconfig.js';
import mssql from 'mssql';

export async function getUser(userId){
        try{
            let pool = await mssql.connect(db_config);
            let player = await pool.request().input('input_parameter', mssql.VarChar, userId).query('select * from Player where username = @input_parameter');
            return player.recordset[0];
        }catch(error){
            console.log(error);
        }
}

export async function addUser(userId, username, playerPassword){
        mssql.connect(db_config).then(pool => {
            return pool.request().input('playerId', mssql.VarChar, userId)
                                 .input('username', mssql.VarChar, username)
                                 .input('playerPassword', mssql.VarChar, playerPassword)
                                 .execute('InsertPlayer');
        }).then(result =>{
           return result.recordsets;
        }).catch(err => {console.log(err)})
}

