import React, { useEffect, useState } from 'react';

const SnowEffect = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        const generateSnowflakes = () => {
            const flakes = [];
            const snowflakeSymbols = ['✻', '✼', '❉', '❄', '❅', '❆', '✿'];
            const numFlakes = 80;

            for (let i = 0; i < numFlakes; i++) {
                flakes.push({
                    id: i,
                    left: Math.random() * 140,
                    fontSize: Math.random() * 10 + 7,
                    opacity: Math.random() * 0.5 + 0.3,
                    duration: Math.random() * 12 + 8,
                    delay: Math.random() * 8,
                    symbol: snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)],
                    blur: Math.random() < 0.5 ? 0.5 : 0,
                    sway: Math.random() * 30 + 10,
                    rotate: Math.random() * 360,
                    animationName: `snowfall-${i % 4}`
                });
            }
            setSnowflakes(flakes);
        };

        generateSnowflakes();
    }, []);

    return (
        <>
            <style>
                {`
                    @keyframes snowfall-0 {
                        0% {
                            transform: translateY(-30px) translateX(0);
                        }
                        50% {
                            transform: translateY(50vh) translateX(var(--sway));
                        }
                        100% {
                            transform: translateY(100vh) translateX(0) rotate(var(--rotate));
                        }
                    }
                    @keyframes snowfall-1 {
                        0% {
                            transform: translateY(-30px) translateX(0);
                        }
                        50% {
                            transform: translateY(50vh) translateX(calc(var(--sway) * -1));
                        }
                        100% {
                            transform: translateY(100vh) translateX(0) rotate(var(--rotate));
                        }
                    }
                    @keyframes snowfall-2 {
                        0% {
                            transform: translateY(-30px) translateX(0) rotate(0deg);
                        }
                        33% {
                            transform: translateY(33vh) translateX(var(--sway)) rotate(120deg);
                        }
                        66% {
                            transform: translateY(66vh) translateX(calc(var(--sway) * -0.5)) rotate(240deg);
                        }
                        100% {
                            transform: translateY(100vh) translateX(0) rotate(var(--rotate));
                        }
                    }
                    @keyframes snowfall-3 {
                        0% {
                            transform: translateY(-30px) translateX(0) rotate(0deg);
                        }
                        25% {
                            transform: translateY(25vh) translateX(calc(var(--sway) * -1)) rotate(90deg);
                        }
                        50% {
                            transform: translateY(50vh) translateX(var(--sway)) rotate(180deg);
                        }
                        75% {
                            transform: translateY(75vh) translateX(calc(var(--sway) * -0.5)) rotate(270deg);
                        }
                        100% {
                            transform: translateY(100vh) translateX(0) rotate(var(--rotate));
                        }
                    }
                `}
            </style>
            <div 
                aria-hidden="true" 
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    zIndex: 9997
                }}
            >
                {snowflakes.map((flake) => (
                    <div
                        key={flake.id}
                        className="snowflake"
                        style={{
                            position: 'fixed',
                            top: '-30px',
                            left: `${flake.left}%`,
                            fontSize: `${flake.fontSize}px`,
                            color: 'white',
                            opacity: flake.opacity,
                            zIndex: 9997,
                            pointerEvents: 'none',
                            willChange: 'transform',
                            animation: `${flake.duration}s linear ${flake.delay}s infinite normal none running ${flake.animationName}`,
                            textShadow: 'rgba(255, 255, 255, 0.6) 0px 0px 3px',
                            filter: `blur(${flake.blur}px)`,
                            '--sway': `${flake.sway}px`,
                            '--rotate': `${flake.rotate}deg`
                        }}
                    >
                        {flake.symbol}
                    </div>
                ))}
            </div>
        </>
    );
};

export default SnowEffect;
