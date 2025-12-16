import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Terminal } from "../components/Terminal";
import { useRippleBackground } from "../hooks/useRippleBackground";
const HomePage = () => {
    const rippleRef = useRippleBackground();
    return (_jsxs("div", { className: "home-page", children: [_jsx("div", { className: "ripple-background", ref: rippleRef }), _jsx("div", { className: "home-content", children: _jsx(Terminal, {}) })] }));
};
export default HomePage;
