import React from 'react';

interface TooltipProps {
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
  return (
    <div className="tooltip">
      {content}
    </div>
  );
};

export default Tooltip;
