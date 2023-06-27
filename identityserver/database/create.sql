USE master;
GO

IF EXISTS(select * from sys.databases where name='identitydb')
DROP DATABASE identitydb;

CREATE DATABASE identitydb;
GO

USE identitydb;
GO

CREATE TABLE Player (playerID varchar(100), username varchar(50), playerPassword varchar(240));

CREATE procedure InsertPlayer   
(  
@playerId varchar(100),  
@username varchar(50),  
@playerPassword varchar(240)    
)  
AS  
BEGIN  
insert into Player (playerID,username,playerPassword) values( @playerId, @username, @playerPassword)  
END  