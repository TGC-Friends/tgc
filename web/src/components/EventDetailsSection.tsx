import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormData, EVENT_TYPES } from '../types';
import { format } from 'date-fns';

interface EventDetailsSectionProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

function EventDetailsSection({ formData, updateField }: EventDetailsSectionProps) {
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
      // Try parsing DD-MM-YYYY format
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
      return new Date(dateString);
    } catch {
      return null;
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'dd-MM-yyyy');
  };

  const handleDateChange = (field: 'eventdate1' | 'eventdate2' | 'eventdate3', date: Date | null) => {
    updateField(field, formatDate(date));
  };

  return (
    <>
      <div className="border-b-2 border-gray-800 text-center font-bold p-2">
        Event Details
      </div>

      {/* Event 1 */}
      <div className="flex">
        <div className="w-1/4 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Event Date</div>
          <DatePicker
            id="eventdate1"
            selected={parseDate(formData.eventdate1)}
            onChange={(date) => handleDateChange('eventdate1', date)}
            dateFormat="dd-MM-yyyy"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800 h-10"
            placeholderText="Select date"
          />
        </div>

        <div className="w-1/3 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Event Type</div>
          <select
            id="eventtype1"
            className="w-full h-10 border border-gray-400 bg-white"
            value={formData.eventtype1}
            onChange={(e) => updateField('eventtype1', e.target.value as FormData['eventtype1'])}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="w-5/12 pb-2 px-2">
          <div className="m-1">Event Venue</div>
          <input
            id="eventvenue1"
            type="text"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.eventvenue1}
            onChange={(e) => updateField('eventvenue1', e.target.value)}
          />
        </div>
      </div>

      {/* Event 2 */}
      <div className="flex">
        <div className="w-1/4 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Event Date</div>
          <DatePicker
            id="eventdate2"
            selected={parseDate(formData.eventdate2)}
            onChange={(date) => handleDateChange('eventdate2', date)}
            dateFormat="dd-MM-yyyy"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800 h-10"
            placeholderText="Select date"
          />
        </div>

        <div className="w-1/3 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Event Type</div>
          <select
            id="eventtype2"
            className="w-full h-10 border border-gray-400 bg-white"
            value={formData.eventtype2}
            onChange={(e) => updateField('eventtype2', e.target.value as FormData['eventtype2'])}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="w-5/12 pb-2 px-2">
          <div className="m-1">Event Venue</div>
          <input
            id="eventvenue2"
            type="text"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.eventvenue2}
            onChange={(e) => updateField('eventvenue2', e.target.value)}
          />
        </div>
      </div>

      {/* Event 3 */}
      <div className="flex">
        <div className="w-1/4 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Event Date</div>
          <DatePicker
            id="eventdate3"
            selected={parseDate(formData.eventdate3)}
            onChange={(date) => handleDateChange('eventdate3', date)}
            dateFormat="dd-MM-yyyy"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800 h-10"
            placeholderText="Select date"
          />
        </div>

        <div className="w-1/3 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Event Type</div>
          <select
            id="eventtype3"
            className="w-full h-10 border border-gray-400 bg-white"
            value={formData.eventtype3}
            onChange={(e) => updateField('eventtype3', e.target.value as FormData['eventtype3'])}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="w-5/12 pb-2 px-2">
          <div className="m-1">Event Venue</div>
          <input
            id="eventvenue3"
            type="text"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.eventvenue3}
            onChange={(e) => updateField('eventvenue3', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default EventDetailsSection;

