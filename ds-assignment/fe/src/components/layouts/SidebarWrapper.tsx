import React from 'react';
import Sidebar from './Sidebar';

interface SidebarWrapperProps {
  desktopClassName?: string;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({
  desktopClassName = '3xl:w-96 hidden bg-white lg:block lg:w-56',
}) => {
  return (
    <>
      <Sidebar />

      <div className='h-32 lg:hidden' />

      <div className={desktopClassName} />
    </>
  );
};

export default SidebarWrapper;
