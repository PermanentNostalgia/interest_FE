import { Link } from "react-router";

const tabs = [
  { label: "홈", to: "/" },
  { label: "배우기", to: "/units/unit1" },
  { label: "해보기", to: "/mock-invest" },
  { label: "내기록", to: "/records" },
];

export default function BottomTab({ active }) {
  return (
    <nav className="learn-tab">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          to={tab.to}
          className={tab.label === active ? "active" : ""}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}