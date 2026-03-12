import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import { useRole } from '@/hooks/auth/useRole';
import { UserRound } from 'lucide-react';
import DashboardFooter from '@/components/layouts/Footer';
import { mockUserProfile, type UserProfile } from '@/constants/data';
import { useState, type JSX } from 'react';

const ProfileItem = ({
  label,
  value,
  isEditing,
  editable,
  setValue,
  className,
}: {
  label: string;
  value: string | JSX.Element | JSX.Element[] | undefined;
  editable: boolean;
  isEditing?: boolean;
  setValue?: (val: string) => void;
  className?: string;
}) => {
  if (!setValue && editable) return null;
  if (!editable) isEditing = false;
  if (editable && isEditing === undefined) isEditing = false;
  return (
    <div className={className}>
      <h3 className='3xl:text-4xl mb-2 text-left text-2xl font-semibold text-gray-800 md:text-2xl'>
        {label}
      </h3>
      {isEditing ? (
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => {
            if (setValue) setValue(e.target.value);
          }}
          className='3xl:text-2xl w-full rounded-lg border border-gray-300 p-3 text-base leading-relaxed text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:p-4 md:text-lg lg:text-lg'
          rows={5}
        />
      ) : (
        <p className='3xl:text-2xl text-left text-base leading-relaxed text-gray-600 md:text-lg lg:text-lg'>
          {value}
        </p>
      )}
    </div>
  );
};

const Profile = () => {
  const { isMentee } = useRole();

  const [userProfile, setUserProfile] = useState<UserProfile>(
    mockUserProfile.find(
      (u) => u.role === (isMentee ? 'mentee' : 'mentor'),
    ) as UserProfile,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    userProfile?.description,
  );
  const [editedGoals, setEditedGoals] = useState(userProfile?.goals);
  const [editedSupportArea, setEditedSupportArea] = useState(
    userProfile?.supportArea,
  );
  const [editedMentoringMethod, setEditedMentoringMethod] = useState(
    userProfile?.mentoringMethod,
  );

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedDescription(userProfile?.description);
    setEditedGoals(userProfile?.goals);
    setEditedSupportArea(userProfile?.supportArea);
    setEditedMentoringMethod(userProfile?.mentoringMethod);
  };

  const handleSave = () => {
    setUserProfile({
      ...userProfile,
      description: editedDescription,
      goals: editedGoals,
      supportArea: editedSupportArea,
      mentoringMethod: editedMentoringMethod,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(userProfile?.description);
    setEditedGoals(userProfile?.goals);
    setEditedSupportArea(userProfile?.supportArea);
    setEditedMentoringMethod(userProfile?.mentoringMethod);
    setIsEditing(false);
  };

  return (
    <div className='page-layout'>
      {/* Sidebar navigation */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-12 md:py-16'>
          <div className='page-container'>
            {/* Page header */}
            <div className='page-header'>
              <h1 className='page-title'>My Profile</h1>
            </div>

            {/* Profile card container */}
            <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-lg md:rounded-3xl md:p-6 lg:p-8 xl:p-10'>
              {/* Avatar and contact info section */}
              <div className='flex w-full flex-col lg:flex-row lg:items-start lg:justify-between xl:justify-start xl:space-x-20'>
                {/* Avatar and name section */}
                <div className='flex flex-col items-center sm:flex-row sm:items-start'>
                  <div className='flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 md:h-28 md:w-28 lg:h-32 lg:w-32'>
                    <UserRound className='h-12 w-12 text-gray-500 md:h-14 md:w-14 lg:h-16 lg:w-16' />
                  </div>
                  <div className='mt-4 space-y-1 text-center sm:mt-0 sm:ml-4 sm:text-left md:ml-6 md:space-y-2'>
                    <h2 className='3xl:text-4xl text-2xl font-semibold text-gray-800 md:text-3xl'>
                      {userProfile.name}
                    </h2>
                    <p className='3xl:text-2xl text-lg text-gray-600 md:text-xl'>
                      {isMentee ? (
                        <>
                          <span className='font-medium text-gray-800'>
                            Student ID:
                          </span>{' '}
                          {userProfile.studentId}
                        </>
                      ) : (
                        <>
                          <span className='font-medium text-gray-800'>
                            Email:
                          </span>{' '}
                          {userProfile.email}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* === Right: Contact Info === */}
                <div className='3xl:text-2xl mt-6 flex flex-col gap-4 text-left text-lg text-gray-700 sm:text-left md:mt-8 md:text-xl lg:mt-0'>
                  <p>
                    {isMentee ? (
                      <>
                        <span className='font-medium text-gray-800'>
                          Email:
                        </span>{' '}
                        {userProfile.email}
                      </>
                    ) : (
                      <>
                        <span className='font-medium text-gray-800'>
                          Faculty:
                        </span>{' '}
                        {userProfile.faculty}
                      </>
                    )}
                  </p>
                  <p>
                    {isMentee ? (
                      <>
                        <span className='font-medium text-gray-800'>
                          Faculty:
                        </span>{' '}
                        {userProfile.faculty}
                      </>
                    ) : (
                      <>
                        <span className='font-medium text-gray-800'>
                          Department:
                        </span>{' '}
                        {userProfile.department}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* ===== Description Section ===== */}
              <div className='mt-6 rounded-xl bg-gray-50 p-4 shadow-inner md:mt-8 md:rounded-2xl md:p-6 lg:mt-10 lg:p-8'>
                <div className='flex flex-col lg:flex-row lg:items-start'>
                  <div className='flex-1 space-y-4 text-base md:space-y-6 md:text-lg lg:pr-6'>
                    <ProfileItem
                      label='Self Description'
                      value={editedDescription}
                      isEditing={isEditing}
                      editable={true}
                      setValue={setEditedDescription}
                    />

                    {isMentee && (
                      <ProfileItem
                        label='Learning Goals'
                        value={editedGoals}
                        isEditing={isEditing}
                        editable={true}
                        setValue={setEditedGoals}
                      />
                    )}

                    {!isMentee && (
                      <ProfileItem
                        label='Support Area'
                        value={editedSupportArea}
                        isEditing={isEditing}
                        editable={true}
                        setValue={setEditedSupportArea}
                      />
                    )}

                    {!isMentee && (
                      <ProfileItem
                        label='Mentoring Method'
                        value={editedMentoringMethod}
                        isEditing={isEditing}
                        editable={true}
                        setValue={setEditedMentoringMethod}
                      />
                    )}
                  </div>

                  <div className='mt-6 flex justify-center sm:justify-end md:mt-8 lg:mt-0 lg:flex-shrink-0'>
                    {isEditing ? (
                      <div className='flex flex-col sm:flex-row lg:flex-col'>
                        <button
                          onClick={handleSave}
                          className='md:text-md 3xl:text-xl 3xl:px-6 h-fit rounded-lg bg-blue-500 px-4 py-2 text-base font-medium whitespace-nowrap text-white transition hover:bg-blue-400 md:rounded-xl md:py-3'
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className='md:text-md 3xl:text-xl 3xl:px-6 mt-3 h-fit rounded-lg bg-gray-500 px-4 py-2 text-base font-medium whitespace-nowrap text-white transition hover:bg-gray-600 sm:mt-0 sm:ml-3 md:rounded-xl md:py-3 lg:mt-3 lg:ml-0'
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEditClick}
                        className='3xl:text-xl 3xl:px-6 md:text-md h-fit rounded-lg bg-blue-500 px-4 py-2 text-base font-medium whitespace-nowrap text-white transition hover:bg-blue-400 md:rounded-xl md:py-3'
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default Profile;
export { ProfileItem };
