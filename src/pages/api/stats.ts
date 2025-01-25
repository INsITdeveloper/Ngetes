import type { NextApiRequest, NextApiResponse } from 'next';
import { StatsManager } from '../../utils/stats';

export default function handler(
  req: NextApiRequest, // Parameter req digunakan
  res: NextApiResponse
) {
  const stats = StatsManager.getInstance();

  // Contoh penggunaan req
  const { method, query } = req;
  console.log('Request Method:', method);
  console.log('Query Parameters:', query);

  stats.incrementRequests();
  stats.addEndpoint('/api/textoins');
  stats.addVisitor(req.socket.remoteAddress || 'unknown');

  res.status(200).json({ message: 'Request processed successfully' });
}
