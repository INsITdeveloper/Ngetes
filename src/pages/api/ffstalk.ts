import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
    const response = await axios.get(`https://api.example.com/ffstalk/${id}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch FF data' });
  }
}
