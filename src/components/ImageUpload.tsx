import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Delete, Eye } from '@ant-design/icons';
import { Button, Card, Image, message, Modal } from 'antd';
import styled from 'styled-components';

const UploadContainer = styled.div`
  .upload-area {
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    background: #fafafa;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      border-color: #1890ff;
      background: #f0f8ff;
    }
    
    &.drag-active {
      border-color: #1890ff;
      background: #e6f7ff;
    }
  }
  
  .upload-icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
  
  .upload-text {
    font-size: 16px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .upload-hint {
    font-size: 14px;
    color: #999;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const ImageCard = styled(Card)`
  .ant-card-body {
    padding: 8px;
  }
`;

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxFiles?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImagesChange, 
  maxFiles = 10 
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = [...images, ...acceptedFiles];
    if (newImages.length > maxFiles) {
      message.warning(`最多只能上传${maxFiles}张图片`);
      return;
    }
    setImages(newImages);
    onImagesChange(newImages);
  }, [images, maxFiles, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const previewImageModal = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
    URL.revokeObjectURL(previewImage);
  };

  return (
    <UploadContainer>
      <div
        {...getRootProps()}
        className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="upload-icon" />
        <div className="upload-text">
          {isDragActive ? '松开鼠标上传图片' : '点击或拖拽上传文玩图片'}
        </div>
        <div className="upload-hint">
          支持 JPG、PNG、GIF 等格式，最多{maxFiles}张
        </div>
      </div>

      {images.length > 0 && (
        <ImageGrid>
          {images.map((file, index) => (
            <ImageCard
              key={index}
              hoverable
              cover={
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`上传图片 ${index + 1}`}
                  style={{ height: 150, objectFit: 'cover' }}
                />
              }
              actions={[
                <Button
                  type="text"
                  icon={<Eye />}
                  onClick={() => previewImageModal(file)}
                />,
                <Button
                  type="text"
                  danger
                  icon={<Delete />}
                  onClick={() => removeImage(index)}
                />
              ]}
            />
          ))}
        </ImageGrid>
      )}

      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={handlePreviewCancel}
        width={800}
      >
        <Image
          src={previewImage}
          alt="预览图片"
          style={{ width: '100%' }}
        />
      </Modal>
    </UploadContainer>
  );
};

export default ImageUpload;
