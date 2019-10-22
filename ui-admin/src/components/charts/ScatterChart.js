import React, { PureComponent } from "react";
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const data = [
    {
        name: "May",
        uv: 590,
        pv: 800,
        amt: 1400,
        cnt: 490
    },
    {
        name: "Jun",
        uv: 868,
        pv: 967,
        amt: 1506,
        cnt: 590
    },
    {
        name: "Jul",
        uv: 1397,
        pv: 1098,
        amt: 989,
        cnt: 350
    },
    {
        name: "Aug",
        uv: 1480,
        pv: 1200,
        amt: 1228,
        cnt: 480
    },
    {
        name: "Sep",
        uv: 1520,
        pv: 1108,
        amt: 1100,
        cnt: 460
    },
    {
        name: "Oct",
        uv: 1400,
        pv: 680,
        amt: 1700,
        cnt: 380
    }
];

export default class Example extends PureComponent {
    static jsfiddleUrl = "https://jsfiddle.net/alidingling/9xopwa9v/";

    render() {
        return (
            <ComposedChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                }}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                {/* <Scatter dataKey="cnt" fill="red" /> */}
            </ComposedChart>
        );
    }
}
