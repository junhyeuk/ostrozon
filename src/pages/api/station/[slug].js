import { NextApiRequest, NextApiResponse } from 'next';
import { mockStationData } from '../../../utils/mockData';

export default function handler(req, res) {
  const { slug } = req.query;
  
  if (!slug) {
    return res.status(400).json({ error: 'Missing slug parameter' });
  }
  
  const station = mockStationData.find(item => item.slug === slug);
  
  if (!station) {
    return res.status(404).json({ error: 'Station not found' });
  }
  
  // 실제 애플리케이션에서는 여기서 조회수 증가 로직을 추가할 수 있습니다
  
  return res.status(200).json(station);
}
