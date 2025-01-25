import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { StatsManager } from '../../utils/stats';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const stats = StatsManager.getInstance();
  stats.incrementRequests();
  stats.addEndpoint('/api/textoins');
  stats.addVisitor(req.socket.remoteAddress || 'unknown');

  try {
    const deviceId = Array.from({length: 32}, () => 
      'abcdef0123456789'[Math.floor(Math.random() * 16)]
    ).join('');

    const createTaskResponse = await axios.post('https://api-preview.chatgot.io/api/v1/deepimg/flux-dev-lora', {
      device_id: deviceId,
      prompt: req.query.prompt || "A young man wearing a cool black hoodie in a cyperpunk style",
      n: "1",
      size: "1x1",
      output_format: "png"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://deepimg.ai',
        'Referer': 'https://deepimg.ai/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; CPH2043) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
      }
    });

    const taskId = createTaskResponse.data.data.task_id;
    let imageUrl = '';

    for (let i = 0; i < 10; i++) {
      const checkResponse = await axios.get('https://api-preview.chatgot.io/api/v1/images/query', {
        params: { task_id: taskId, model: 'flux-dev-lora', device_id: deviceId },
        headers: {
          'Origin': 'https://deepimg.ai',
          'Referer': 'https://deepimg.ai/'
        }
      });

      if (checkResponse.data.data.status === 'completed') {
        imageUrl = checkResponse.data.data.images[0].url;
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
    }

    if (!imageUrl) {
      throw new Error('Image generation timeout');
    }

    res.status(200).json({ url: imageUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
      }
