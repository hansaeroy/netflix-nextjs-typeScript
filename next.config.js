/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@stripe/firestore-stripe-payments',
]); // 변환된 것을 보고 싶은 모듈을 전달하십시오
//3일차 1:23:00쯤 에러가 나서 이런 모듈을 사용하여 디버깅

module.exports = withTM({
  reactStrictMode: false,
  images: {
    domains: ['image.tmdb.org', 'rb.gy'],
  },
});
