import express from 'express';
import { promises } from 'fs';

const readFile = promises.readFile;
const writeFile = promises.writeFile;
const router = express.Router();

// Criar veiculo
router.post('/', async (req, res) => {
  let veiculo = req.body;

  try {
    const json = JSON.parse(await readFile(veiculosJson));
    veiculo = { id: json.nextId++, ...veiculo };
    json.veiculos.push(veiculo);
    await writeFile(veiculosJson, JSON.stringify(json));

    res.status(201).send('post veiculo');
    logger.info(`POST /veiculo - ${JSON.stringify(veiculo)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(err);
  }
});

// Listar todos veículos
router.get('/', async (_, res) => {
  try {
    const json = JSON.parse(await readFile(veiculosJson));

    res.status(201).send(json.veiculos);
    logger.info(`GET /veiculo`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(err);
  }
});

// Listar veículo específico
router.get('/:id', async (req, res) => {
  try {
    const json = JSON.parse(await readFile(veiculosJson));
    const id = req.params.id;

    const veiculo = json.veiculos.find((veiculo) => veiculo.id == id);

    res.status(201).send(veiculo);
    logger.info(`GET /veiculo - ${JSON.stringify(veiculo)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(err);
  }
});

// Deletar veículo
router.delete('/:id', async (req, res) => {
  try {
    let json = JSON.parse(await readFile(veiculosJson));
    const id = req.params.id;

    json.veiculos = json.veiculos.filter((veiculo) => veiculo.id != id);
    await writeFile(veiculosJson, JSON.stringify(json));

    res.status(201).send('deleted veiculo');
    logger.info(`DELETE /veiculo/:id`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(err);
  }
});


// Atualizar veículo
router.put('/', async (req, res) => {
  const newveiculo = req.body;

  try {
    let json = JSON.parse(await readFile(veiculosJson));

    const oldIndex = json.veiculos.findIndex(
      (veiculo) => veiculo.id === newveiculo.id
    );
    json.veiculos[oldIndex] = newveiculo;
    await writeFile(veiculosJson, JSON.stringify(json));

    res.status(201).send('put veiculo');
    logger.info(`PUT /veiculo - ${JSON.stringify(newveiculo)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(err);
  }
});

export default router;
