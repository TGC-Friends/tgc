import { FormData } from '../types';

interface PersonalInfoSectionProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

function PersonalInfoSection({ formData, updateField }: PersonalInfoSectionProps) {
  return (
    <>
      <div className="border-b-2 border-gray-800 text-center font-bold p-2">
        Personal Information
      </div>

      <div className="flex border-b-2 border-gray-800 pb-3">
        <span className="w-1/2 px-2">
          <div className="m-1">Name of Bride:</div>
          <input
            id="bridename"
            type="text"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.bridename}
            onChange={(e) => updateField('bridename', e.target.value)}
          />
        </span>
        <span className="w-1/2 px-2">
          <div className="m-1">Name of Groom:</div>
          <input
            id="groomname"
            type="text"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.groomname}
            onChange={(e) => updateField('groomname', e.target.value)}
          />
        </span>
      </div>

      <div className="flex">
        <div className="w-1/4 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Phone:</div>
          <input
            id="phonenum"
            type="tel"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.phonenum}
            onChange={(e) => updateField('phonenum', e.target.value)}
          />
        </div>

        <div className="w-1/4 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1">Email:</div>
          <input
            id="emailfield"
            type="email"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.emailfield}
            onChange={(e) => updateField('emailfield', e.target.value)}
          />
        </div>

        <div className="w-1/2 pb-2 px-2">
          <div className="m-1">How did you hear of us?</div>
          <input
            id="howdidyouhear"
            type="text"
            className="m-1 w-full border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.howdidyouhear}
            onChange={(e) => updateField('howdidyouhear', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default PersonalInfoSection;

