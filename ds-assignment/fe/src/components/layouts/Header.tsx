import React from 'react';

interface HeaderProps {
  title: string;
}
const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className={`page-header`}>
      <h1 className='page-title'>{title}</h1>
    </div>
  );
};

export default Header;
