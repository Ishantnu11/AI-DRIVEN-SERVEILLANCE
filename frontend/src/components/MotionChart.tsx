import { useMotionChart } from '../hooks/useApi';

function MotionChart() {
  const { data: motionData = [] } = useMotionChart();
  
  // Use API data if available, otherwise generate default heights
  const barHeights = motionData.length > 0 
    ? motionData.map(d => Math.min(100, Math.max(0, d.motion)))
    : [30, 50, 80, 60, 45, 25, 70, 55, 90, 35, 40, 20];
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover-lift animate-scaleIn">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Motion Detection Events (Last Hour)
      </h2>
      <div className="h-56 bg-gray-50 rounded-lg p-4 flex items-end border border-gray-200">
        <div className="w-full flex justify-around items-end h-full gap-2">
          {barHeights.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm transition-all duration-500 hover:opacity-80"
              style={{
                height: `${height}%`,
                backgroundColor: height >= 80 ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
                animation: `slideUp 0.5s ease-out ${index * 0.05}s both`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MotionChart;


