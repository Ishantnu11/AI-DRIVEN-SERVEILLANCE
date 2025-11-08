import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  className?: string;
  headerClassName?: string;
  onClick?: () => void;
}

function Card({ children, title, action, className = '', headerClassName = '', onClick }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover-lift transition-all ${className} ${onClick ? 'cursor-pointer hover:border-purple-300' : ''}`} onClick={onClick}>
      {(title || action) && (
        <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${headerClassName}`}>
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={title || action ? 'p-6' : 'p-6'}>
        {children}
      </div>
    </div>
  );
}

export default Card;


