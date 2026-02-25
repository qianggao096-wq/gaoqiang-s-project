import React, { useState } from 'react';
import { Layout, Card, Tabs, Input, Button, Space, Typography, Row, Col, Select } from 'antd';
import styled from 'styled-components';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const AppContainer = styled(Layout)`
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1e293b 0%, #020617 40%, #000 100%);
  color: #e5e7eb;
`;

const StyledHeader = styled(Header)`
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandTitle = styled(Title)`
  && {
    color: #e5e7eb;
    margin: 0;
    font-size: 22px;
  }
`;

const BrandSubTitle = styled(Text)`
  && {
    color: #9ca3af;
    font-size: 12px;
  }
`;

const StyledContent = styled(Content)`
  padding: 32px 16px 40px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
`;

const MainCard = styled(Card)`
  background: radial-gradient(circle at top left, #0b1120 0%, #020617 45%, #020617 100%);
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.9);
  overflow: hidden;
`;

const PanelTitle = styled(Title)`
  && {
    color: #e5e7eb;
    margin-bottom: 8px;
    font-size: 18px;
  }
`;

const PanelDesc = styled(Text)`
  && {
    color: #9ca3af;
    font-size: 13px;
  }
`;

const CalculatorDisplay = styled.div`
  background: radial-gradient(circle at top left, #020617 0%, #020617 70%, #020617 100%);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: 16px 18px;
  margin-bottom: 16px;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  min-height: 84px;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.7);
`;

const ExpressionText = styled.div`
  font-size: 13px;
  color: #6b7280;
  word-break: break-all;
`;

const ResultText = styled.div`
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const KeypadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
`;

const CalcButton = styled(Button)<{ $variant?: 'primary' | 'accent' | 'danger' | 'ghost' }>`
  && {
    height: 40px;
    border-radius: 999px;
    border-width: 0;
    font-weight: 500;
    font-size: 14px;
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.75);
    background: ${({ $variant }) =>
      $variant === 'primary'
        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
        : $variant === 'accent'
        ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
        : $variant === 'danger'
        ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
        : 'rgba(15, 23, 42, 0.95)'};
    color: ${({ $variant }) =>
      $variant === 'primary' || $variant === 'accent' || $variant === 'danger'
        ? '#f9fafb'
        : '#e5e7eb'};
    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.05);
      background: ${({ $variant }) =>
        $variant === 'primary'
          ? 'linear-gradient(135deg, #22c55e, #16a34a)'
          : $variant === 'accent'
          ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
          : $variant === 'danger'
          ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
          : 'rgba(15, 23, 42, 0.9)'};
      color: ${({ $variant }) =>
        $variant === 'primary' || $variant === 'accent' || $variant === 'danger'
          ? '#f9fafb'
          : '#f9fafb'};
      border-color: transparent;
    }
  }
`;

const UnitPanel = styled.div`
  background: radial-gradient(circle at top left, #020617 0%, #020617 70%, #020617 100%);
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: 16px 18px 18px;
`;

const UnitRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
`;

const UnitLabel = styled(Text)`
  && {
    color: #9ca3af;
    font-size: 12px;
  }
`;

const UnitValue = styled(Text)`
  && {
    color: #e5e7eb;
    font-size: 14px;
    font-weight: 500;
  }
`;

const StyledInput = styled(Input)`
  && {
    background: rgba(15, 23, 42, 0.96);
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.6);
    color: #e5e7eb;
    &:hover,
    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 1px rgba(79, 70, 229, 0.5);
    }
    input {
      background: transparent;
    }
  }
`;

const StyledSelect = styled(Select)`
  && {
    .ant-select-selector {
      background: rgba(15, 23, 42, 0.96) !important;
      border-radius: 999px !important;
      border-color: rgba(148, 163, 184, 0.6) !important;
      color: #e5e7eb !important;
    }
    .ant-select-arrow {
      color: #9ca3af;
    }
  }
`;

const FooterText = styled(Text)`
  && {
    color: rgba(148, 163, 184, 0.85);
    font-size: 12px;
  }
`;

type AngleUnit = 'deg' | 'rad';

const safeEvaluate = (expression: string, angleUnit: AngleUnit): number | string => {
  if (!expression.trim()) return 0;

  try {
    let expr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'PI')
      .replace(/e/g, 'E');

    const sin = (x: number) => Math.sin(angleUnit === 'deg' ? (x * Math.PI) / 180 : x);
    const cos = (x: number) => Math.cos(angleUnit === 'deg' ? (x * Math.PI) / 180 : x);
    const tan = (x: number) => Math.tan(angleUnit === 'deg' ? (x * Math.PI) / 180 : x);
    const asin = (x: number) =>
      angleUnit === 'deg' ? (Math.asin(x) * 180) / Math.PI : Math.asin(x);
    const acos = (x: number) =>
      angleUnit === 'deg' ? (Math.acos(x) * 180) / Math.PI : Math.acos(x);
    const atan = (x: number) =>
      angleUnit === 'deg' ? (Math.atan(x) * 180) / Math.PI : Math.atan(x);
    const sqrt = Math.sqrt;
    const log = Math.log10;
    const ln = Math.log;
    const pow = Math.pow;
    const PI = Math.PI;
    const E = Math.E;

    // eslint-disable-next-line no-new-func
    const fn = new Function(
      'sin',
      'cos',
      'tan',
      'asin',
      'acos',
      'atan',
      'sqrt',
      'log',
      'ln',
      'pow',
      'PI',
      'E',
      `return ${expr};`
    );

    const result = fn(
      sin,
      cos,
      tan,
      asin,
      acos,
      atan,
      sqrt,
      log,
      ln,
      pow,
      PI,
      E
    );

    if (typeof result === 'number' && !Number.isFinite(result)) {
      return '数学错误';
    }

    return typeof result === 'number' ? Number(result.toPrecision(12)) : result;
  } catch {
    return '输入有误';
  }
};

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [displayValue, setDisplayValue] = useState('0');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [grams, setGrams] = useState<string>('');
  const [jin, setJin] = useState<string>('');
  const [chi, setChi] = useState<string>('');
  const [lengthMeters, setLengthMeters] = useState<string>('');

  const handleAppend = (value: string) => {
    setExpression(prev => prev + value);
  };

  const handleClear = () => {
    setExpression('');
    setDisplayValue('0');
  };

  const handleBackspace = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    const result = safeEvaluate(expression, angleUnit);
    if (typeof result === 'number') {
      setDisplayValue(String(result));
    } else {
      setDisplayValue(String(result));
    }
  };

  const handleUnitInput = (
    type: 'grams' | 'jin' | 'chi' | 'lengthMeters',
    value: string
  ) => {
    const sanitized = value.replace(/[^0-9.\\-]/g, '');
    if (type === 'grams') {
      setGrams(sanitized);
      const g = parseFloat(sanitized);
      if (Number.isNaN(g)) {
        setJin('');
        return;
      }
      const j = g / 500;
      setJin(j.toFixed(4));
    } else if (type === 'jin') {
      setJin(sanitized);
      const j = parseFloat(sanitized);
      if (Number.isNaN(j)) {
        setGrams('');
        return;
      }
      const g = j * 500;
      setGrams(g.toFixed(2));
    } else if (type === 'chi') {
      setChi(sanitized);
      const c = parseFloat(sanitized);
      if (Number.isNaN(c)) {
        setLengthMeters('');
        return;
      }
      const m = c * 0.3333333333;
      setLengthMeters(m.toFixed(4));
    } else if (type === 'lengthMeters') {
      setLengthMeters(sanitized);
      const m = parseFloat(sanitized);
      if (Number.isNaN(m)) {
        setChi('');
        return;
      }
      const c = m / 0.3333333333;
      setChi(c.toFixed(4));
    }
  };

  return (
    <AppContainer>
      <StyledHeader>
        <Brand>
          <BrandTitle level={3}>科学计算器 & 单位换算</BrandTitle>
          <BrandSubTitle>常用科学运算 · 国际主流计量单位一站式转换</BrandSubTitle>
        </Brand>
      </StyledHeader>

      <StyledContent>
        <MainCard bordered={false}>
          <Tabs defaultActiveKey="calculator" centered>
            <TabPane tab="科学计算器" key="calculator">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={14}>
                  <PanelTitle level={4}>科学计算</PanelTitle>
                  <PanelDesc>
                    支持四则运算、幂次、根号、三角函数（角度/弧度）、对数等常见科学计算。
                  </PanelDesc>

                  <CalculatorDisplay>
                    <ExpressionText>{expression || '在下方输入或点击按键开始计算'}</ExpressionText>
                    <ResultText>{displayValue}</ResultText>
                  </CalculatorDisplay>

                  <Space style={{ marginBottom: 12, width: '100%', justifyContent: 'space-between' }}>
                    <Space size="small">
                      <Text style={{ color: '#9ca3af', fontSize: 12 }}>角度单位：</Text>
                      <StyledSelect
                        size="small"
                        value={angleUnit}
                        onChange={value => setAngleUnit(value as AngleUnit)}
                        style={{ width: 120 }}
                      >
                        <Option value="deg">度（°）</Option>
                        <Option value="rad">弧度（rad）</Option>
                      </StyledSelect>
                    </Space>
                    <Space size="small">
                      <Button size="small" type="text" onClick={handleBackspace}>
                        退格
                      </Button>
                      <Button size="small" type="text" onClick={handleClear}>
                        清空
                      </Button>
                    </Space>
                  </Space>

                  <KeypadGrid>
                    <CalcButton onClick={() => handleAppend('sin(')}>sin</CalcButton>
                    <CalcButton onClick={() => handleAppend('cos(')}>cos</CalcButton>
                    <CalcButton onClick={() => handleAppend('tan(')}>tan</CalcButton>
                    <CalcButton onClick={() => handleAppend('log(')}>log</CalcButton>
                    <CalcButton onClick={() => handleAppend('ln(')}>ln</CalcButton>

                    <CalcButton onClick={() => handleAppend('sqrt(')}>√</CalcButton>
                    <CalcButton onClick={() => handleAppend('pow(')}>xʸ</CalcButton>
                    <CalcButton onClick={() => handleAppend('(')}>(</CalcButton>
                    <CalcButton onClick={() => handleAppend(')')}>)</CalcButton>
                    <CalcButton onClick={() => handleAppend('%')}>%</CalcButton>

                    <CalcButton onClick={() => handleAppend('7')}>7</CalcButton>
                    <CalcButton onClick={() => handleAppend('8')}>8</CalcButton>
                    <CalcButton onClick={() => handleAppend('9')}>9</CalcButton>
                    <CalcButton onClick={() => handleAppend('/')}>÷</CalcButton>
                    <CalcButton onClick={() => handleAppend('PI')}>π</CalcButton>

                    <CalcButton onClick={() => handleAppend('4')}>4</CalcButton>
                    <CalcButton onClick={() => handleAppend('5')}>5</CalcButton>
                    <CalcButton onClick={() => handleAppend('6')}>6</CalcButton>
                    <CalcButton onClick={() => handleAppend('*')}>×</CalcButton>
                    <CalcButton onClick={() => handleAppend('E')}>e</CalcButton>

                    <CalcButton onClick={() => handleAppend('1')}>1</CalcButton>
                    <CalcButton onClick={() => handleAppend('2')}>2</CalcButton>
                    <CalcButton onClick={() => handleAppend('3')}>3</CalcButton>
                    <CalcButton onClick={() => handleAppend('-')}>-</CalcButton>
                    <CalcButton $variant="ghost" onClick={handleBackspace}>
                      ⌫
                    </CalcButton>

                    <CalcButton onClick={() => handleAppend('0')}>0</CalcButton>
                    <CalcButton onClick={() => handleAppend('.')}>.</CalcButton>
                    <CalcButton onClick={() => handleAppend('00')}>00</CalcButton>
                    <CalcButton onClick={() => handleAppend('+')}>+</CalcButton>
                    <CalcButton $variant="primary" onClick={handleEvaluate}>
                      =
                    </CalcButton>
                  </KeypadGrid>
                </Col>

                <Col xs={24} md={10}>
                  <PanelTitle level={4}>常用单位换算</PanelTitle>
                  <PanelDesc>
                    支持克⇄磅、斤⇄千克、尺⇄米等国际主流计量单位快速换算。
                  </PanelDesc>

                  <Space direction="vertical" style={{ marginTop: 16, width: '100%' }} size={16}>
                    <UnitPanel>
                      <UnitLabel>质量换算 · 克 ⇄ 磅</UnitLabel>
                      <UnitRow>
                        <Space direction="vertical" size={4}>
                          <UnitLabel>克（g）</UnitLabel>
                          <StyledInput
                            placeholder="输入克数，例如 1000"
                            value={grams}
                            onChange={e => handleUnitInput('grams', e.target.value)}
                          />
                        </Space>
                        <Space direction="vertical" size={4}>
                          <UnitLabel>磅（lb）</UnitLabel>
                          <UnitValue>
                            {grams
                              ? `${(parseFloat(grams || '0') * 0.00220462).toFixed(6)} lb`
                              : '—'}
                          </UnitValue>
                        </Space>
                      </UnitRow>
                    </UnitPanel>

                    <UnitPanel>
                      <UnitLabel>质量换算 · 斤 ⇄ 千克</UnitLabel>
                      <UnitRow>
                        <Space direction="vertical" size={4}>
                          <UnitLabel>斤（中国市制）</UnitLabel>
                          <StyledInput
                            placeholder="输入斤数，例如 2"
                            value={jin}
                            onChange={e => handleUnitInput('jin', e.target.value)}
                          />
                        </Space>
                        <Space direction="vertical" size={4}>
                          <UnitLabel>千克（kg）</UnitLabel>
                          <UnitValue>
                            {jin
                              ? `${(parseFloat(jin || '0') * 0.5).toFixed(4)} kg`
                              : '—'}
                          </UnitValue>
                        </Space>
                      </UnitRow>
                    </UnitPanel>

                    <UnitPanel>
                      <UnitLabel>长度换算 · 尺 ⇄ 米</UnitLabel>
                      <UnitRow>
                        <Space direction="vertical" size={4}>
                          <UnitLabel>尺（中国市制，1 尺 ≈ 0.3333 m）</UnitLabel>
                          <StyledInput
                            placeholder="输入尺数，例如 3"
                            value={chi}
                            onChange={e => handleUnitInput('chi', e.target.value)}
                          />
                        </Space>
                        <Space direction="vertical" size={4}>
                          <UnitLabel>米（m）</UnitLabel>
                          <StyledInput
                            placeholder="或输入米数，自动换算为尺"
                            value={lengthMeters}
                            onChange={e => handleUnitInput('lengthMeters', e.target.value)}
                          />
                        </Space>
                        <Space direction="vertical" size={4}>
                          <UnitLabel>当前换算结果</UnitLabel>
                          <UnitValue>
                            {chi
                              ? `${chi || 0} 尺 ≈ ${
                                  lengthMeters ||
                                  (parseFloat(chi || '0') * 0.3333333333).toFixed(4)
                                } 米`
                              : lengthMeters
                              ? `${lengthMeters || 0} 米 ≈ ${
                                  chi ||
                                  (parseFloat(lengthMeters || '0') / 0.3333333333).toFixed(4)
                                } 尺`
                              : '—'}
                          </UnitValue>
                        </Space>
                      </UnitRow>
                    </UnitPanel>
                  </Space>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </MainCard>
      </StyledContent>

      <Footer
        style={{
          textAlign: 'center',
          background: 'transparent',
          padding: '12px 0 20px',
        }}
      >
        <FooterText>
          科学计算器 & 单位换算 · 支持克⇄磅、斤⇄千克、尺⇄米等常用国际主流计量单位
        </FooterText>
      </Footer>
    </AppContainer>
  );
};

export default App;
