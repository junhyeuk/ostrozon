import { NextApiRequest, NextApiResponse } from 'next';
import { mockNewsData, mockStationData } from '../../utils/mockData';

export default function handler(req, res) {
  const { type, filter, sort } = req.query;
  
  let data = [];
  
  // 타입에 따라 데이터 필터링
  if (type === 'news') {
    data = [...mockNewsData];
  } else if (type === 'station') {
    data = [...mockStationData];
  } else {
    // 기본적으로 모든 데이터를 합침
    data = [...mockNewsData, ...mockStationData];
  }
  
  // 필터 적용
  if (filter) {
    data = data.filter(item => {
      // 필터 로직 구현 (예: 카테고리, 태그 등)
      return true; // 임시 플레이스홀더
    });
  }
  
  // 정렬 적용
  if (sort) {
    data = data.sort((a, b) => {
      // 정렬 로직 구현 (예: 날짜, 좋아요 수 등)
      return 0; // 임시 플레이스홀더
    });
  }
  
  res.status(200).json(data);
}
