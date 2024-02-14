function Image ({src, ...rest}) {
    src = src && src.includes('https://')
    ? src
    : `http://localhost:3030/${src}`
    return (
        <img src={src} {...rest} alt={''}/>
    );
};

export default Image