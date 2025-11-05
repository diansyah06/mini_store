import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("mini_store","root","root",{
    host:"localhost",
    dialect:"mysql",
    port:3307
})

sequelize.authenticate()
    .then(()=>{
        console.log("Connected to mysql workbenche");
    })
    .catch(err=>{
        console.error('Unable connection')
        console.log(err);
    })

export {sequelize, DataTypes};