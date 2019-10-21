import React, { Component } from 'react';
import { Card, Button, Container, Row, Col,Table } from 'react-bootstrap';
import BarChart from "../components/charts/BarChart";
import JointScatterChart from "../components/charts/JointScatterChart";
import ScatterChart from "../components/charts/ScatterChart";
import PieChartTwoLevel from "../components/charts/PieChartTwoLevel";
import { ResponsiveContainer } from "recharts"
import Selection from "../components/Selection";

class Dashboard extends Component {
    state = {
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
        yearFrom: "2001",
        yearTo: "2015",
        msg: "Select the range"
    };

    render() {
        return (
            <div className="DashboardPage">
                <h1 className="main-title">Acme Inc. Revenue Analysis</h1>
                <Container>
                    <Selection
                        yearFrom={this.state.yearFrom}
                        yearTo={this.state.yearTo}
                        //onChangeYear={this.handleChangeYear}
                        //onSubmit={this.handleSubmit}
                    />
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

                    <Row>
                        <Col xs={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Revenue</Card.Title>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <ScatterChart/>
                                    </ResponsiveContainer>

                                    <Button variant="primary">Detail</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>User's Behavior</Card.Title>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <JointScatterChart/>
                                    </ResponsiveContainer>

                                    <Button variant="primary">Detail</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        </tbody>
                    </Table>

                </Container>
            </div>
        );
    }
}


export default Dashboard;