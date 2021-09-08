import styled from "styled-components";
import AvatarPlaceholder from "../assets/avatar-placeholder.png";

type ComponentProps = {
    src?: string;
    width?: string,
    height?: string
}

function AvatarSVG({src, width, height}: ComponentProps) {

    return (
        <svg width={width || "40"} height={height || "32"} viewBox="0 0 40 32">
            <mask id="b46f4c51-5fe0-4c9c-b8cd-f0a52ffb1d89" width="32" height="32">
                <circle cx="16" cy="16" r="16" fill="white"/>
                <rect color="black" x="19" y="19" width="16" height="16" rx="8" ry="8"/>
            </mask>
            <foreignObject x="0" y="0" width="32" height="32" mask="url(#b46f4c51-5fe0-4c9c-b8cd-f0a52ffb1d89)">
                <div>
                    <Img
                        src={src || AvatarPlaceholder}
                        alt=" "/>
                </div>
            </foreignObject>
            <svg x="14.5" y="17" width="25" height="15" viewBox="0 0 25 15">
                <mask id="a457e641-f9e8-4b69-afd0-cc59a873d29b">
                    <rect x="7.5" y="5" width="10" height="10" rx="5" ry="5" fill="white"/>
                    <rect x="12.5" y="10" width="0" height="0" rx="0" ry="0" fill="black"/>
                    <Polygon points="-2.16506,-2.5 2.16506,0 -2.16506,2.5" fill="black"/>
                    <circle fill="black" cx="12.5" cy="10" r="0"/>
                </mask>
                <rect fill="hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)" width="25" height="15"
                      mask="url(#a457e641-f9e8-4b69-afd0-cc59a873d29b)"/>
            </svg>
            <rect x="22" y="22" width="10" height="10" fill="transparent"/>
        </svg>
    );

}

/* CSS */

const Polygon = styled.polygon`
  transform: scale(0) translate(13.125 10);
  transform-origin: 13.125px 10px 0;
`

const Img = styled.img`
  width: 100%;
  height: 100%;
`

/* CSS */

export default AvatarSVG;