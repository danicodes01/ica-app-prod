import { LANGUAGE_VERSIONS } from '@/utils/constants/codeEditor/editor';
import { SupportedLanguage } from '@/types/base/editor';
import { useState } from 'react';

const languages = Object.entries(LANGUAGE_VERSIONS);

interface LanguageSelectorProps {
  language: SupportedLanguage;
  onSelect: (language: SupportedLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full bg-[#1E1E1E] text-gray-300 text-xs py-2 px-3 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 appearance-none cursor-pointer text-left'
      >
        {language} (
        {LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS]})
      </button>
      {isOpen && (
        <div className='absolute top-full left-0 w-full bg-[#1E1E1E] border border-gray-700 rounded mt-1 z-10'>
          {languages.map(([lang, version]) => (
            <button
              key={lang}
              onClick={() => {
                onSelect(lang as SupportedLanguage);
                setIsOpen(false);
              }}
              className='w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-[#2C2C2C] focus:outline-none focus:bg-[#2C2C2C]'
            >
              {lang} ({version})
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
