import React, { Component } from "react";

import { PieChart, Pie, Tooltip, Sector } from "recharts";

const dataMain = [{ name: "Droobi", value: 100 }];

const data01 = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 }
];

const data02 = [
    { name: "A1", value: 100 },
    { name: "A2", value: 300 },
    { name: "B1", value: 100 },
    { name: "B2", value: 80 },
    { name: "B3", value: 40 },
    { name: "B4", value: 30 },
    { name: "B5", value: 50 },
    { name: "C1", value: 100 },
    { name: "C2", value: 200 },
    { name: "D1", value: 150 },
    { name: "D2", value: 50 }
];

const renderActiveShape = ({
                               cx,
                               cy,
                               midAngle,
                               innerRadius,
                               outerRadius,
                               startAngle,
                               endAngle,
                               fill,
                               payload,
                               percent,
                               value
                           }) => {
    const RADIAN = Math.PI / 180;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path
                d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                stroke={fill}
                fill="none"
            />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                textAnchor={textAnchor}
                fill="#333"
            >{`Value ${value}`}</text>
            <text
                x={ex + (cos >= 0 ? 1 : -1) * 12}
                y={ey}
                dy={18}
                textAnchor={textAnchor}
                fill="#999"
            >
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

export default class PieChartTwoLevel extends Component {
    state = {
        activeIndex: 0,
        list1: data01,
        list2: data02,
        isToggled: {
            status: false,
            value: []
        }
    };

    onPieEnter = (data, index) => {
        this.setState({ activeIndex: index });
    };

    onToggle = event => {
        if (this.state.isToggled.status) {
            this.setState({
                isToggled: { status: false, value: [] }
            });
            return;
        }
        const { payload } = event;
        const groupName = payload.name;
        const { list2 } = this.state;
        const newList = data02.filter(item => {
            const firstLetter = item.name.substr(0, 1);
            if (firstLetter === groupName.substr(groupName.length - 1)) {
                return item;
            }
        });
        this.setState({
            isToggled: { status: true, value: newList }
        });
    };

    render() {
        const { activeIndex, list1, list2 } = this.state;
        const { status, value } = this.state.isToggled;
        return (
            <PieChart width={700} height={400}>
                <text
                    x={305}
                    y={205}
                    fill="#000"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    Droobi
                </text>
                {status && (
                    <Pie
                        dataKey="value"
                        data={value}
                        cx={300}
                        cy={200}
                        innerRadius={40}
                        outerRadius={100}
                        fill="#8884d8"
                        onClick={this.onToggle}
                    />
                )}
                {!status && (
                    <Pie
                        dataKey="value"
                        data={list1}
                        cx={300}
                        cy={200}
                        innerRadius={40}
                        outerRadius={60}
                        fill="#8884d8"
                        onClick={this.onToggle}
                    />
                )}
                {!status && (
                    <Pie
                        dataKey="value"
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={list2}
                        cx={300}
                        cy={200}
                        innerRadius={70}
                        outerRadius={100}
                        fill="#82ca9d"
                        onMouseEnter={this.onPieEnter}
                    />
                )}
                <Tooltip />
            </PieChart>
        );
    }
}
