interface InputProps {
  label?: string;
}
export default function Input(props: InputProps) {
  return (
    <div
      className="h-[24px] w-[86.5px] rounded-sm bg-[#383838] flex "
      style={{ fontFamily: "Inter" }}
    >
      <div className="w-[23px] text-xs text-center content-center text-[#ffffffb2]">
        {props.label}
      </div>
      <input
        className="w-[63.5px] text-xs content-center text-white font-[450]"
        type="number"
      ></input>
    </div>
  );
}
