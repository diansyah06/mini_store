import { sequelize, DataTypes } from "./model.js";

const Cart = sequelize.define("tbl_carts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_product: DataTypes.INTEGER,
  id_user: DataTypes.INTEGER,
  qty: DataTypes.INTEGER,
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  url: DataTypes.STRING,
  total: DataTypes.INTEGER,

})


export default Cart;