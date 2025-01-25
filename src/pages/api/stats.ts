import type { NextApiRequest, NextApiResponse } from 'next';
import { StatsManager } from '../../utils/stats';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stats = StatsManager.getInstance();
  res.status(200).json(stats.g
