import express from 'express';
import { promises } from 'fs';
import veiculosRouter from '../routes/veiculos.js';
import winston from 'winston';

const readFile = promises.readFile;
const writeFile = promises.writeFile;

// Config do log
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'api-veiculos.log' }),
  ],
  format: combine(
    label({ label: 'api-veiculos' }), 
    timestamp(), 
    myFormat
  )
});

global.veiculosJson = 'veiculos.json';

// Config do server
const app = express();
const port = 3000;

app.use(express.json());
app.use('/veiculos', veiculosRouter);

app.listen(port, async () => {
  // Tenta ler o arquivo contendo os veículos, se não cria um
  try {
    await readFile(veiculosJson, 'utf8');
    logger.info('API Started!');
  } catch (err) {
    const initialJson = {
      nextId: 1,
      veiculos: [],
    };

    try {
      await writeFile(veiculosJson, JSON.stringify(initialJson));
    } catch (err) {
      logger.error(err);
    }
  }
});
