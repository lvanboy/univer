type BarProps = {
    list: Array<Record<string, string>>;
    img: string;
    onClick?: (item: {}, index: number) => void;
};

export const DataBar = (props: BarProps) => {
    const { list, img, onClick } = props;
    const background = `url(${img}) no-repeat`;

    let handleClick = (item: {}, index: number) => {
        onClick?.call(this, item, index);
    };

    return (
        <div style="display: flex;">
            {list.map((item, index) => (
                <div onClick={() => handleClick(item, index)} style={{ width: '28px', height: '26px', background, backgroundPosition: `${item.x} ${item.y}` }}></div>
            ))}
        </div>
    );
};
