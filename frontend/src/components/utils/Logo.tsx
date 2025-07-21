import { NavLink } from "react-router-dom";

const Logo: React.FC = () => {
    return (
        <section className="flex gap-2 cursor-pointer">
            <img
                src="/logo-red.png"
                alt="logo-img"
                className="h-[24px]"
            />
            <h2 className="font-bold max-w-[100px] cursor-pointer text-red-600">
                <NavLink to="/home">Geodent</NavLink>
            </h2>
        </section>
    )
};

export default Logo;
