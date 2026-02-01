const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '.p12');

try {
    if (!fs.existsSync(filePath)) {
        console.error('Arquivo .p12 não encontrado na raiz!');
        process.exit(1);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64String = fileBuffer.toString('base64');

    fs.writeFileSync('CERTIFICADO_BASE64.txt', base64String);

    console.log('✅ SUCESSO! O código do certificado foi salvo no arquivo: CERTIFICADO_BASE64.txt');
    console.log('👉 Abra esse arquivo, copie TODO o conteúdo e cole na variável EFI_CERTIFICATE_PEM lá no Vercel.');

} catch (err) {
    console.error('Erro:', err);
}
