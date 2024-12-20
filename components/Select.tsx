const Select = ({
  labelslist,
  value,
  borderColor,
  selectedBorderColor,
  onChangeHere,
  multi,
}: {
  labelslist: { label: string; key: string }[];
  value: string[] | string;
  borderColor: string;
  selectedBorderColor: string;
  onChangeHere: (item: string) => void;
  multi?: boolean;
}) => {
  return (
    <div className="flex flex-wrap justify-start text-sm gap-2">
      {labelslist.map((sub) => {
        let isSelected: boolean;
        if (multi) isSelected = value.includes(sub.key);
        else isSelected = value === sub.key;
        return (
          <p
            onClick={() => onChangeHere(sub.key)}
            key={sub.key}
            className={`px-4 py-2 border rounded-md cursor-pointer roll--hover ${
              isSelected ? borderColor + " border-2" : selectedBorderColor
            }`}
          >
            {sub.label}
          </p>
        );
      })}
    </div>
  );
};
export default Select;
