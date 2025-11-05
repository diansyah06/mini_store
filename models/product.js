import {sequelize, DataTypes} from "./model.js";

const Product = sequelize.define('tbl_products',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pictures:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      url:{
        type: DataTypes.STRING,
        allowNull: false,
      }
    });
export default Product;