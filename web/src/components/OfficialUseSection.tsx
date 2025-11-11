import { FormData, ATTENDANTS } from '../types';

interface OfficialUseSectionProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

function OfficialUseSection({ formData, updateField }: OfficialUseSectionProps) {
  return (
    <>
      <hr className="mt-5" />
      <div className="w-full text-center">----- For Official Use -----</div>
      <hr className="mt-3" />
      <div className="w-full flex justify-end mb-2 pr-2">
        <select
          id="attendant"
          className="border border-gray-400 bg-white"
          value={formData.attendant}
          onChange={(e) => updateField('attendant', e.target.value as FormData['attendant'])}
        >
          {ATTENDANTS.map((attendant) => (
            <option key={attendant} value={attendant}>
              {attendant}
            </option>
          ))}
        </select>
      </div>

      <textarea
        id="additionalnotes"
        className="m-2 w-[98%] border border-gray-300 focus:outline-none focus:border-gray-500"
        rows={5}
        cols={20}
        value={formData.additionalnotes}
        onChange={(e) => updateField('additionalnotes', e.target.value)}
        placeholder="Additional Notes"
      />
    </>
  );
}

export default OfficialUseSection;

