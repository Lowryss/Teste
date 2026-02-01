// Script de teste para verificar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 VERIFICANDO VARIÁVEIS DE AMBIENTE\n');
console.log('='.repeat(60));

// Firebase
console.log('\n📱 FIREBASE CONFIG:');
const firebaseVars = {
    'API Key': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    'Auth Domain': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    'Project ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'Storage Bucket': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    'Messaging Sender ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    'App ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

Object.entries(firebaseVars).forEach(([key, value]) => {
    console.log(`  ${value ? '✅' : '❌'} ${key}: ${value ? 'Configurado' : 'FALTANDO'}`);
});

// Stripe
console.log('\n💳 STRIPE CONFIG:');
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log(`  ${stripeKey ? '✅' : '❌'} Publishable Key: ${stripeKey ? 'Configurado' : 'FALTANDO'}`);
if (stripeKey) {
    const mode = stripeKey.startsWith('pk_test_') ? '🧪 TEST MODE' :
        stripeKey.startsWith('pk_live_') ? '🔴 LIVE MODE' :
            '⚠️ DESCONHECIDO';
    console.log(`     → Modo: ${mode}`);
    console.log(`     → Prefixo: ${stripeKey.substring(0, 15)}...`);
}

// App
console.log('\n🌐 APP CONFIG:');
console.log(`  ✅ App URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`);

console.log('\n' + '='.repeat(60));

// Verificação final
const allConfigured = Object.values(firebaseVars).every(v => v) && stripeKey;
if (allConfigured) {
    console.log('\n✅ SUCESSO! Todas as variáveis estão configuradas corretamente!\n');
    console.log('🚀 Você está pronto para iniciar o desenvolvimento!\n');
} else {
    console.log('\n❌ ATENÇÃO! Algumas variáveis estão faltando.\n');
    process.exit(1);
}
