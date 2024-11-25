import express from "express";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
import multer from "multer";
import cors from "cors";

// Permite requisições de http://localhost:8000
const corsOptions = { origin: "http://localhost:8000" };

// Configura o armazenamento de arquivos enviados
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});

// Cria um middleware para lidar com uploads de arquivos
const upload = multer({ storage });

// Define as rotas da aplicação
const routes = (app) => {
  app.use(express.json()); // Permite receber dados JSON
  app.use(cors(corsOptions)); // Habilita CORS

  // Rotas para posts
  app.get("/posts", listarPosts); // Busca todos os posts
  app.post("/posts", postarNovoPost); // Cria um novo post
  app.post("/upload", upload.single("imagem"), uploadImagem); // Faz upload de imagem
  app.put("/upload/:id", atualizarNovoPost); // Atualiza um post
};

export default routes;