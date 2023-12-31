# QUIZ Game

## Description
The objective is to develop a quiz game software system that generates a unique game shortcode for users to share. The system will utilize a database, possibly hosted on AWS RDS, to store quiz data. User authentication will be handled by an external service. The game will consist of five questions with three options each, timed and limited to one attempt. Results will be displayed at the end. The system should allow for future iterations and prioritize user engagement with a "fail is fail" approach.

## Prerequisites
* node JS


## Developing
pending

### Initialising DB
1. Open your favourite SQL Server manager and connect to `(localdb)\MSSQLLocalDB` 
2. Run script `db\CreateStatement.sql` to create database and tables
3. Run script `db\InsertStatements.sql` to populate database with mock data

### Runnig the Identity Server
1. Navigate to the identityserver folder
2. Add a .env file that has this structure :
|![image](https://github.com/thabaniBBD2712/quiz-game/assets/122435419/e3de500f-6049-4028-9f4d-ee99bbeedb25)|
3. In your command line, run the command `yarn install`
4. In your command line, run the command `yarn run start_local`
   You should see this in your terminal `Identity server is running on port 'anyPortNumberNotBeingUsed' ...`
5. Navigate to the database folder, there is a `create.sql` file that you will need to run in Microsoft SQL Server

## Running
Pending

## Authors
* [Motheo Moiloa](https://github.com/thabaniBBD2712)
* [Oarabile Moima](https://github.com/thabaniBBD2712)
* [Thabani Nkonde](https://github.com/thabaniBBD2712)
