import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    if (req.body.data) {
      console.log(Date.now(), req.body.data);
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: '400 - New user data missing', data: req.body });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
