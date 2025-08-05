import React, { useState } from 'react';
import { headers, coreTasks, marketingTasks, communicationTasks, touchpointScores } from '../constants/scores';

function InputSection({ onCalculate }) {
  const [campaignName, setCampaignName] = useState('');
  const [coreWeight, setCoreWeight] = useState('');
  const [marketingWeight, setMarketingWeight] = useState('');
  const [commWeight, setCommWeight] = useState('');

  const [subtaskData, setSubtaskData] = useState({
    core: {},
    marketing: {},
    communication: {}
  });

  const handleSubtaskChange = (category, task, checked, weight) => {
    setSubtaskData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [task]: { checked, weight }
      }
    }));
  };

  const getWeightedSubscore = (scores, selectedTasks) => {
    const selected = Object.entries(selectedTasks)
      .filter(([_, val]) => val.checked);

    if (selected.length === 0) return 0;

    const totalWeight = selected.reduce((sum, [_, val]) => sum + Number(val.weight || 0), 0);
    if (totalWeight === 0) return 0;

    return selected.reduce((score, [task, val]) => {
      const idx = headers.indexOf(task);
      return score + scores[idx] * (val.weight / 100);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mainTotal = +coreWeight + +marketingWeight + +commWeight;
    if (mainTotal !== 100) {
      alert("Main task weights must sum to 100.");
      return;
    }

    const validateSubtasks = (categoryName, subtasks) => {
      const selected = Object.entries(subtasks).filter(([_, v]) => v.checked);
      if (selected.length > 0) {
        const subTotal = selected.reduce((sum, [_, val]) => sum + Number(val.weight || 0), 0);
        if (Math.abs(subTotal - 100) > 0.01) {
          alert(`Selected ${categoryName} subtask weights must total 100. Found: ${subTotal}`);
          return false;
        }
      }
      return true;
    };

    if (
      !validateSubtasks("Core", subtaskData.core) ||
      !validateSubtasks("Marketing", subtaskData.marketing) ||
      !validateSubtasks("Communication", subtaskData.communication)
    ) return;

    const results = {};
    for (const [tp, scores] of Object.entries(touchpointScores)) {
      const coreScore = getWeightedSubscore(scores, subtaskData.core);
      const marketingScore = getWeightedSubscore(scores, subtaskData.marketing);
      const commScore = getWeightedSubscore(scores, subtaskData.communication);

      const final = (
        +coreWeight * coreScore +
        +marketingWeight * marketingScore +
        +commWeight * commScore
      ) / 100;

      results[tp] = +final.toFixed(2);
    }

    onCalculate({ campaignName, results });
  };

  const renderSubtaskGroup = (label, tasks, categoryKey) => (
    <div className="subtask-group">
      <h4 className="subtask-heading">{label}</h4>
      <div className="subtask-list">
        {tasks.map(task => (
          <div key={task} className="subtask-item">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={subtaskData[categoryKey][task]?.checked || false}
                onChange={(e) =>
                  handleSubtaskChange(categoryKey, task, e.target.checked, subtaskData[categoryKey][task]?.weight || '')
                }
              />
              <span className="checkmark"></span>
              <span className="task-label">{task}</span>
            </label>
            {subtaskData[categoryKey][task]?.checked && (
              <div className="weight-input-container">
                <input
                  type="number"
                  placeholder="Weight"
                  value={subtaskData[categoryKey][task]?.weight || ''}
                  onChange={(e) =>
                    handleSubtaskChange(categoryKey, task, true, e.target.value)
                  }
                  className="weight-input"
                  min="0"
                  max="100"
                />
                <span>%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="form-section">
        <label className="form-label"><strong>Campaign Name</strong></label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="campaign-name-input"
          placeholder="Enter campaign name"
        />
      </div>
      <p className="instruction-line">The total of Core Communication, Marketing, and Communication task weights must equal <strong>100%</strong>.</p>
      <div className="weight-inputs-container">
        <div className="weight-input-group">
          <label className="weight-label">Core Communication Tasks</label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={coreWeight}
              onChange={(e) => setCoreWeight(e.target.value)}
              className="weight-input"
              min="0"
              max="100"
            />
            <span>%</span>
          </div>
        </div>
        <div className="weight-input-group">
          <label className="weight-label">Marketing Tasks</label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={marketingWeight}
              onChange={(e) => setMarketingWeight(e.target.value)}
              className="weight-input"
              min="0"
              max="100"
            />
            <span>%</span>
          </div>
        </div>
        <div className="weight-input-group">
          <label className="weight-label">Communication Tasks</label>
          <div className="input-with-suffix">
            <input
              type="number"
              value={commWeight}
              onChange={(e) => setCommWeight(e.target.value)}
              className="weight-input"
              min="0"
              max="100"
            />
            <span>%</span>
          </div>
        </div>
      </div>
      <p className="instruction-line">For each category, the weights of the selected subtasks must also total <strong>100%</strong>.</p>

      <div className="subtasks-container">
        {renderSubtaskGroup("Core Communication Tasks", coreTasks, "core")}
        {renderSubtaskGroup("Marketing Tasks", marketingTasks, "marketing")}
        {renderSubtaskGroup("Communication Tasks", communicationTasks, "communication")}
      </div>

      <div className="submit-button-container">
        <button type="submit" className="submit-button">
          <span className="button-icon">🚀</span>
          Calculate Scores
        </button>
      </div>

      <style jsx>{`
        .input-form {
          background: #ffffff;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 1200px;
          box-sizing: border-box;
          margin: 0 auto;
        }

        .form-section {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2d3748;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .campaign-name-input {
          width: 97%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          color: #1a202c;
          background: #fff;
        }

        .campaign-name-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .campaign-name-input::placeholder {
          color: #a0aec0;
        }

        .weight-inputs-container {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .weight-input-group {
          flex: 1;
        }

        .weight-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2d3748;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .input-with-suffix {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s;
          background: #fff;
        }

        .input-with-suffix:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .weight-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          font-size: 1rem;
          color: #1a202c;
          background: transparent;
        }

        .weight-input:focus {
          outline: none;
        }

        .input-with-suffix span {
          padding: 0 1rem;
          background: #f7fafc;
          color: #718096;
          font-size: 0.875rem;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .subtasks-container {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .subtask-group {
          flex: 1;
          background: #f8fafc;
          padding: 1.25rem;
          border-radius: 10px;
        }

        .subtask-heading {
          color: #2d3748;
          font-size: 1rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .subtask-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .subtask-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 1.75rem;
          cursor: pointer;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          left: 0;
          height: 1.125rem;
          width: 1.125rem;
          background-color: #fff;
          border: 1px solid #cbd5e0;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .checkbox-container:hover input ~ .checkmark {
          border-color: #a0aec0;
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: #667eea;
          border-color: #667eea;
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 6px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .weight-input-container {
          display: flex;
          align-items: center;
          margin-left: 1.75rem;
          gap: 0.5rem;
        }

        .weight-input-container input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          width: 70px;
          font-size: 0.875rem;
          background: #fff;
          color: #1a202c;
        }

        .weight-input-container input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .submit-button-container {
          display: flex;
          justify-content: flex-end;
        }

        .submit-button {
          padding: 0.75rem 1.5rem;
          background-color: #4c51bf;
          color: white;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .submit-button:hover {
          background-color: #434190;
          transform: translateY(-1px);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .button-icon {
          font-size: 1rem;
        }

        .instruction-line {
          font-size: 0.875rem;
          color: #744210;
          background-color: #fffbea;
          border-left: 4px solid #ecc94b;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .weight-inputs-container {
            flex-direction: column;
            gap: 1rem;
          }

          .subtasks-container {
            flex-direction: column;
          }
        }
      `}</style>
    </form>
  );
}

export default InputSection;