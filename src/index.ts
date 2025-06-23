import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import fichajeRoutes from './routes/fichajes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/fichajes', fichajeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
