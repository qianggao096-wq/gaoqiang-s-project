import React, { useState } from 'react';
import { Layout, Card, Button, Steps, message, Space, Typography, Spin } from 'antd';
import { CameraOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import aiService, { AntiqueIdentification, AppraisalPoints, AntiqueAppraisal } from './services/aiService';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AppContainer = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const StyledHeader = styled(Header)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const MainCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StepContainer = styled.div`
  margin: 24px 0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px;
`;

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [identification, setIdentification] = useState<AntiqueIdentification | undefined>();
  const [appraisalPoints, setAppraisalPoints] = useState<AppraisalPoints | undefined>();
  const [appraisal, setAppraisal] = useState<AntiqueAppraisal | undefined>();
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: '上传图片',
      description: '上传文玩照片',
      icon: <CameraOutlined />,
    },
    {
      title: 'AI识别',
      description: '识别文玩类型',
      icon: <SearchOutlined />,
    },
    {
      title: '获取结果',
      description: '查看鉴赏结果',
      icon: <FileTextOutlined />,
    },
  ];

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
    if (newImages.length > 0) {
      setCurrentStep(1);
    }
  };

  const handleStartAnalysis = async () => {
    if (images.length === 0) {
      message.warning('请先上传文玩图片');
      return;
    }

    setLoading(true);
    setCurrentStep(2);

    try {
      // 步骤1: 文玩识别
      message.loading('正在识别文玩类型...', 0);
      const identificationResult = await aiService.identifyAntique(images);
      setIdentification(identificationResult);
      message.destroy();
      message.success('文玩识别完成');

      // 步骤2: 搜索鉴赏要点
      message.loading('正在搜索鉴赏要点...', 0);
      const appraisalPointsResult = await aiService.searchAppraisalPoints(
        identificationResult.type
      );
      setAppraisalPoints(appraisalPointsResult);
      message.destroy();
      message.success('鉴赏要点分析完成');

      // 步骤3: 文玩点评
      message.loading('正在进行文玩点评...', 0);
      const appraisalResult = await aiService.appraiseAntique(
        images,
        identificationResult.type,
        appraisalPointsResult
      );
      setAppraisal(appraisalResult);
      message.destroy();
      message.success('文玩点评完成');

    } catch (error) {
      message.destroy();
      message.error(error instanceof Error ? error.message : '分析失败，请重试');
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setIdentification(undefined);
    setAppraisalPoints(undefined);
    setAppraisal(undefined);
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
              上传您的文玩照片
            </Title>
            <ImageUpload onImagesChange={handleImagesChange} maxFiles={5} />
            {images.length > 0 && (
              <ActionButtons>
                <Button type="primary" size="large" onClick={handleStartAnalysis}>
                  开始AI分析
                </Button>
              </ActionButtons>
            )}
          </div>
        );

      case 1:
        return (
          <div>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
              准备开始分析
            </Title>
            <Text style={{ display: 'block', textAlign: 'center', marginBottom: '24px' }}>
              已上传 {images.length} 张图片，点击下方按钮开始AI分析
            </Text>
            <ActionButtons>
              <Button size="large" onClick={() => setCurrentStep(0)}>
                重新上传
              </Button>
              <Button type="primary" size="large" onClick={handleStartAnalysis}>
                开始AI分析
              </Button>
            </ActionButtons>
          </div>
        );

      case 2:
        return (
          <div>
            {loading ? (
              <LoadingContainer>
                <Spin size="large" />
                <Title level={4} style={{ marginTop: '16px' }}>
                  AI正在分析您的文玩...
                </Title>
                <Text type="secondary">
                  这可能需要几分钟时间，请耐心等待
                </Text>
              </LoadingContainer>
            ) : (
              <div>
                <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
                  AI分析结果
                </Title>
                <ResultDisplay
                  identification={identification}
                  appraisalPoints={appraisalPoints}
                  appraisal={appraisal}
                />
                <ActionButtons>
                  <Button size="large" onClick={handleReset}>
                    重新分析
                  </Button>
                </ActionButtons>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppContainer>
      <StyledHeader>
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          🏺 AI文玩鉴赏器
        </Title>
      </StyledHeader>

      <StyledContent>
        <MainCard>
          <StepContainer>
            <Steps
              current={currentStep}
              items={steps}
              size="small"
            />
          </StepContainer>

          {renderStepContent()}
        </MainCard>
      </StyledContent>

      <Footer style={{ textAlign: 'center', background: 'transparent', color: 'white' }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          AI文玩鉴赏器 - 基于VDU3.1视觉模型和DeepSeek文本模型
        </Text>
      </Footer>
    </AppContainer>
  );
};

export default App;
