import React, { Component } from 'react';
import { Card, Button, Container, Row, Col,Table } from 'react-bootstrap';
import JointScatterChart from "../components/charts/JointScatterChart";
import { ResponsiveContainer } from "recharts"
import DatePicker from '../components/DatePicker'
import axios from 'axios';

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
                                <JointScatterChart startDate={this.state.startDate} endDate={this.state.endDate}/>
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