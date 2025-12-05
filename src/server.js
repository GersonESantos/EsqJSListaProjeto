// Importa os módulos necessários
import express from 'express';
import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// --- Configuração do Servidor Express ---
const app = express();
const port = process.env.PORT || 3000;

// --- Configuração da Conexão com o Banco de Dados ---
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware para servir arquivos estáticos (HTML, CSS, JS do cliente)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Rota da API para buscar usuários ---
app.get('/api/users', async (req, res) => {
  try {
    // Obtém uma conexão do pool
    const connection = await pool.getConnection();
    
    // Executa a query para buscar todos os usuários
    const [rows] = await connection.query('SELECT id, nome, email, cidade, estado, status FROM usuarios ORDER BY nome');
    
    // Libera a conexão de volta para o pool
    connection.release();
    
    // Retorna os usuários como JSON
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    // Retorna um erro 500 em caso de falha
    res.status(500).json({ error: 'Erro interno do servidor ao buscar usuários.' });
  }
});

// --- Rota principal para servir o arquivo HTML ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// --- Inicia o Servidor ---
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
