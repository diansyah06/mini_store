import { sequelize, DataTypes } from "./model.js";

const User = sequelize.define("tbl_users",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:DataTypes.STRING,
    username:DataTypes.STRING,
    password:DataTypes.STRING,
    email:DataTypes.STRING,
    avatar:DataTypes.STRING,
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
})

sequelize.sync()
  .then(()=>{
    console.log("Model tersinkronisasi")
  })
  .catch(err=>{
    console.error("Error: " + err)
  })

export default User;