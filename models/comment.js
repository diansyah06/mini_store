import { sequelize, DataTypes } from "./model.js";

const comments = sequelize.define("tbl_cart",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_product:DataTypes.INTEGER,
    id_user:DataTypes.INTEGER,
    commet_text:DataTypes.STRING,
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
})


export default comments;