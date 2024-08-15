import * as React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import "../../CSS/KeyColor.css";

const NivoBar = ({ regionScores }) => {
    const handle = {
        barClick: (data) => {
        },

        legendClick: (data) => {
        },
    };

    // Define region colors
    const regionColors = ['#FF5C5C', '#FFDA55', '#B758E3', '#2B78C0'];

    // Map regionScores to data for the chart
    const data = regionScores.map((region, index) => ({
        regionName: region.regionName,
        기여도: region.score,
        color: regionColors[index % regionColors.length]
    }));

    return (
        <div style={{ width: "400px", height: "400px" }}>
            <ResponsiveBar
                data={data}
                keys={['기여도']}
                indexBy="regionName"  // Use regionName here instead of faction
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                colors={({ data }) => data.color}
                colorBy="indexValue"
                theme={{
                    labels: {
                        text: {
                            fontSize: 10,
                            fill: '#000000',
                        },
                    },
                    legends: {
                        text: {
                            fontSize: 10,
                            fontFamily: "inherit",
                            fill: '#3E3A3A',
                            fontWeight: "bold"
                        },
                    },
                    axis: {
                        legend: {
                            text: {
                                fontSize: 20,
                                fontFamily: "inherit",
                                fill: '#3E3A3A',
                            },
                        },
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
                labelSkipWidth={36}
                labelSkipHeight={12}
                onClick={handle.barClick}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 0,
                    renderTick: () => null
                }}
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
