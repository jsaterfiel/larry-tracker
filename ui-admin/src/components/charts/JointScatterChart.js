import React, {Component} from "react";
import moment from "moment"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default class JointScatterChart extends Component {
    //example  https://jsfiddle.net/alidingling/xqjtetw0/;
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            data: [],
            numbers: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value: nextProps.value})
    }

    formatXAxis(tickItem) {
    // If using moment.js
        return moment(tickItem).format('YY.MM')
    }

    render() {
        return (
            <div>
                <p>{this.props.value}</p>
                <LineChart
                    width={1000}
                    height={400}
                    data={this.state.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={this.formatXAxis}/>
                    <YAxis domain = {[0, Math.min(...this.state.numbers)]}/>
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
            </div>

        );
    }
}
