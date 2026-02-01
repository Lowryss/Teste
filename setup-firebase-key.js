const fs = require('fs');
const path = require('path');

const keyFileName = 'guia-do-coracao-firebase-adminsdk-fbsvc-8615dcb556.json';
const envFile = path.join('apps', 'web', '.env.local');

try {
    const keyContent = fs.readFileSync(keyFileName, 'utf8');
    // Remove quebras de linha para ficar one-line no .env
    const minifiedKey = JSON.stringify(JSON.parse(keyContent));

    // Preparar string para o .env (com aspas simples pra evitar problemas com shell)
    const envVar = `\nFIREBASE_SERVICE_ACCOUNT_KEY='${minifiedKey}'\n`;

    // Append no arquivo .env.local
    fs.appendFileSync(envFile, envVar);

    console.log('✅ Chave adicionada ao .env.local com sucesso!');
    console.log('Reinicie o seu servidor Next.js para ter efeito.');

} catch (err) {
    console.error('Erro:', err.message);
}
