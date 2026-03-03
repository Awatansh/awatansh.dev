import { jsx as _jsx } from "react/jsx-runtime";
import { Terminal } from "../components/Terminal";
const HomePage = () => {
    return (_jsx("div", { className: "home-page", children: _jsx("div", { className: "home-content", children: _jsx(Terminal, {}) }) }));
};
export default HomePage;
