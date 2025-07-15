import { useNavigate } from "react-router-dom";

/**
 * @func UseRedirect A function that provides a navigator function
 * The returned function takes in a destination and passees it to
 * the react's useNavigate hook
 *
 * @returns {function (dest: string | number)}
 * a function that that returns void
 * @example
 * import UseRedirect from "@/hooks/index"
 * ...
 * const redirect = UseRedirect();
 * redirect(mypath);
 * redirect(-1)
 */
const UseRedirect = () => {
  const navigate = useNavigate();
  const navigator = (dest: string | number) => {
    if (typeof dest === "number") {
      navigate(dest as number);
    } else {
      navigate(dest as string);
    }
  };
  return navigator;
};

export { UseRedirect };
