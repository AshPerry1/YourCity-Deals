'use client';

import { useState } from 'react';
import { TargetingCondition, TargetingRule } from '@/lib/types';
import { TargetingEngine } from '@/lib/targeting';

interface ConditionBuilderProps {
  onConditionsChange: (conditions: TargetingRule['conditions']) => void;
  initialConditions?: TargetingRule['conditions'];
}

export default function ConditionBuilder({ onConditionsChange, initialConditions }: ConditionBuilderProps) {
  const [conditions, setConditions] = useState<TargetingRule['conditions']>(
    initialConditions || { any: [] }
  );
  const [activeGroup, setActiveGroup] = useState<'all' | 'any' | 'none'>('any');

  const fieldOptions = [
    { value: 'zip_code', label: 'Zip Code' },
    { value: 'school_id', label: 'School' },
    { value: 'grade', label: 'Grade' },
    { value: 'referrer_code', label: 'Referral Code' },
    { value: 'signup_date', label: 'Signup Date' },
    { value: 'last_activity', label: 'Last Activity' },
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'in', label: 'In List' },
    { value: 'not_in', label: 'Not In List' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'between', label: 'Between' },
  ];

  const addCondition = () => {
    const newCondition: TargetingCondition = {
      field: 'zip_code',
      operator: 'equals',
      value: ''
    };

    const updatedConditions = { ...conditions };
    if (!updatedConditions[activeGroup]) {
      updatedConditions[activeGroup] = [];
    }
    updatedConditions[activeGroup]!.push(newCondition);
    
    setConditions(updatedConditions);
    onConditionsChange(updatedConditions);
  };

  const updateCondition = (index: number, field: keyof TargetingCondition, value: any) => {
    const updatedConditions = { ...conditions };
    if (updatedConditions[activeGroup] && updatedConditions[activeGroup]![index]) {
      updatedConditions[activeGroup]![index] = {
        ...updatedConditions[activeGroup]![index],
        [field]: value
      };
    }
    
    setConditions(updatedConditions);
    onConditionsChange(updatedConditions);
  };

  const removeCondition = (index: number) => {
    const updatedConditions = { ...conditions };
    if (updatedConditions[activeGroup]) {
      updatedConditions[activeGroup]!.splice(index, 1);
    }
    
    setConditions(updatedConditions);
    onConditionsChange(updatedConditions);
  };

  const renderValueInput = (condition: TargetingCondition, index: number) => {
    const { field, operator, value } = condition;

    switch (operator) {
      case 'in':
      case 'not_in':
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter values separated by commas"
            value={Array.isArray(value) ? value.join(', ') : ''}
            onChange={(e) => updateCondition(index, 'value', e.target.value.split(',').map(v => v.trim()))}
          />
        );

      case 'between':
        return (
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start value"
              value={Array.isArray(value) ? value[0] || '' : ''}
              onChange={(e) => {
                const newValue = Array.isArray(value) ? [...value] : ['', ''];
                newValue[0] = e.target.value;
                updateCondition(index, 'value', newValue);
              }}
            />
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End value"
              value={Array.isArray(value) ? value[1] || '' : ''}
              onChange={(e) => {
                const newValue = Array.isArray(value) ? [...value] : ['', ''];
                newValue[1] = e.target.value;
                updateCondition(index, 'value', newValue);
              }}
            />
          </div>
        );

      case 'greater_than':
      case 'less_than':
        return (
          <input
            type={field.includes('date') ? 'date' : 'text'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${field.includes('date') ? 'date' : 'value'}`}
            value={value as string}
            onChange={(e) => updateCondition(index, 'value', e.target.value)}
          />
        );

      default:
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
            value={value as string}
            onChange={(e) => updateCondition(index, 'value', e.target.value)}
          />
        );
    }
  };

  const getGroupLabel = (group: string) => {
    switch (group) {
      case 'all': return 'ALL conditions must match (AND)';
      case 'any': return 'ANY condition must match (OR)';
      case 'none': return 'NO conditions should match (NOT)';
      default: return group;
    }
  };

  return (
    <div className="space-y-6">
      {/* Condition Groups */}
      <div className="flex space-x-4">
        {(['all', 'any', 'none'] as const).map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${
              activeGroup === group
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {group.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Active Group Label */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium">
          {getGroupLabel(activeGroup)}
        </p>
      </div>

      {/* Conditions List */}
      <div className="space-y-4">
        {conditions[activeGroup]?.map((condition, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {/* Field */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={condition.field}
                  onChange={(e) => updateCondition(index, 'field', e.target.value)}
                >
                  {fieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Operator */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={condition.operator}
                  onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                >
                  {operatorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                {renderValueInput(condition, index)}
              </div>

              {/* Remove Button */}
              <div className="flex items-end">
                <button
                  onClick={() => removeCondition(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Condition Button */}
        <button
          onClick={addCondition}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-gray-600 font-medium">Add Condition</span>
          </div>
        </button>
      </div>

      {/* JSON Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">JSON Preview</h4>
        <pre className="text-xs text-gray-600 bg-white p-3 rounded border overflow-x-auto">
          {JSON.stringify(conditions, null, 2)}
        </pre>
      </div>

      {/* Validation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Use "ANY" for broad targeting, "ALL" for specific targeting, and "NONE" to exclude certain users.
        </p>
      </div>
    </div>
  );
}
