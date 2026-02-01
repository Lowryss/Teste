const admin = require('firebase-admin');

// Tenta carregar dotenv
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    console.log("Dotenv nao instalado, tentando ler process.env direto (se rodado via next)");
}

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY não encontrada no process.env');
    // Fallback: ler arquivo manual melhorado
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');

    // Regex magico para pegar o valor da chave mesmo com quebras ou aspas
    const match = envFile.match(/FIREBASE_SERVICE_ACCOUNT_KEY='(.+)'/s) || envFile.match(/FIREBASE_SERVICE_ACCOUNT_KEY="(.+)"/s);
    if (match) {
        try {
            const jsonStr = match[1].replace(/\r\n/g, '').replace(/\n/g, ''); // Remove quebras se tiver
            // O JSON.stringify que usamos antes escapou aspas duplas, entao o conteudo esta ok
            // Mas se tiver aspas escapadas \" vira ", o JSON.parse resolve
            const serviceAccount = JSON.parse(jsonStr);
            initFirebase(serviceAccount);
        } catch (err) {
            console.error("Erro parsing manual:", err);
            process.exit(1);
        }
    } else {
        console.error("Regex falhou em ler service account key.");
        process.exit(1);
    }
} else {
    initFirebase(JSON.parse(serviceAccountKey));
}

function initFirebase(serviceAccount) {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    runScript();
}

async function runScript() {
    const db = admin.firestore();
    console.log('Listando usuários e dando pontos...');

    try {
        const snapshot = await db.collection('users').get();

        if (snapshot.empty) {
            console.log('Nenhum usuário encontrado no Firestore.');
            console.log('DICA: Logue no app e complete o onboarding para criar o usuário.');
            return;
        }

        snapshot.forEach(doc => {
            console.log(`User: ${doc.id} | Pontos: ${doc.data().cosmicPoints}`);
        });

        // Dar pontos para o primeiro user
        const doc = snapshot.docs[0];
        console.log(`\nAdicionando 5000 pontos para ${doc.id}...`);

        await db.collection('users').doc(doc.id).update({
            cosmicPoints: admin.firestore.FieldValue.increment(5000)
        });

        console.log('✅ SUCESSO! 5000 Pontos adicionados!');

    } catch (error) {
        console.error("Erro script:", error);
    }
}
