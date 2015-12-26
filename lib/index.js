import 'babel-polyfill';
import Promise from 'bluebird';
Promise.config({
  warnings: process.env.NODE_ENV,
  longStackTraces: process.env.NODE_ENV,
  cancellation: true,
});
