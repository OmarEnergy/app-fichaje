import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { Parser } from 'json2csv';

const router = Router();

interface Fichaje {
  id: string;
  userId: string;
  tipo: 'entrada' | 'pausa-inicio' | 'pausa-fin' | 'salida';
  timestamp: number;
  latitud: number;
  longitud: number;
}

const fichajes: Fichaje[] = [];

router.post(
  '/',
  authenticate,
  [
    body('tipo').isIn(['entrada', 'pausa-inicio', 'pausa-fin', 'salida']),
    body('latitud').isFloat(),
    body('longitud').isFloat(),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { tipo, latitud, longitud } = req.body;
    const fichaje: Fichaje = {
      id: uuidv4(),
      userId: req.user!.id,
      tipo,
      timestamp: Date.now(),
      latitud,
      longitud,
    };
    fichajes.push(fichaje);
    res.status(201).json(fichaje);
  }
);

router.get('/', authenticate, (req: Request, res: Response) => {
  if (req.user!.rol === 'admin') {
    return res.json(fichajes);
  }
  res.json(fichajes.filter(f => f.userId === req.user!.id));
});

router.get('/export', authenticate, authorizeAdmin, (req: Request, res: Response) => {
  const parser = new Parser();
  const csv = parser.parse(fichajes);
  res.header('Content-Type', 'text/csv');
  res.attachment('fichajes.csv');
  res.send(csv);
});

export default router;
