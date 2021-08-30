import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {EXIT_FULL_SCREEN_MODE} from "../constants";

export function useWindowResize() {
    const layout = useSelector(state => state.layout);
    const [windowSize, setWindowSize] = useState({viewportWidth: undefined, viewportHeight: undefined});

    function getDimensions(mode) {
        const documentWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        const documentHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        const viewportWidth = mode === EXIT_FULL_SCREEN_MODE ? documentWidth - (documentWidth * 25) / 100 : documentWidth;
        const viewportHeight = mode === EXIT_FULL_SCREEN_MODE ? documentHeight - 128 : documentHeight - 64;
        return {viewportWidth: viewportWidth, viewportHeight: viewportWidth * 9 / 16};
    }

    useEffect(() => {
        setWindowSize(getDimensions(layout.mode))
    }, [layout]);

    useEffect(() => {
        function handleResize() {
            setWindowSize(getDimensions(layout.mode))
        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
}
