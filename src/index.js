// approach 2
// require('dotenv').config({path: "./env"}) // jo hamari home directory ha wahi env pari ha // it is correct but for code consistency we use import
import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';
dotenv.config({
    path: './env'
})
connectDB() // it will give a promise cus this is async func so we can use then catch
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is listening at http:localhost:${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.error('Local Error DB connection Failed' + err);
})

/*
// go in package.json and kaho ik experimenta feature use karnay do only if you are using import instead or require
"scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules /index.js"
},      just add   "-r dotenv/config --experimental-json-modules"
for experimental feature "--experimental-json-modules"

*/


/* // approach 1
import mongoose from "mongoose"
import { DB_NAME } from "./constants";
// index file ma kabhi kabar app file ko bhi initialize kar latay han jo express se banti ha
import express from 'express'
const app = express();


// function connectDB() {}
// connectDB();

;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // database connection ki next line ma apko kabhi kabar listners bhi dithtay ha
        // listners hotay han app kay pas
        app.on('error', (error)=>{
            console.log(error);
            throw error;
        })
        // isi file ka andar ab jab app se bat kar hi pa rahay ha to app.listen
        app.listen(process.env.PORT , ()=>{
            // console.log('App is listening on http://localhost:'+process.env.PORT);
            console.log(`App is listening on http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.error('ERR' + error);
        throw error;
    }
})() // IIFE jab bhi use kartay han to semi colon se start kartay han q k agar apki previous line par semicolon nahi laga to errors a sakti han
*/