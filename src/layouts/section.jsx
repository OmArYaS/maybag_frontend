import Category from "../components/category";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../service/queryfn";

export default function Section() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategory(),
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="section flex flex-col justify-center w-full">
      <div className="relative">
        <div className="section__nav flex items-center justify-center gap-4 py-4 px-2 w-full overflow-x-auto scrollbar-hide">
          {data.map((item, index) => (
            <NavLink
              to={`/#${item.name}`}
              key={index}
              className={({ isActive }) => `
                section__nav__category
                px-6 py-2.5
                text-sm font-medium
                rounded-xl
                whitespace-nowrap
                transition-all duration-300
                ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }
              `}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
        {/* Gradient fade effect for scroll */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
      </div>
      <div className="section__categories flex flex-col justify-center items-center w-full gap-20">
        {data.map((item, index) => (
          <Category
            key={index}
            category={item._id}
            name={item.name}
            color={index % 2 ? "bg-secondary" : "bg-gray-100"}
          />
        ))}
      </div>
    </div>
  );
}

<style jsx>{`
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`}</style>;
