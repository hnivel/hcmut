import React from 'react';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  actions,
  className,
}) => {
  return (
    <div className={`page-header ${className ?? ''}`}>
      <h1 className='page-title'>{title}</h1>
      {actions ? (
        <div className='flex items-center gap-2'>{actions}</div>
      ) : null}
    </div>
  );
};

export default PageHeader;
