import { useState } from 'react';
import SidebarWrapper from '@/components/layouts/SidebarWrapper';
import DashboardFooter from '@/components/layouts/Footer';
import Calendar from '../../components/ui/Calendar';
import {
  mockMentorAvailabilityEvents,
  type AvailabilityEvent,
} from './constants/mentorData';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2, Edit2 } from 'lucide-react';

const MentorAvailability = () => {
  const [showRequestMeeting, setShowRequestMeeting] = useState(false);
  const [slotType, setSlotType] = useState<'fixed' | 'flexible'>('fixed');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilityEvent | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [availabilityEvents, setAvailabilityEvents] = useState(
    mockMentorAvailabilityEvents,
  );

  // Form state
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    validFrom: '',
    validTo: '',
  });

  // Calculate duration from start and end time
  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 1;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;
    return durationMinutes / 60; // Convert to hours
  };

  const handleSlotClick = (event: AvailabilityEvent) => {
    setSelectedSlot(event);
    setSlotType(event.type);
    setIsEditing(false);
    setShowRequestMeeting(true);

    // Use endTime if available, otherwise calculate from duration
    let startTimeStr = event.time;
    let endTimeStr = event.endTime || '';

    // If no endTime but has duration, calculate it
    if (!endTimeStr && event.duration) {
      const [hours, minutes] = startTimeStr.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + event.duration * 60;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      endTimeStr = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    }

    setFormData({
      day: event.day,
      startTime: startTimeStr,
      endTime: endTimeStr,
      validFrom: event.validFrom,
      validTo: event.validTo,
    });
  };

  const handleAddNew = () => {
    setSelectedSlot(null);
    setIsEditing(false);
    setSlotType('fixed');
    setFormData({
      day: '',
      startTime: '',
      endTime: '',
      validFrom: '',
      validTo: '',
    });
    setShowRequestMeeting(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (!selectedSlot) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this time slot?',
    );
    if (confirmed) {
      setAvailabilityEvents((prev) =>
        prev.filter((e) => e.id !== selectedSlot.id),
      );
      toast.success('Time slot deleted successfully');
      setShowRequestMeeting(false);
      setSelectedSlot(null);
    }
  };

  const handleSave = () => {
    // Validation
    if (!formData.day || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const duration = calculateDuration(formData.startTime, formData.endTime);

    // Validate duration (must be positive and reasonable)
    if (duration <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    if (duration > 12) {
      toast.error('Duration cannot exceed 12 hours');
      return;
    }

    if (isEditing && selectedSlot) {
      // Update existing slot
      const updatedSlot: AvailabilityEvent = {
        ...selectedSlot,
        type: slotType,
        day: formData.day,
        time: formData.startTime,
        endTime: formData.endTime,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        duration: duration,
      };

      setAvailabilityEvents((prev) =>
        prev.map((e) => (e.id === selectedSlot.id ? updatedSlot : e)),
      );
      setSelectedSlot(updatedSlot);
      toast.success('Time slot updated successfully');
      setIsEditing(false);
    } else if (!selectedSlot) {
      // Create new slot
      const newSlot: AvailabilityEvent = {
        id: `AE${Date.now()}`,
        type: slotType,
        day: formData.day,
        time: formData.startTime,
        endTime: formData.endTime,
        validFrom: formData.validFrom,
        validTo: formData.validTo,
        duration: duration,
      };

      setAvailabilityEvents((prev) => [...prev, newSlot]);
      toast.success('New time slot added successfully');
      setShowRequestMeeting(false);
      setFormData({
        day: '',
        startTime: '',
        endTime: '',
        validFrom: '',
        validTo: '',
      });
    }
  };

  const handleCancel = () => {
    setShowRequestMeeting(false);
    setSelectedSlot(null);
    setIsEditing(false);
  };

  return (
    <div className='page-layout'>
      <Toaster position='top-center' />
      {/* Sidebar */}
      <SidebarWrapper />

      {/* Main Content */}
      <div className='flex flex-1 flex-col'>
        <main className='w-full flex-1 py-6 md:py-8 lg:py-12 xl:py-16'>
          <div className='page-container'>
            {/* === Header === */}
            <div className='page-header'>
              <h1 className='page-title'>My Availability</h1>
            </div>
            <div className='relative flex flex-col md:flex-row'>
              {/* Calendar Section */}
              <div className='flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-lg md:mr-6 md:rounded-2xl md:p-6 lg:p-8'>
                <h3 className='mb-4 text-xl font-semibold text-gray-800 md:text-2xl lg:text-3xl'>
                  Calendar
                </h3>
                <Calendar
                  type='availability'
                  role='mentor'
                  availabilityEvents={availabilityEvents}
                  buttonOnClick={handleAddNew}
                  onSlotClick={handleSlotClick}
                />
              </div>

              {/* Request Meeting Sidebar */}
              {showRequestMeeting && (
                <div className='absolute top-0 right-0 h-full w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg md:static md:w-[350px] md:rounded-2xl md:p-6 lg:w-[400px]'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl'>
                      {selectedSlot && !isEditing
                        ? 'View Slot'
                        : selectedSlot && isEditing
                          ? 'Edit Slot'
                          : 'Add Time Slot'}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className='text-xl text-gray-500 hover:text-gray-700'
                    >
                      ✕
                    </button>
                  </div>

                  <div className='mt-3 flex items-start font-semibold md:mt-6'>
                    <button
                      onClick={() => setSlotType('fixed')}
                      disabled={!!(selectedSlot && !isEditing)}
                      className={`rounded-lg border border-blue-500 px-4 py-2 ${slotType === 'fixed' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} ${selectedSlot && !isEditing ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      Fixed
                    </button>
                    <button
                      onClick={() => setSlotType('flexible')}
                      disabled={!!(selectedSlot && !isEditing)}
                      className={`ml-6 rounded-lg border border-blue-500 px-4 py-2 ${slotType === 'flexible' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} ${selectedSlot && !isEditing ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      Flexible
                    </button>
                  </div>

                  <div className='mt-4 space-y-3 text-base text-gray-700 md:mt-4 text-md 3xl:text-lg'>
                    <div className='flex flex-col items-start'>
                      <label className='mb-2 block pt-3 font-medium'>Day</label>
                      <select
                        className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none'
                        value={formData.day}
                        onChange={(e) =>
                          setFormData({ ...formData, day: e.target.value })
                        }
                        disabled={!!(selectedSlot && !isEditing)}
                      >
                        <option value='' disabled>
                          Select Day
                        </option>
                        <option value='Monday'>Monday</option>
                        <option value='Tuesday'>Tuesday</option>
                        <option value='Wednesday'>Wednesday</option>
                        <option value='Thursday'>Thursday</option>
                        <option value='Friday'>Friday</option>
                        <option value='Saturday'>Saturday</option>
                        <option value='Sunday'>Sunday</option>
                      </select>
                    </div>
                    <div className='flex w-full flex-col'>
                      <label className='mb-2 block pt-3 font-medium text-left'>
                        Time
                      </label>
                      <div className='flex items-center gap-3'>
                        <input
                          type='time'
                          value={formData.startTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startTime: e.target.value,
                            })
                          }
                          disabled={!!(selectedSlot && !isEditing)}
                          className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none disabled:bg-gray-100'
                        />
                        <span className='text-gray-500'>to</span>
                        <input
                          type='time'
                          value={formData.endTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endTime: e.target.value,
                            })
                          }
                          disabled={!!(selectedSlot && !isEditing)}
                          className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none disabled:bg-gray-100'
                        />
                      </div>
                      {formData.startTime && formData.endTime && (
                        <div className='mt-2 text-sm text-gray-500'>
                          Duration:{' '}
                          {calculateDuration(
                            formData.startTime,
                            formData.endTime,
                          ).toFixed(4)}{' '}
                          hour(s)
                        </div>
                      )}
                    </div>
                    {slotType === 'flexible' && (
                      <div>
                        <div className='mb-2 block pt-3 text-left font-medium'>
                          Valid date range
                        </div>
                        <div className='flex items-center justify-between gap-4'>
                          <div className='block'>From</div>
                          <input
                            type='date'
                            value={formData.validFrom}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                validFrom: e.target.value,
                              })
                            }
                            disabled={!!(selectedSlot && !isEditing)}
                            className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none disabled:bg-gray-100'
                          />
                        </div>
                        <div className='mt-3 flex items-center justify-between gap-4'>
                          <div>to</div>
                          <input
                            type='date'
                            value={formData.validTo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                validTo: e.target.value,
                              })
                            }
                            disabled={!!(selectedSlot && !isEditing)}
                            className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-400 focus:outline-none disabled:bg-gray-100'
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Save Button (only show in edit or add mode) */}
                  {(!selectedSlot || isEditing) && (
                    <div className='mt-4 flex justify-end gap-2 md:mt-6'>
                      <button
                        onClick={handleCancel}
                        className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 md:px-6 text-md 3xl:text-lg'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className='rounded-lg bg-blue-500 px-4 py-2 text-base font-medium text-white hover:bg-blue-400 md:px-6 text-md 3xl:text-lg'
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {/* Action Buttons (View Mode) */}
                  {selectedSlot && !isEditing && (
                    <div className='mt-4 flex justify-end gap-2 md:mt-6'>
                      <button
                        onClick={handleEdit}
                        className='flex items-center gap-2 rounded-lg border border-blue-500 bg-blue-500 px-4 py-2 text-base font-medium text-white hover:bg-blue-600 md:px-6 md:text-lg'
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className='flex items-center gap-2 rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-base font-medium text-white hover:bg-red-600 md:px-6 md:text-lg'
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default MentorAvailability;
