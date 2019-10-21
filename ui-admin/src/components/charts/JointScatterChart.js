import React, { PureComponent } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

const data = [
    {
        name: "May",
        CPC: 4000,
        DAU: 2400,
        ARPU: 2400
    },
    {
        name: "Jun",
        CPC: 3000,
        DAU: 1398,
        ARPU: 2210
    },
    {
        name: "Jul",
        CPC: 2000,
        DAU: 9800,
        ARPU: 2290
    },
    {
        name: "Aug",
        CPC: 2780,
        DAU: 3908,
        ARPU: 2000
    },
    {
        name: "Sep",
        CPC: 1890,
        DAU: 4800,
        ARPU: 2181
    },
    {
        name: "Oct",
        CPC: 2390,
        DAU: 3800,
        ARPU: 2500
    },
    {
        name: "Nov",
        CPC: 3490,
        DAU: 4300,
        ARPU: 2100
    }
];

export default class Example extends PureComponent {
    static jsfiddleUrl = "https://jsfiddle.net/alidingling/xqjtetw0/";

    render() {
        return (
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="CPC"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="DAU" stroke="#82ca9d" />
                <Line type="monotone" dataKey="ARPU" stroke="#553200" />
            </LineChart>
        );
    }
}
