import express from 'express';
import Product from './models/product.js';
import User from './models/user.js';
import comments from './models/comment.js';
import Cart from './models/cart.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import fs from 'fs';
import { Sequelize } from 'sequelize';

const app = express();

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(fileUpload());
app.set('view engine', 'ejs');

app.use(session({
  secret: "rahasia_super_aman",
  resave: false,
  saveUninitialized: false,
}));


app.get('/', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})



app.get('/tambah', (req, res) => {
  res.render('tambah', { user: req.session.tbl_users })
})


//Bagian user
let batas = false
app.post("/api/login", async (req, res) => {
  console.log("Data login diterima:", req.body);

  try {
    const result = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    });

    console.log("Hasil pencarian user:", result);

    if (result) {
      batas = true;
      req.session.tbl_users = result;
      return res.json({ status: 200, msg: "Login berhasil" });
    } else {
      batas = false;
      return res.status(401).json({ status: 401, msg: "Login gagal" });
    }
  } catch (err) {
    console.error("Login error detail:", err);
    return res.status(500).json({ status: 500, msg: "Server error", error: err });
  }
});


app.post('/api/email', (req, res) => {
  User.findOne({ where: { email: req.body.email } })
    .then((result) => {
      if (result) {
        res.status(200).json({ msg: "User found" })
      } else {
        res.status(401).json({ msg: "User not found" })
      }
    })
    .catch(err => {
      res.status(400).json({ msg: err })

    })
})

app.post('/api/username', (req, res) => {
  User.findOne({ where: { username: req.body.username } })
    .then((result) => {
      if (result) {
        res.status(200).json({ msg: "User found" })
      } else {
        res.status(401).json({ msg: "User not found" })
      }
    })
    .catch(err => {
      res.status(400).json({ msg: err })

    })
})

app.post('/api/register', (req, res) => {
  User.create({ name: req.body.name, username: req.body.username, password: req.body.password, email: req.body.email, avatar: "/profilPic/user.png" })
    .then((result) => {
      res.status(200).json({ msg: "Registrasi berhasil" })
    }).catch((err) => {
      res.status(400).json({ msg: "Fail", error: err })
    })
})


app.get('/profil', (req, res) => {
  Product.findAll({ where: { id_user: req.session.tbl_users['id'] } })
    .then((result) => {
      if (result) {
        res.render('profil', { products: result, user: req.session.tbl_users })
      }
    })
    .catch((err) => {
      res.status(400).json({ msg: err.message })
    })
})

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  batas = false
  res.redirect('/')
})

app.get('/edit/user', (req, res) => {
  User.findOne({ where: { id: req.session.tbl_users['id'] } })
    .then((result) => {
      if (result) {
        res.render('editUser', { user: req.session.tbl_users })
      }
    })
    .catch((err) => {
      res.status(400).json({ msg: err.message })
    })
})

app.put('/edit/user/:id', async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!user) return res.status(404).json({ msg: "User Not Found" })
  let url = '';
  if (req.files === null) {
    url = user.avatar
  } else {
    const file = req.files.avatar;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;

    const allowedType = ['.png', '.jpeg', '.jpg'];

    if (!allowedType.includes(ext.toLocaleLowerCase())) return res.status(401).json({ msg: 'invalid image' })
    if (fileSize > 5000000) return res.status(401).json({ msg: 'image must be less then 5MB ' });

    file.mv(`./public/profilPic/${fileName}`, (err) => {
      if (err) return res.status(400).json({ error: err });
    })
    url = `${req.protocol}://${req.get("host")}/profilPic/${fileName}`;
  }
  console.log('url :' + url)
  const name = req.body.name;
  try {
    await User.update({ name: name, username: req.body.username, password: req.body.password, email: req.body.email, avatar: url }, {
      where: {
        id: req.params.id
      }
    })
    req.session.destroy()
    res.status(200).json({ msg: "User updated successfully" })
  } catch (error) {
    console.log(error.message);
  }
})

//Bagian Product
let qty =
  app.get("/api/product", (req, res) => {
    if (batas == true) {
      Product.findAll().then((results) => {
        res.render('product', { product: results, user: req.session.tbl_users });
      });
    }
    else {
      res.json({ msg: "Login terlebih dahulu!!" })
    }
  })

app.get('/api/cart', (req, res) => {
  Cart.findAll({ where: { id_user: req.session.tbl_users['id'] } })
    .then((result) => {
      res.render('cart', { cart: result })
    })
})

app.post('/api/cart', (req, res) => {
  Cart.create({ id_product: req.body.id_product, id_user: req.session.tbl_users['id'], qty: req.body.qty, url: req.body.url, total: req.body.total })
    .then((result) => {
      res.status(200).json({ msg: result })
    })
    .catch((err) => {
      console.error(err)
    })
})

app.delete('/api/cart/:id', (req, res) => {
  Cart.destroy({ where: { id: req.params.id } })
    .then((result) => {
      res.status(200).json({ msg: 'qty berhasil dihapus' })
    })
    .catch((err) => {
      console.error(err)
    })
})

app.put('/api/cart/:id', (req, res) => {
  Cart.update({ qty: req.body.qty, total: req.body.total }, { where: { id: req.params.id } })
    .then((result) => {
      res.status(200).json({ msg: 'qty berhasil diubah' })
    })
    .catch((err) => {
      console.error(err)
    })
})

app.get('/api/product/:id', (req, res) => {
  Product.findOne({ where: { id: req.params.id } })
    .then((result) => {
      res.render('main', { product: result, user: req.session.tbl_users })
    })
})

app.post("/api/product", async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: "There is no file to save" });
  const name = req.body.name;
  const file = req.files.pictures;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/image/${fileName}`;
  const allowedType = ['.png', '.jpeg', '.jpg'];
  if (!allowedType.includes(ext.toLocaleLowerCase())) return res.status(401).json({ msg: 'invalid image' })
  if (fileSize > 5000000) return res.status(401).json({ msg: 'image must be less then 5MB ' });

  file.mv(`./public/image/${fileName}`, async (err) => {
    if (err) return res.status(400).json({ error: err });
    try {
      await Product.create({ name: name, description: req.body.description, price: req.body.price, pictures: fileName, id_user: req.session.tbl_users['id'], url: url })
      res.status(200).json({ msg: "Product Created Succesfully", u: url })
    } catch (error) {
      console.log(error);
    }
  })
})


app.delete('/api/product/:id', async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!product) return res.status(404).json({ msg: "Product Not Found" })

  try {
    const filepath = `./public/image/${product.pictures}`;
    fs.unlinkSync(filepath);
    await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json({ msg: "Product deleted" })
  } catch (error) {
    console.log(error.message);
  }
})

app.get('/edit/:id', (req, res) => {
  Product.findOne({ where: { id: req.params.id } }
  ).then((results) => {
    res.render('edit', { product: results });
  })
})

app.put('/api/product/:id', async (req, res) => {
  const product = await Product.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!product) return res.status(404).json({ msg: "Product Not Found" })
  let fileName = '';
  let url = '';
  if (req.files === null) {
    fileName = product.name;
    url = product.url
  } else {
    const file = req.files.pictures;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpeg', '.jpg'];

    if (!allowedType.includes(ext.toLocaleLowerCase())) return res.status(401).json({ msg: 'invalid image' })
    if (fileSize > 5000000) return res.status(401).json({ msg: 'image must be less then 5MB ' });

    const filepath = `./public/image/${product.pictures}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/image/${fileName}`, (err) => {
      if (err) return res.status(400).json({ error: err });
    })
  }
  console.log('filename : ' + fileName);
  console.log('url :' + url)
  const name = req.body.name;
  try {
    await Product.update({ name: name, description: req.body.description, price: req.body.price, pictures: fileName, url: url }, {
      where: {
        id: req.params.id
      }
    })
    res.status(200).json({ msg: "Product updated successfully" })
  } catch (error) {
    console.log(error.message);
  }
})


const PORT = process.env.PORT || 300;
app.listen(PORT, () => {
  console.log(`Server run at http://localhost:${PORT}`)
});
