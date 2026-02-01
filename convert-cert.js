const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const p12File = 'homologacao-872278-Guia do coração.p12';
const pemFile = 'efi_cert.pem';

console.log(`Convertendo ${p12File}...`);

try {
    // Tenta usar openssl via node exec se disponível, ou fallback para leitura binária (mas p12 é binário, precisa decodificar)
    // Na verdade, p12 requer crypto lib ou openssl. Vamos tentar openssl via comando node primeiro.

    // Opção mais segura: P12 para PEM usando comando de sistema via node, escapando espaços
    const cmd = `openssl pkcs12 -in "${p12File}" -out "${pemFile}" -nodes -passin pass:`;
    execSync(cmd);

    console.log('✅ Conversão concluída!');

    const content = fs.readFileSync(pemFile, 'utf8');
    // Formatar para .env (tudo em uma linha, substituindo quebras por \n literal)
    const envContent = content.replace(/\r\n/g, '\\n').replace(/\n/g, '\\n');

    console.log('\n 👇 COPIE O CONTEÚDO ABAIXO PARA O SEU .ENV (Var EFI_CERTIFICATE_PEM) 👇\n');
    console.log(envContent);
    console.log('\n 👆 ------------------------------------------------------------------ 👆\n');

    // Salvar num arquivo txt pra facilitar
    fs.writeFileSync('CONTEUDO_PARA_ENV.txt', envContent);
    console.log('Também salvo em CONTEUDO_PARA_ENV.txt');

} catch (error) {
    console.error('Erro ao converter:', error.message);
    console.log('Se falhou, é possível que o openssl não esteja instalado no PATH.');
}
