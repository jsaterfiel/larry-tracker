import React, { Component } from 'react';
import { Card, Button, Container, Row, Col,Table } from 'react-bootstrap';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import DatePicker from '../components/DatePicker'
import axios from 'axios';
import moment from "moment";

class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.handleDateChanged = this.handleDateChanged.bind(this);

        this.state = {
            userConfig: {
                tooltip: {
                    pointFormat: "<b>{point.y} thousand megawatthours</b>"
                },
                plotOptions: {
                    pie: {
                        showInLegend: true,
                        innerSize: "60%",
                        dataLabels: {
                            enabled: false,
                            distance: -14,
                            color: "white",
                            style: {
                                fontweight: "bold",
                                fontsize: 50
                            }
                        }
                    }
                }
            },
            startDate: new Date("2019-10-27"),
            endDate: new Date("2019-10-27"),
            data: []
        };
    }

    async getData(startDate, endDate){
        const baseURL = "http://localhost:8181"
        const response = await axios.get(baseURL);
    }

    handleDateChanged(from, to){
        this.setState({startDate: from, endDate: to});
    }

    formatXAxis(tickItem) {
        // If using moment.js
        return moment(tickItem).format('YY.MM')
    }

    render() {
        return (
            <div className="DashboardPage">
                <h1 className="main-title">Acme Inc. Revenue Analysis</h1>
                <Container>
                    <DatePicker dateChanged={this.handleDateChanged}/>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Revenue</Card.Title>
                                    <Card.Text>
                                        $5,400
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Impressions</Card.Title>
                                    <Card.Text>
                                        168,520
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Users</Card.Title>
                                    <Card.Text>
                                        9,000
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Card>
                        <Card.Header as="h5">Featured</Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={400}>
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
                                    <YAxis domain = {[0, 10000]}/>

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
                            </ResponsiveContainer>
                            <Button variant="primary">Detail</Button>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }
}


export default Dashboard;