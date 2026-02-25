import React from 'react';
import { Card, Progress, Tag, List, Typography, Divider, Rate } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { AntiqueIdentification, AppraisalPoints, AntiqueAppraisal } from '../services/aiService';

const { Title, Text, Paragraph } = Typography;

const ResultContainer = styled.div`
  .result-section {
    margin-bottom: 24px;
  }
  
  .confidence-bar {
    margin: 8px 0;
  }
  
  .appraisal-points {
    .ant-list-item {
      padding: 8px 0;
    }
  }
  
  .score-display {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
    margin-bottom: 16px;
  }
  
  .strengths-list, .weaknesses-list {
    .ant-list-item {
      padding: 4px 0;
    }
  }
`;

interface ResultDisplayProps {
  identification?: AntiqueIdentification;
  appraisalPoints?: AppraisalPoints;
  appraisal?: AntiqueAppraisal;
  loading?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  identification,
  appraisalPoints,
  appraisal,
  loading = false
}) => {
  if (loading) {
    return (
      <Card title="AI分析中..." loading>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Progress type="circle" percent={75} />
          <p style={{ marginTop: '16px' }}>AI正在分析您的文玩，请稍候...</p>
        </div>
      </Card>
    );
  }

  return (
    <ResultContainer>
      {/* 文玩识别结果 */}
      {identification && (
        <Card title="文玩识别结果" className="result-section">
          <div style={{ marginBottom: '16px' }}>
            <Title level={3} style={{ color: '#1890ff' }}>
              {identification.type}
            </Title>
            <div className="confidence-bar">
              <Text>识别置信度: {identification.confidence}%</Text>
              <Progress 
                percent={identification.confidence} 
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>
          </div>
          
          <Paragraph>{identification.description}</Paragraph>
          
          <div>
            <Text strong>主要特征:</Text>
            <div style={{ marginTop: '8px' }}>
              {identification.characteristics.map((char, index) => (
                <Tag key={index} color="blue" style={{ margin: '4px' }}>
                  {char}
                </Tag>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* 鉴赏要点 */}
      {appraisalPoints && (
        <Card title="鉴赏要点分析" className="result-section">
          <List
            header={<Text strong>关键鉴赏点:</Text>}
            dataSource={appraisalPoints.points}
            renderItem={(point, index) => (
              <List.Item>
                <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                {point}
              </List.Item>
            )}
            className="appraisal-points"
          />
          
          <Divider />
          
          <div>
            <Text strong>详细分析:</Text>
            <Paragraph style={{ marginTop: '8px' }}>
              {appraisalPoints.detailedAnalysis}
            </Paragraph>
          </div>
        </Card>
      )}

      {/* 文玩点评结果 */}
      {appraisal && (
        <Card title="AI文玩点评" className="result-section">
          <div className="score-display">
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              综合评分
            </Title>
            <Rate 
              disabled 
              value={appraisal.overallScore / 20} 
              style={{ fontSize: '24px', margin: '8px 0' }}
            />
            <Text style={{ color: 'white', fontSize: '18px' }}>
              {appraisal.overallScore}/100
            </Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Title level={4} style={{ color: '#52c41a' }}>
                <CheckCircleOutlined /> 优点
              </Title>
              <List
                dataSource={appraisal.strengths}
                renderItem={(strength) => (
                  <List.Item>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    {strength}
                  </List.Item>
                )}
                className="strengths-list"
              />
            </div>

            <div>
              <Title level={4} style={{ color: '#ff4d4f' }}>
                <CloseCircleOutlined /> 不足
              </Title>
              <List
                dataSource={appraisal.weaknesses}
                renderItem={(weakness) => (
                  <List.Item>
                    <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />
                    {weakness}
                  </List.Item>
                )}
                className="weaknesses-list"
              />
            </div>
          </div>

          <Divider />

          <div>
            <Title level={4}>改进建议</Title>
            <List
              dataSource={appraisal.recommendations}
              renderItem={(recommendation, index) => (
                <List.Item>
                  <Text strong>{index + 1}.</Text> {recommendation}
                </List.Item>
              )}
            />
          </div>

          <Divider />

          <div>
            <Title level={4}>详细分析报告</Title>
            <Paragraph>{appraisal.detailedAnalysis}</Paragraph>
          </div>
        </Card>
      )}
    </ResultContainer>
  );
};

export default ResultDisplay;
