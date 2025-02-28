import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Dropdown = ({ options, onChange, disabled }: DropdownProps): JSX.Element => {
  return (
    <div className="dropdown">
      <select
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="dropdownSelect"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="dropdownArrow" />
    </div>
  );
};

export default Dropdown;
