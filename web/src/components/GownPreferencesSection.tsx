import { FormData, REQUIRED_OUTFIT_OPTIONS, PREFERRED_OUTFIT_OPTIONS, PREFERRED_STYLE_OPTIONS, PREFERRED_NECKLINE_OPTIONS } from '../types';
import Mermaid from '../assets/images/Mermaid.jpg';
import Ball from '../assets/images/Ball.jpg';
import ALine from '../assets/images/A-Line.jpg';
import ModifiedLine from '../assets/images/Modified-Line.jpg';
import Column from '../assets/images/Column.jpg';
import Trumpet from '../assets/images/Trumpet.jpg';
import NoPreference from '../assets/images/No Preference.jpg';
import Sweetheart from '../assets/images/Sweetheart.png';
import VNeck from '../assets/images/V-Neck.png';
import OffShoulder from '../assets/images/Off-Shoulder.png';
import StraightAcross from '../assets/images/Straight Across.png';
import Illusion from '../assets/images/Illusion.png';
import Bateau from '../assets/images/Bateau.png';

interface GownPreferencesSectionProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

const outfitImages: Record<string, string> = {
  'Mermaid': Mermaid,
  'Ball': Ball,
  'A-Line': ALine,
  'Modified-Line': ModifiedLine,
  'Column': Column,
  'Trumpet': Trumpet,
  'No Preference': NoPreference,
};

const necklineImages: Record<string, string> = {
  'Sweetheart': Sweetheart,
  'V-Neck': VNeck,
  'Off-Shoulder': OffShoulder,
  'Straight Across': StraightAcross,
  'Illusion': Illusion,
  'Bateau_Boat_Neck': Bateau,
};

function GownPreferencesSection({ formData, updateField }: GownPreferencesSectionProps) {
  const handleCheckboxChange = (
    field: 'requiredoutfit' | 'preferredoutfit' | 'preferredstyle' | 'preferredNeckline',
    value: string,
    checked: boolean
  ) => {
    const current = formData[field] as string[];
    if (checked) {
      updateField(field, [...current, value] as FormData[typeof field]);
    } else {
      updateField(field, current.filter(item => item !== value) as FormData[typeof field]);
    }
  };

  return (
    <>
      <div className="border-b-2 border-gray-800 text-center font-bold p-2">
        Gown Preferences
      </div>

      <div className="flex">
        <div className="w-2/3 border-r-2 border-gray-800 pb-2 px-2">
          <div className="m-1 my-2">Required Outfit (Please Tick):</div>
          <div className="flex w-full">
            {REQUIRED_OUTFIT_OPTIONS.map((option, index) => (
              <label
                key={option}
                className="flex mx-1 flex-1 items-center"
                htmlFor={`requiredoutfit_${index}`}
              >
                <span className="mx-1 w-1/2 align-middle">{option}</span>
                <input
                  id={`requiredoutfit_${index}`}
                  type="checkbox"
                  className="w-1/4 align-middle"
                  checked={formData.requiredoutfit.includes(option)}
                  onChange={(e) => handleCheckboxChange('requiredoutfit', option, e.target.checked)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="w-1/3 pb-2 px-2">
          <div className="m-1 my-2">No. of gowns required:</div>
          <div className="flex justify-center items-center w-full">
            <input
              id="noofgowns"
              type="number"
              className="text-center border-0 w-full focus:outline-none"
              value={formData.noofgowns}
              onChange={(e) => updateField('noofgowns', e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="w-full border-b-2 border-gray-800 px-2 pb-2">
        <div className="m-1 my-2">Preferred Silhouette (Please Tick):</div>
        <div className="flex w-full flex-wrap">
          {PREFERRED_OUTFIT_OPTIONS.map((option, index) => (
            <div
              key={option}
              className="flex flex-col w-1/4 p-0 my-3 items-center"
            >
              <div className="flex my-1 w-full justify-center items-center">
                <span className="mx-2 align-middle">{option}</span>
                <input
                  id={`preferredoutfit_${index}`}
                  type="checkbox"
                  className="align-middle"
                  checked={formData.preferredoutfit.includes(option)}
                  onChange={(e) => handleCheckboxChange('preferredoutfit', option, e.target.checked)}
                />
              </div>
              {outfitImages[option] && (
                <img
                  src={outfitImages[option]}
                  alt={option}
                  className="w-[85%]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="my-2 flex w-full">
          <span className="self-center" style={{ verticalAlign: 'middle' }}>
            Others:
          </span>
          <input
            id="preferredoutOthers"
            type="text"
            className="flex-1 m-1 border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.preferredoutOthers}
            onChange={(e) => updateField('preferredoutOthers', e.target.value)}
          />
        </div>
      </div>

      <div className="w-full border-b-2 border-gray-800 px-2 pb-2">
        <div className="m-1 my-2">Preferred Details:</div>
        <div className="flex w-full">
          {PREFERRED_STYLE_OPTIONS.map((option, index) => (
            <label
              key={option}
              className="flex mx-1 flex-1 justify-center items-center"
              htmlFor={`preferredstyle_${index}`}
            >
              <span className="mx-2 align-middle">{option}</span>
              <input
                id={`preferredstyle_${index}`}
                type="checkbox"
                className="align-middle"
                checked={formData.preferredstyle.includes(option)}
                onChange={(e) => handleCheckboxChange('preferredstyle', option, e.target.checked)}
              />
            </label>
          ))}
        </div>

        <div className="my-2 flex w-full">
          <span className="self-center" style={{ verticalAlign: 'middle' }}>
            Others:
          </span>
          <input
            id="preferredstyleOthers"
            type="text"
            className="flex-1 m-1 border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.preferredstyleOthers}
            onChange={(e) => updateField('preferredstyleOthers', e.target.value)}
          />
        </div>
      </div>

      <div className="w-full px-2 pb-2">
        <div className="m-1 my-2">Preferred Neckline:</div>
        <div className="flex w-full flex-wrap">
          {PREFERRED_NECKLINE_OPTIONS.map((option, index) => (
            <div
              key={option}
              className="flex flex-col w-1/4 p-0 my-3 items-center"
            >
              <div className="flex my-1 w-full justify-center items-center">
                <span className="mx-2 align-middle">
                  {option === 'Bateau_Boat_Neck' ? 'Bateau' : option}
                </span>
                <input
                  id={`preferredNeckline_${index}`}
                  type="checkbox"
                  className="align-middle"
                  checked={formData.preferredNeckline.includes(option)}
                  onChange={(e) => handleCheckboxChange('preferredNeckline', option, e.target.checked)}
                />
              </div>
              {necklineImages[option] && (
                <img
                  src={necklineImages[option]}
                  alt={option}
                  className="h-[75%]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="my-2 flex w-full">
          <span className="self-center" style={{ verticalAlign: 'middle' }}>
            Others:
          </span>
          <input
            id="preferredNeckOthers"
            type="text"
            className="flex-1 m-1 border-0 border-b border-gray-500 focus:outline-none focus:border-gray-800"
            value={formData.preferredNeckOthers}
            onChange={(e) => updateField('preferredNeckOthers', e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

export default GownPreferencesSection;

