import { useRef } from "react";

export default function Input({ type, ...props }) {
  const ref = useRef();

  const handleClick = () => {
    if (type === "date" && ref.current?.showPicker) {
      ref.current.showPicker(); // ✅ opens calendar
    }
  };

  return (
    <div onClick={handleClick} className="w-full cursor-pointer">
      <input
        ref={ref}
        type={type}
        {...props}
        className="
w-full min-w-0 px-3 py-2 
rounded-xl 
bg-white/5 border border-white/10 
text-sm
focus:outline-none focus:ring-2 focus:ring-indigo-500 
transition
"
      />
    </div>
  );
}