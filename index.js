import express from "express";
import mysql from "mysql";
import cors from "cors";
import fs from 'fs';
import multer from 'multer';
import { extname, join } from 'path';
import { configDotenv } from "dotenv";


const app = express()

const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})
const port=process.env.PORT || 8800

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
    res.json("hello this is the backend")
})

app.get("/movies", (req,res)=>{
    const q ="SELECT * FROM listafilmes"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.get("/cadastro", (req,res)=>{
    const q ="SELECT * FROM usuario"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})


const storage = multer.diskStorage({
    destination: function(req,file,callback){
                   const path = "./pictures";
                   callback(null, path);
         },
    filename: function(req,file,callback){
                  callback(null,`${file.originalname}`);
     }});

const upload = multer({ storage: storage});

app.post("/movies",upload.single('image'),(req,res)=>{

    upload.filename=req.file.originalname
    console.log(req.file.originalname)
    const q ="INSERT INTO listafilmes(TITULO,COVER,DATA_EXIBICAO,PRECO,DISPONIVEIS,DESCRICAO,GENERO) VALUES(?)"
    
    if (!req.file) {
        res.status(400).send('Nenhum arquivo foi enviado');
        return;
      }
    
      // O arquivo está disponível em req.file

   
    const file = req.file;
 
  // Caminho completo do arquivo

    const filePath = file.path;
        
    fs.readFile(filePath,(err, data) => {
    if (err) {
        console.error(err);
        res.status(500).send('Erro ao ler a imagem');
        return;
    }})

    // Move o arquivo para o destino desejado
    
    const value =[
        req.body.TITULO,
        req.body.COVER,
        req.body.DATA_EXIBICAO,
        req.body.PRECO,
        req.body.DISPONIVEIS,
        req.body.DESCRICAO,
        req.body.GENERO]

    db.query(q,[value],(err,data)=>{
        if(err) return res.json(err) 
        console.log("Movie adicionado com sucesso")
        return res.json("Movie adicionado com sucesso")
    })
})



app.get('/imagem/:nome', (req, res) => {
    const nomeImagem = req.params.nome;
    const imagePath = `./pictures/${nomeImagem}`;
  
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro ao ler a imagem');
        return;
      }
  
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': data.length
      });
  
      res.end(data);
    });
  });

  //para guardar

  
  



app.post("/cadastro",(req,res)=>{
    const q ="INSERT INTO usuario(NOME,EMAIL,PASSCODE,ADMIN_STATUS) VALUES(?)"
    const value =[req.body.nome, req.body.email, req.body.password,req.body.admin_status]
    const value1 =[req.body.nome]
    
    
    db.query(q,[value],(err,data)=>{
        if(err) {
            if(err.sqlMessage.includes("for key 'usuario.EMAIL'")){
                let errorMessage={"status":403,"errorMessage":err,"message":"email ja cadastrado"}
                return res.json( errorMessage)
            }else if(err.sqlMessage.includes("for key 'usuario.NOME'")){
                let errorMessage={"status":403,"errorMessage":err,"message":"nome ja existe"}
                return res.json( errorMessage)
            }else{
                return res.json(err)
            }
            
            
        }else{return res.json("USUARIO CADASTRADO")}
    })
})

app.get("/users",(req,res)=>{
    const query ="SELECT ID_USUARIO,NOME,EMAIL,PASSCODE FROM usuario"
    db.query(query,(err,data)=>{
        if(err) return res.json(err)
        console.log(data)
        return res.json(data)
    })
})

app.post("/cadastro_verificicar_nome",(req,res)=>{
    const query ="SELECT ID_USUARIO FROM usuario where NOME =?"
    console.log(req.body.nome)
    db.query(query,req.body.send.nome,(err,data)=>{
        if(err) return res.json(err)
        console.log(data)
        return res.json(data)
    })
})

app.post("/cadastro_verificicar_email",(req,res)=>{
    const query ="SELECT ID_USUARIO FROM usuario where EMAIL =(?)"
    console.log(req.body)
    console.log(req.body.send.email)
    db.query(query,req.body.send.email,(err,data)=>{
        if(err) return res.json(err)
        console.log(data)
        return res.json(data)
    })
})

app.post("/login_verefier",(req,res)=>{
    const query ="SELECT ID_USUARIO,NOME,PASSCODE,ADMIN_STATUS FROM usuario where NOME =(?)"
    console.log(req.body)
    console.log(req.body.NOME)
    db.query(query,req.body.nome,(err,data)=>{
        if(err) return res.json(err)
        console.log(data)
        return res.json(data)
    })
})

app.post("/comprar",(req,res)=>{
    const query ="INSERT INTO listabilhetes (CHAVE_CONFIRMACAO,DESCRICAO,ID_FILME,ID_USUARIO) VALUES (?)"
    const value=[req.body.CHAVE_CONFIRMACAO, req.body.DESCRICAO, req.body.ID_FILME, req.body.ID_USUARIO]
    console.log(value)
    const query2="UPDATE listafilmes SET DISPONIVEIS = DISPONIVEIS - (?) WHERE ID_FILMES=(?)"
    const values=[req.body.QUANTIDADE,req.body.ID_FILME]

    db.query(query,[value],(err,data)=>{
        if(err) return res.json(err)
        console.log(data)
        return res.json(data)
    })
    db.query(query2,[values],(err,data)=>{
        if(err) return res.json(err)
        console.log(data)
        return res.json(data)
    })
})



app.listen(8800,()=>{
    console.log("Conected to backend!")
})