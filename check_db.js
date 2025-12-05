// --- Script para Teste de Conexão com o Banco de Dados ---

// Importa os módulos necessários
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Função assíncrona para encapsular a lógica de teste
async function testDbConnection() {
  let connection;
  try {
    // Tenta criar uma conexão com o banco de dados
    connection = await createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Se a conexão for bem-sucedida, exibe uma mensagem de sucesso
    console.log(`✅ Conexão com o banco de dados '${process.env.DB_DATABASE}' estabelecida com sucesso!`);

  } catch (error) {
    // Se ocorrer um erro, exibe a mensagem de erro detalhada
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
  } finally {
    // Garante que a conexão seja fechada, se tiver sido aberta
    if (connection) {
      await connection.end();
    }
  }
}

// Executa a função de teste
testDbConnection();
