import styled from "styled-components";
import AvatarPlaceholder from "../assets/avatar-placeholder.png";

type ComponentProps = {
    as?: any,
    src?: string;
    width?: string,
    height?: string
}

function AvatarWithStatusSVG({src, as}: ComponentProps) {

    return (
        <Svg as={as} viewBox="0 0 40 32">
            <mask id="mask" width="32" height="32">
                <circle cx="16" cy="16" r="16" fill="white"/>
                <rect color="black" x="19" y="19" width="16" height="16" rx="8" ry="8"/>
            </mask>
            <foreignObject x="0" y="0" width="32" height="32" mask="url(#mask)">
                <div>
                    <Img src={src || AvatarPlaceholder}/>
                </div>
            </foreignObject>
            <svg x="14.5" y="17" width="25" height="15" viewBox="0 0 25 15">
                <mask id="mask2">
                    <rect x="7.5" y="5" width="10" height="10" rx="5" ry="5" fill="white"/>
                    <rect x="12.5" y="10" width="0" height="0" rx="0" ry="0" fill="black"/>
                    <Polygon points="-2.16506,-2.5 2.16506,0 -2.16506,2.5" fill="black"/>
                    <circle fill="black" cx="12.5" cy="10" r="0"/>
                </mask>
                <rect fill="hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)" width="25" height="15"
                      mask="url(#mask2)"/>
            </svg>
            <rect x="22" y="22" width="10" height="10" fill="transparent"/>
        </Svg>
    );

}

/* CSS */

const Svg = styled.svg`
  width: 40px;
  height: 32px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;

const Polygon = styled.polygon`
  transform: scale(0) translate(13.125 10);
  transform-origin: 13.125px 10px 0;
`;

/* CSS */

export default AvatarWithStatusSVG;