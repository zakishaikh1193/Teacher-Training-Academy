import React from 'react';

interface RobotIconProps {
  size?: number;
  className?: string;
}

export const RobotIcon: React.FC<RobotIconProps> = ({ size = 24, className = '' }) => {
  return (
    <img
      src="/Robot.gif"
      alt="Robot AI Assistant"
      width={40}
      height={30}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}; 