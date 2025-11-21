import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (query: string) => void;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      defaultValue={""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search posts"
      className={css.input}
    />
  );
}
