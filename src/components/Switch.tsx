import React from "react";

type SwitchProps = {
  value: boolean;
  handleSwitch: () => void;
};

const Switch = (props: SwitchProps) => {
  const { value, handleSwitch } = props;
  return (
    <label className="group relative flex items-center space-x-2 text-xl">
      <input
        type="checkbox"
        className="peer absolute left-1/2 h-auto w-full -translate-x-1/2 appearance-none rounded-md"
        checked={value}
        onChange={handleSwitch}
      />
      <span className="ml-4 flex h-8 w-16 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-md after:duration-300 group-hover:after:translate-x-1 peer-checked:bg-green-400 peer-checked:after:translate-x-6"></span>
    </label>
  );
};

export default Switch;
