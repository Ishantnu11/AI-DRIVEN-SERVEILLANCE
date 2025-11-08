interface StressIndicatorProps {
  value: number;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function StressIndicator({ value, label, showLabel = true, size = 'md' }: StressIndicatorProps) {
  const getColor = (val: number): string => {
    if (val <= 0.3) return 'bg-green-500';
    if (val <= 0.6) return 'bg-yellow-500';
    if (val <= 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getLabel = (val: number): string => {
    if (val <= 0.3) return 'Low';
    if (val <= 0.6) return 'Moderate';
    if (val <= 0.8) return 'High';
    return 'Critical';
  };
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const percentage = Math.min(100, Math.max(0, value * 100));
  const colorClass = getColor(value);
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 font-medium">{label || 'Environmental Stress Index'}</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${colorClass.replace('bg-', 'text-')}`}>
              {getLabel(value)}
            </span>
            <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
          </div>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`${colorClass} ${sizeClasses[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ 
            width: `${percentage}%`,
            animation: 'slideInLeft 0.7s ease-out'
          }}
        />
      </div>
    </div>
  );
}

export default StressIndicator;


