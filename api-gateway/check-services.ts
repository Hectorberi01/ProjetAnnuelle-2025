import axios from 'axios';
import { SERVICES } from './src/config/services.config';

const checkService = async (name: string, url: string) => {
  try {
    const res = await axios.get(url, { timeout: 3000 });
    console.log(`✅ [${name}] Réponse ${res.status} OK -> ${url}`);
  } catch (err: any) {
    if (err.code === 'ECONNREFUSED') {
      console.error(`❌ [${name}] Connexion refusée -> ${url}`);
    } else if (err.code === 'ETIMEDOUT') {
      console.error(`❌ [${name}] Timeout -> ${url}`);
    } else {
      console.error(`⚠️  [${name}] Erreur (${err.code || err.message}) -> ${url}`);
    }
  }
};

const main = async () => {
  console.log('\n🔍 Vérification de la connectivité des microservices:\n');
  for (const [name, url] of Object.entries(SERVICES)) {
    await checkService(name, url);
  }
  console.log('\n✅ Vérification terminée.\n');
};

main();
