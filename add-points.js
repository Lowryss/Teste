const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Carregar credenciais
const envPath = path.join('apps', 'web', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Gambiarra pra ler o ENV na mão sem dotenv
const serviceAccountLine = envContent.split('\n').find(line => line.startsWith('FIREBASE_SERVICE_ACCOUNT_KEY='));
let serviceAccount;

if (serviceAccountLine) {
    let jsonStr = serviceAccountLine.split('=')[1];
    // Remove aspas simples envolta se tiver
    if (jsonStr.startsWith("'") && jsonStr.endsWith("'")) {
        jsonStr = jsonStr.slice(1, -1);
    }
    serviceAccount = JSON.parse(jsonStr);
} else {
    console.error('Chave de serviço não encontrada no .env.local');
    process.exit(1);
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function listUsersAndAddPoints() {
    console.log('Listando usuários...');
    const snapshot = await db.collection('users').get();

    if (snapshot.empty) {
        console.log('Nenhum usuário encontrado.');
        return;
    }

    snapshot.forEach(doc => {
        console.log(`User: ${doc.id} => ${JSON.stringify(doc.data().profile?.name || 'Sem nome')} | Pontos: ${doc.data().cosmicPoints}`);
    });

    // Se tiver apenas 1 usuário, vamos dar pontos pra ele
    if (snapshot.size === 1) {
        const doc = snapshot.docs[0];
        console.log(`Adicionando 100 pontos para ${doc.id}...`);
        await db.collection('users').doc(doc.id).update({
            cosmicPoints: admin.firestore.FieldValue.increment(100)
        });
        console.log('Pontos adicionados com sucesso! 💎');
    } else {
        console.log('Mais de 1 usuário encontrado. Edite o script para escolher o ID específico.');
    }
}

listUsersAndAddPoints();
