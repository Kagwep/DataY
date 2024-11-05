import React, { useState, useRef, useEffect } from 'react';
import {
  Pencil,
  Square,
  Circle,
  Type,
  Pointer,
  Save,
  Undo,
  RotateCcw,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { Annotation, CircleAnnotation, FreehandAnnotation, LabelAnnotation, LabelPosition, RectangleAnnotation, Tool, ToolInfo } from '../types';


const ImageAnnotationPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>('pointer');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [currentLabel, setCurrentLabel] = useState<string>('');
  const [showLabelInput, setShowLabelInput] = useState<boolean>(false);
  const [labelPosition, setLabelPosition] = useState<LabelPosition>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const tools: ToolInfo[] = [
    { id: 'pointer', icon: Pointer, name: 'Select' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
    { id: 'freehand', icon: Pencil, name: 'Freehand' },
    { id: 'label', icon: Tag, name: 'Label' }
  ];

  useEffect(() => {
    if (imageLoaded && image && canvasRef.current) {
      drawCanvas();
    }
  }, [annotations, imageLoaded, image]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setImageLoaded(true);
          if (canvasRef.current) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            drawCanvas();
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    if (image) {
      ctx.drawImage(image, 0, 0);
    }
    
    // Draw all annotations
    annotations.forEach(annotation => {
      ctx.beginPath();
      ctx.strokeStyle = annotation.color;
      ctx.lineWidth = 2;
      
      switch (annotation.type) {
        case 'rectangle': {
          const rect = annotation as RectangleAnnotation;
          ctx.strokeRect(
            rect.startX,
            rect.startY,
            rect.width,
            rect.height
          );
          break;
        }
        case 'circle': {
          const circle = annotation as CircleAnnotation;
          ctx.beginPath();
          ctx.arc(
            circle.centerX,
            circle.centerY,
            circle.radius,
            0,
            2 * Math.PI
          );
          ctx.stroke();
          break;
        }
        case 'freehand': {
          const freehand = annotation as FreehandAnnotation;
          ctx.beginPath();
          freehand.points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
          break;
        }
        case 'label': {
          const label = annotation as LabelAnnotation;
          ctx.font = '14px Arial';
          ctx.fillStyle = label.color;
          ctx.fillText(label.text, label.x, label.y);
          break;
        }
      }
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!imageLoaded || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    switch (selectedTool) {
      case 'rectangle':
        setCurrentAnnotation({
          type: 'rectangle',
          startX: x,
          startY: y,
          width: 0,
          height: 0,
          color: '#FF0000'
        });
        break;
      case 'circle':
        setCurrentAnnotation({
          type: 'circle',
          centerX: x,
          centerY: y,
          radius: 0,
          color: '#FF0000'
        });
        break;
      case 'freehand':
        setCurrentAnnotation({
          type: 'freehand',
          points: [{ x, y }],
          color: '#FF0000'
        });
        break;
      case 'label':
        setLabelPosition({ x, y });
        setShowLabelInput(true);
        break;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDrawing || !currentAnnotation || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    switch (currentAnnotation.type) {
      case 'rectangle':
        setCurrentAnnotation(prev => ({
          ...(prev as RectangleAnnotation),
          width: x - (prev as RectangleAnnotation).startX,
          height: y - (prev as RectangleAnnotation).startY
        }));
        break;
      case 'circle': {
        const circle = currentAnnotation as CircleAnnotation;
        const dx = x - circle.centerX;
        const dy = y - circle.centerY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        setCurrentAnnotation(prev => ({
          ...(prev as CircleAnnotation),
          radius
        }));
        break;
      }
      case 'freehand':
        setCurrentAnnotation(prev => ({
          ...(prev as FreehandAnnotation),
          points: [...(prev as FreehandAnnotation).points, { x, y }]
        }));
        break;
    }
    
    drawCanvas();
  };

  const stopDrawing = (): void => {
    if (isDrawing && currentAnnotation) {
      setAnnotations(prev => [...prev, currentAnnotation]);
    }
    setIsDrawing(false);
    setCurrentAnnotation(null);
  };

  const addLabel = (): void => {
    if (currentLabel.trim()) {
      setAnnotations(prev => [...prev, {
        type: 'label',
        text: currentLabel,
        x: labelPosition.x,
        y: labelPosition.y,
        color: '#FF0000'
      }]);
      setCurrentLabel('');
      setShowLabelInput(false);
    }
  };

  const undoLastAnnotation = (): void => {
    setAnnotations(prev => prev.slice(0, -1));
  };

  const saveAnnotations = (): void => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'annotated-image.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Image Annotation Tool</h1>
            <div className="flex gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Load Image
              </button>
              <button
                onClick={undoLastAnnotation}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Undo className="h-4 w-4 mr-2" />
                Undo
              </button>
              <button
                onClick={saveAnnotations}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow p-4 w-48">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tools</h2>
            <div className="space-y-2">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm ${
                    selectedTool === tool.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tool.icon className="h-4 w-4 mr-2" />
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              
              {/* Label Input Modal */}
              {showLabelInput && (
                <div
                  className="absolute bg-white shadow-lg rounded-lg p-4"
                  style={{ left: labelPosition.x, top: labelPosition.y }}
                >
                  <input
                    type="text"
                    value={currentLabel}
                    onChange={(e) => setCurrentLabel(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                    placeholder="Enter label text"
                  />
                  <button
                    onClick={addLabel}
                    className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default ImageAnnotationPage;