import axios from 'axios';

// AI服务配置
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export interface AntiqueIdentification {
  type: string;
  confidence: number;
  description: string;
  characteristics: string[];
}

export interface AppraisalPoints {
  points: string[];
  searchResults: string[];
  detailedAnalysis: string;
}

export interface AntiqueAppraisal {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detailedAnalysis: string;
}

class AIService {
  /**
   * 使用VDU3.1视觉模型识别文玩类型
   */
  async identifyAntique(images: File[]): Promise<AntiqueIdentification> {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await apiClient.post('/api/vdu3.1/identify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('文玩识别失败:', error);
      throw new Error('文玩识别失败，请重试');
    }
  }

  /**
   * 使用DeepSeek文本模型搜索文玩鉴赏要点
   */
  async searchAppraisalPoints(antiqueType: string): Promise<AppraisalPoints> {
    try {
      const response = await apiClient.post('/api/deepseek/search-appraisal', {
        antiqueType,
        searchQuery: `${antiqueType} 鉴赏要点 收藏价值 真伪辨别`,
      });

      return response.data;
    } catch (error) {
      console.error('搜索鉴赏要点失败:', error);
      throw new Error('搜索鉴赏要点失败，请重试');
    }
  }

  /**
   * 使用VDU3.1模型进行文玩点评
   */
  async appraiseAntique(
    images: File[],
    antiqueType: string,
    appraisalPoints: AppraisalPoints
  ): Promise<AntiqueAppraisal> {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      formData.append('antiqueType', antiqueType);
      formData.append('appraisalPoints', JSON.stringify(appraisalPoints));

      const response = await apiClient.post('/api/vdu3.1/appraise', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('文玩点评失败:', error);
      throw new Error('文玩点评失败，请重试');
    }
  }

  /**
   * 获取处理状态
   */
  async getProcessingStatus(taskId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    result?: any;
    error?: string;
  }> {
    try {
      const response = await apiClient.get(`/api/status/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('获取处理状态失败:', error);
      throw new Error('获取处理状态失败');
    }
  }
}

export default new AIService();
