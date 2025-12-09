import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { getBaseUrl } from './helpers/baseUrl.js';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
  return JSON.parse(open('./data/login.test.data.json'));
});

export let options = {
  vus: 3,
  iterations: 3,
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requisições abaixo de 2s
  },
}

export default function () {
      const user = users[__VU - 1];
      console.log(user);

      const email = user.email;
      const password = user.password;

      const url = `${getBaseUrl()}/users/login`;
      const payload = JSON.stringify({ email, password });
      const params = { headers: { 'Content-Type': 'application/json' } };
      const res = http.post(url, payload, params);
      check(res, { 'login status 200': (r) => r.status === 200 });

      sleep(1);
}