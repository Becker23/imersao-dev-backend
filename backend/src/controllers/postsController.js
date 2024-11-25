import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
  // Busca todos os posts no banco de dados
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON
  res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
  // Extrai os dados do novo post da requisição
  const novoPost = req.body;
  // Tenta criar o novo post no banco de dados
  try {
    const postCriado = await criarPost(novoPost);
    res.status(200).json(postCriado);
  } catch (erro) {
    // Caso ocorra um erro, registra no console e retorna um erro 500
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
  // Cria um novo objeto de post com a URL da imagem e descrição inicial
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };
  // Tenta criar o novo post no banco de dados
  try {
    const postCriado = await criarPost(novoPost);
    // Renomeia o arquivo da imagem para um nome único
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    fs.renameSync(req.file.path, imagemAtualizada);
    // Gera uma descrição para a imagem usando o serviço Gemini
    const descricao = await gerarDescricaoComGemini(fs.readFileSync(`uploads/${postCriado.insertedId}.png`));
    // Atualiza o post com a descrição gerada
    await atualizarPost(postCriado._id, { ...postCriado, descricao });
    res.status(200).json(postCriado);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}

// Função assíncrona para atualizar um post existente
export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;
  try {
    // Lê a imagem do disco
    const imagemBuffer = fs.readFileSync(`uploads/${id}.png`);
    // Gera uma descrição para a imagem usando o serviço Gemini
    const descricao = await gerarDescricaoComGemini(imagemBuffer);
    // Atualiza o post com a nova descrição e URL da imagem
    const post = {
      descricao: descricao,
      imgUrl: urlImagem,
      alt: req.body.alt
    };
    const postAtualizado = await atualizarPost(id, post);
    res.status(200).json(postAtualizado);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ "Erro": "Falha na requisição" });
  }
}