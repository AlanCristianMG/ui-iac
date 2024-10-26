// ModelSelector.jsx
import React, { useState, useEffect } from 'react';
import './ModelSelector.css';

function ModelSelector({ models = [], selectedModel: parentSelectedModel, onModelChange }) {
  const [selectedModel, setSelectedModel] = useState(parentSelectedModel || models[0]?.modelId || '');

  useEffect(() => {
    if (selectedModel !== parentSelectedModel) {
      setSelectedModel(parentSelectedModel);
    }
  }, [parentSelectedModel]);

  useEffect(() => {
    if (onModelChange && selectedModel) {
      onModelChange(selectedModel);
    }
  }, [selectedModel, onModelChange]);

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    onModelChange(modelId);
  };

  return (
    <div className="ModelSelector">
      <div className="selected">
        <span>{models.find(model => model.modelId === selectedModel)?.name || 'Select Model'}</span>
      </div>
      <div className="options">
        {models.map((model) => (
          <div key={model.modelId} title={model.name}>
            <input
              id={model.modelId}
              name="modelOption"
              type="radio"
              checked={selectedModel === model.modelId}
              onChange={() => handleSelectModel(model.modelId)}
            />
            <label className="option" htmlFor={model.modelId}>
              {model.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;
