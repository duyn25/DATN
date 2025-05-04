import { useState } from "react";

const megaMenuData = [
  {
    category: "Tivi",
    specs: {
      "Kích thước": ["32 inch", "43 inch", "55 inch"],
      "Độ phân giải": ["4K", "Full HD", "HD"],
      "Loại Tivi": ["Smart", "Android", "OLED"],
    },
  },
  {
    category: "Tủ lạnh",
    specs: {
      "Dung tích": ["<150L", "150-300L", ">300L"],
      "Loại tủ": ["Ngăn đá trên", "Ngăn đá dưới", "Side by Side"],
    },
  },
];

export default function MegaMenu() {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <div className="flex bg-white border shadow-xl w-[900px] h-[400px]">
      {/* Cột trái: Danh mục chính */}
      <ul className="w-[250px] bg-gray-100">
        {megaMenuData.map((item, index) => (
          <li
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            className={`p-4 text-sm cursor-pointer hover:bg-white ${
              hoveredIndex === index ? "bg-white text-blue-600 font-semibold" : ""
            }`}
          >
            {item.category}
          </li>
        ))}
      </ul>

      {/* Cột phải: Thông số kỹ thuật */}
      <div className="flex-1 p-6 overflow-y-auto">
        {hoveredIndex !== null && (
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(megaMenuData[hoveredIndex].specs).map(([groupTitle, values], i) => (
              <div key={i}>
                <div className="font-bold mb-2 text-gray-700">{groupTitle}</div>
                <div className="flex flex-wrap gap-2">
                  {values.map((value, j) => (
                    <span
                      key={j}
                      className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
