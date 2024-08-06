import * as React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import "../../CSS/KeyColor.css";

const NivoBar = ({ regionScores }) => {
    const handle = {
        barClick: (data) => {
            console.log(data);
        },

        legendClick: (data) => {
            console.log(data);
        },
    };

    // Define region names and colors
    const regionNames = regionScores.map((_, index) => `${index + 1}지역`);
    const regionColors = ['#FF5C5C', '#FFDA55', '#B758E3', '#2B78C0'];

    // Map regionScores to data for the chart
    const data = regionScores.map((region, index) => ({
        faction: `${index + 1}지역`,
        기여도: region.score,
        color: regionColors[index % regionColors.length] // Use modulo to cycle through colors if there are more than 4 regions
    }));

    return (
        // chart height이 100%이기 때문이 chart를 덮는 마크업 요소에 height 설정
        <div style={{ width: "400px", height: "400px" }}>
            <ResponsiveBar
                /**
                 * chart에 사용될 데이터
                 */
                data={data}
                /**
                 * chart에 보여질 데이터 key (측정되는 값)
                 */
                keys={['기여도']} 
                /**
                 * keys들을 그룹화하는 index key (분류하는 값)
                 */
                indexBy="faction"
                /**
                 * chart margin
                 */
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                /**
                 * chart padding (bar간 간격)
                 */
                padding={0.3}
                /**
                 * chart 색상
                 */
                colors={({ data }) => data.color}
                /**
                 * color 적용 방식
                 */
                colorBy="indexValue"
                theme={{
                    /**
                     * label style (bar에 표현되는 글씨)
                     */
                    labels: {
                        text: {
                            fontSize: 10,
                            fill: '#000000',
                        },
                    },
                    /**
                     * legend style (default로 우측 하단에 있는 색상별 key 표시)
                     */
                    legends: {
                        text: {
                            fontSize: 10,
                            fontFamily: "inherit",
                            fill: '#3E3A3A',
                            fontWeight: "bold"
                        },
                    },
                    axis: {
                        /**
                         * axis legend style (bottom, left에 있는 글씨)
                         */
                        legend: {
                            text: {
                                fontSize: 20,
                                fontFamily: "inherit",
                                fill: '#3E3A3A',
                            },
                        },
                        /**
                         * axis ticks style (bottom, left에 있는 값)
                         */
                        ticks: {
                            text: {
                                fontSize: 14,
                                fontWeight: "bold",
                                fontFamily: "inherit",
                                fill: '#3E3A3A',
                            },
                        },
                    },
                }}
                /**
                 * axis bottom 설정
                 */
                labelSkipWidth={36}
                /**
                 * label 안보이게 할 기준 height
                 */
                labelSkipHeight={12}
                /**
                 * bar 클릭 이벤트
                 */
                onClick={handle.barClick}
                /**
                 * legend 설정
                 */
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 4,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                        data: regionNames.map((name, index) => ({
                            id: name,
                            color: regionColors[index % regionColors.length]
                        })),
                        data: regionScores.map((region, index) => ({
                            label: region.regionName,
                            color: regionColors[index % regionColors.length]
                        })),
                        onClick: handle.legendClick, 
                    },
                ]}
            />
        </div>
    );
};

export default NivoBar;
