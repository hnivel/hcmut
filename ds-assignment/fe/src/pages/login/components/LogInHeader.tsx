import { CrabFoodLogo } from "@/components/layouts/Sidebar";

const LogInHeader = () => {
  return (
    <div className='mb-8 flex flex-col items-center text-[#444444]'>
      <div className='mb-2 flex items-center space-x-4'>
        <div className='bg-orange-100 flex h-12 w-12 items-center justify-center rounded-full md:h-20 md:w-20'>
          <CrabFoodLogo className='h-8 w-8 text-orange-500 md:h-12 md:w-12' />
        </div>
        <h1 className='text-3xl font-bold text-orange-500 md:text-4xl'>
          CrabFood
        </h1>
      </div>
      <p className='text-center text-sm text-stone-600 md:text-xl'>
        Your gateway to delicious meals and seamless dining experiences.
      </p>
    </div>
  );
};

export default LogInHeader;
