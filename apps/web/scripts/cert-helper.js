const fs = require('fs');
const path = require('path');

// Usage: node scripts/cert-helper.js <path-to-p12-file>

const filePath = process.argv[2];

if (!filePath) {
    console.error('❌ Por favor, forneça o caminho do arquivo .p12');
    console.error('Exemplo: node scripts/cert-helper.js ./certificados/producao.p12');
    process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ Arquivo não encontrado: ${resolvedPath}`);
    process.exit(1);
}

try {
    const fileBuffer = fs.readFileSync(resolvedPath);
    const base64String = fileBuffer.toString('base64');

    console.log('\n✅ Certificado convertido com sucesso!');
    console.log('Copie e cole a string abaixo na variável EFI_CERTIFICATE_PEM na Vercel:\n');
    console.log(base64String);
    console.log('\n----------------------------------------\n');
} catch (error) {
    console.error('Erro ao ler arquivo:', error.message);
}
