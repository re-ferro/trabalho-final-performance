# Conceitos usados e explicados

---

**Thresholds:** Aqui, o threshold garante que 95% das requisições HTTP devem ser concluídas em menos de 2 segundos. Exemplo em `login.test.js`:
```js
thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições abaixo de 2s
},
```

**Checks:** Checks validam se a resposta atende critérios, como status HTTP. Exemplo em `login.test.js`:
```js
check(res, { 'login status 200': (r) => r.status === 200 });
```

**Helpers:** Funções utilitárias para reaproveitar código, como login, baseUrl e geração de email. Exemplo em `login.test.js`
```js
import { getBaseUrl } from './helpers/baseUrl.js';
```

**Trends:** Métricas customizadas para monitorar valores ao longo do tempo. Exemplo em `checkout.test.js`
```js
const checkoutTrend = new Trend('checkout_duration');
// ...
checkoutTrend.add(res.timings.duration);
```

**Faker:** Geração de dados fictícios para testes. Exemplo em `checkout.test.js`:
```js
const email = generateRandomEmail();
const password = faker.internet.password();
const name = faker.person.firstName();
```

**Variável de Ambiente:** Permite configurar valores dinâmicos, como a URL base. Exemplo em `helpers/baseUrl.js`:
```js
export function getBaseUrl() {
  return __ENV.BASE_URL || 'http://localhost:3001';
}
```

**Stages:** Define fases de carga no teste. Exemplo:
em `checkout.test.js`
```js
  stages: [
    { duration: '3s', target: 20 }, 
    { duration: '3s', target: 20 }, 
    { duration: '5s', target: 0 },  
  ],
```

**Reaproveitamento de Resposta:** Utiliza dados de uma resposta em requisições seguintes. Exemplo em `helpers/login.js`:
```js
const token = res.json('token') || res.json('data.token');
return token;
```

**Uso de Token de Autenticação:** Utiliza o token JWT para autenticar requisições. Exemplo em `helpers/login.js`:
```js
const token = res.json('token') || res.json('data.token');
return token;
```

**Data-Driven Testing:** Testes baseados em dados externos, como arquivos JSON. Exemplo em `login.test.js`:
```js
const users = new SharedArray('users', function () {
  return JSON.parse(open('./data/login.test.data.json'));
});
```

**Groups:** Agrupamento de etapas do teste para melhor organização. Exemplo em `checkout.test.js`:
```js
group('Registro de usuário', () => { ... });
```