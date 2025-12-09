import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { generateRandomEmail } from './helpers/email.js';
import { getBaseUrl } from './helpers/baseUrl.js';
import { login } from './helpers/login.js';
import faker from "k6/x/faker"

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições abaixo de 2s
  },
  stages: [
    { duration: '3s', target: 20 }, 
    { duration: '3s', target: 20 }, 
    { duration: '5s', target: 0 },  
  ],
};

const checkoutTrend = new Trend('checkout_duration');

export default function () {
  const email = generateRandomEmail();
  const password = faker.internet.password();
  const name = faker.person.firstName();
  let token;

  group('Registro de usuário', () => {
    const url = `${getBaseUrl()}/users/register`;
    const payload = JSON.stringify({ name, email, password });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);
    check(res, { 'register status 201': (r) => r.status === 201 });
    sleep(0.5);
  });

  group('Login do usuário', () => {
    token = login(email, password);
    check(token, { 'token exists': (t) => !!t });
    sleep(0.5);
  });

  group('Checkout', () => {
    const url = `${getBaseUrl()}/checkout`;
    const payload = JSON.stringify({
      items: [{ productId: 1, quantity: 10 }],
      freight: 10,
      paymentMethod: 'boleto',
      cardData: {
        number: '344354354354354',
        name: 'Fulano de Tal',
        expiry: '06/30',
        cvv: '234',
      },
    });
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const res = http.post(url, payload, params);
    checkoutTrend.add(res.timings.duration);
    check(res, { 'checkout status 200': (r) => r.status === 200 });
    sleep(0.5);
  });
}
