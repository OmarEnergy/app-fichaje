import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

interface User {
  id: string;
  nombre: string;
  correo: string;
  password: string;
  rol: 'admin' | 'user';
}

const users: User[] = [
  {
    id: uuidv4(),
    nombre: 'Admin',
    correo: 'omar.prieto@odsenergy.es',
    password: bcrypt.hashSync('Micorreo1!', 10),
    rol: 'admin',
  },
];

const jwtSecret = process.env.JWT_SECRET || 'secret';

router.post(
  '/register',
  [
    body('nombre').isString().notEmpty(),
    body('correo').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { nombre, correo, password } = req.body;
    const existing = users.find(u => u.correo === correo);
    if (existing) {
      return res.status(400).json({ message: 'Correo en uso' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user: User = { id: uuidv4(), nombre, correo, password: hashed, rol: 'user' };
    users.push(user);
    res.status(201).json({ id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol });
  }
);

router.post(
  '/login',
  [body('correo').isEmail(), body('password').notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { correo, password } = req.body;
    const user = users.find(u => u.correo === correo);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, rol: user.rol }, jwtSecret, { expiresIn: '8h' });
    res.json({ token });
  }
);

export default router;
