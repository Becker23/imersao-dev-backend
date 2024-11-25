import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função para buscar todos os posts
export async function getTodosPosts(){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}

// Função para criar um novo post
export async function criarPost(novoPost){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(novoPost);
}

// Função para buscar um post pelo ID
export async function atualizarPost(id, novoPost){
    const objID = ObjectId.createFromHexString(id);
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost});
}