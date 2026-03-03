import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
const YT_MUSIC_LINK = (import.meta.env.YT_MUSIC_LINK || "").trim();
const extractVideoId = (value) => {
    if (!value)
        return null;
    const trimmed = value.trim();
    if (!trimmed)
        return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }
    try {
        const url = new URL(trimmed);
        const host = url.hostname.replace(/^www\./, "").toLowerCase();
        if (host === "youtu.be") {
            const id = url.pathname.replace(/^\//, "").split("/")[0];
            return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }
        if (host.endsWith("youtube.com")) {
            const queryId = url.searchParams.get("v");
            if (queryId && /^[a-zA-Z0-9_-]{11}$/.test(queryId)) {
                return queryId;
            }
            const parts = url.pathname.split("/").filter(Boolean);
            const lastPart = parts[parts.length - 1] || "";
            if (["embed", "shorts", "live"].includes(parts[0]) && /^[a-zA-Z0-9_-]{11}$/.test(lastPart)) {
                return lastPart;
            }
        }
    }
    catch {
        return null;
    }
    return null;
};
const VIDEO_ID = extractVideoId(YT_MUSIC_LINK);
const BackgroundAudioPlayer = () => {
    const playerRef = useRef(null);
    const mountRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    useEffect(() => {
        const win = window;
        const initializePlayer = () => {
            if (!mountRef.current || !win.YT?.Player || playerRef.current || !VIDEO_ID) {
                return;
            }
            playerRef.current = new win.YT.Player(mountRef.current, {
                width: "1",
                height: "1",
                videoId: VIDEO_ID,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    loop: 1,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    start: 0,
                    playlist: VIDEO_ID,
                },
                events: {
                    onReady: (event) => {
                        event.target.seekTo(0, true);
                        event.target.setVolume(volume);
                        event.target.mute();
                        event.target.stopVideo();
                        setIsPlaying(false);
                    },
                    onStateChange: (event) => {
                        const state = event?.data;
                        if (state === 1 || state === 3) {
                            setIsPlaying(true);
                            return;
                        }
                        if (state === 2 || state === 0 || state === 5) {
                            setIsPlaying(false);
                        }
                    },
                },
            });
        };
        const ensureYouTubeApi = () => {
            if (win.YT?.Player) {
                initializePlayer();
                return;
            }
            const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
            if (!existingScript) {
                const script = document.createElement("script");
                script.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(script);
            }
            const prevReady = win.onYouTubeIframeAPIReady;
            win.onYouTubeIframeAPIReady = () => {
                if (typeof prevReady === "function") {
                    prevReady();
                }
                initializePlayer();
            };
        };
        ensureYouTubeApi();
        return () => {
            if (playerRef.current?.destroy) {
                playerRef.current.destroy();
            }
            playerRef.current = null;
        };
    }, []);
    const togglePlayPause = () => {
        const player = playerRef.current;
        if (!player)
            return;
        if (!isPlaying) {
            player.unMute();
            player.setVolume(volume);
            player.playVideo();
            setIsPlaying(true);
            return;
        }
        player.pauseVideo();
        setIsPlaying(false);
    };
    const handleVolumeChange = (event) => {
        const player = playerRef.current;
        const nextVolume = Number(event.target.value);
        setVolume(nextVolume);
        if (!player)
            return;
        player.setVolume(nextVolume);
        if (nextVolume <= 0) {
            player.mute();
            return;
        }
        if (isPlaying) {
            player.unMute();
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-audio-player-host", ref: mountRef, "aria-hidden": "true" }), _jsxs("div", { className: "bg-audio-control", children: [_jsx("div", { className: "bg-audio-volume-wrap", children: _jsx("input", { className: "bg-audio-volume", type: "range", min: 0, max: 100, step: 1, value: volume, "aria-label": "Background music volume", title: "Volume", onChange: handleVolumeChange }) }), _jsx("button", { type: "button", className: "bg-audio-toggle", "aria-label": isPlaying ? "Pause background music" : "Play background music", title: isPlaying ? "Pause" : "Play", onClick: togglePlayPause, children: isPlaying ? "🔊" : "🔇" })] })] }));
};
export default BackgroundAudioPlayer;
