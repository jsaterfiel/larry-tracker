import React, { Component } from 'react';
import { Card, Container, Alert, Row, Col, Navbar, Form, NavDropdown } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import DatePicker from '../components/DatePicker';
import AuthAPI from '../services/auth';
import UserAPI from '../services/users';
import LookupAPI from '../services/lookup';
import ByLevelAPI from '../services/byLevel';
import moment from "moment";

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.loginData = AuthAPI.getLoginData();

        this.handleDateChanged = this.handleDateChanged.bind(this);
        this.getImpressions = this.getImpressions.bind(this);
        this.getInteractions = this.getInteractions.bind(this);
        this.getIvtCount = this.getIvtCount.bind(this);
        this.getAvgHalfInViewTime = this.getAvgHalfInViewTime.bind(this);
        this.getAvgTotalDwellTime = this.getAvgTotalDwellTime.bind(this);
        this.getClicks = this.getClicks.bind(this);
        this.getDentsuOTSCount = this.getDentsuOTSCount.bind(this);
        this.getWasEverFullyInViewCount = this.getWasEverFullyInViewCount.bind(this);
        this.getLevel1 = this.getLevel1.bind(this);

        // create a start date 3 days earlier than now so they get at least a tiny chart
        let startDate = new Date();
        startDate.setDate(startDate.getDate()-3);

        this.state = {
            startDate: startDate,
            endDate: new Date(), //defaults to now
            data: [],
            level1: '',
            lookups: [],
            // metrics to show
            impressions: true,
            dentsuOTSCount: false,
            ivtCount: false,
            avgTotalDwellTime: false,
            avgHalfInViewTime: false,
            clicks: false,
            interactions: false,
            wasEverFullyInViewCount: false
        };
        this._isMounted = false;
    }

    async componentDidMount() {
        this._isMounted = true;

        let user;

        if (this.loginData.userType === 'admin') {
            try {
                user = await UserAPI.getUser(this.props.match.params.username);
            } catch (err) {
                if (!this._isMounted) return;
                if (err && err.response && err.response.data) {
                    this.setState({
                    errorMsg: err.response.data.error
                    });
                } else {
                    this.setState({
                    errorMsg: 'Unknown Error'
                    });
                }
                return;
            }
        } else {
            user = this.loginData;
        }

        // avoid calling the api if we're already unmounted
        if (!this._isMounted) return;

        let lookups;
        try {
            lookups = await LookupAPI.getClientLevels(user.clientCode);
        } catch (err) {
            if (!this._isMounted) return;
            if (err && err.response && err.response.data) {
                this.setState({
                errorMsg: err.response.data.error
                });
            } else {
                this.setState({
                errorMsg: 'Unknown Error'
                });
            }
            return;
        }

        // avoid calling the api if we're already unmounted
        if (!this._isMounted) return;

        const data = await this.search(user.clientCode, this.state.startDate, this.state.endDate, '');

        if (!this._isMounted) return;

        this.setState({
            clientCode: user.clientCode,
            company: user.company,
            data: data,
            lookups: lookups
        });
    }

    async search(clientCode, startDate, endDate, level1) {
        try {
            return await ByLevelAPI.byLevel(clientCode, level1, (startDate ? startDate : this.state.startDate), (endDate ? endDate: this.state.endDate));
        } catch (err) {
            if (!this._isMounted) return;
            if (err && err.response && err.response.data) {
                this.setState({
                errorMsg: err.response.data.error
                });
            } else {
                this.setState({
                errorMsg: 'Unknown Error'
                });
            }
        }
        return [];
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async handleDateChanged(startDate, endDate){
        const data = await this.search(this.state.clientCode, startDate, endDate, this.state.level1);
        
        if (!this._isMounted) return;

        if (data !== false) {
            this.setState({
                data: data,
                startDate: startDate,
                endDate: endDate
            });
        }
    }

    formatXAxis(tickItem) {
        // If using moment.js
        return moment(tickItem).format('YY.MM')
    }

    async getLevel1(evt) {
        const level1 = evt.target.value;
        const data = await this.search(this.state.clientCode, this.state.startDate, this.state.endDate, level1);
        
        if (!this._isMounted) return;
        
        this.setState({
            level1: level1,
            data: data
        });
    }

    getImpressions(evt) {
        this.setState({
            impressions: this.state.impressions === 1 ? 0 : 1
        });
    }

    getIvtCount(evt) {
        this.setState({
            ivtCount: this.state.ivtCount === 1 ? 0 : 1
        });
    }

    getDentsuOTSCount(evt) {
        this.setState({
            dentsuOTSCount: this.state.dentsuOTSCount === 1 ? 0 : 1
        });
    }

    getAvgTotalDwellTime(evt) {
        this.setState({
            avgTotalDwellTime: this.state.avgTotalDwellTime === 1 ? 0 : 1
        });
    }

    getAvgHalfInViewTime(evt) {
        this.setState({
            avgHalfInViewTime: this.state.avgHalfInViewTime === 1 ? 0 : 1
        });
    }

    getClicks(evt) {
        this.setState({
            clicks: this.state.clicks === 1 ? 0 : 1
        });
    }

    getInteractions(evt) {
        this.setState({
            interactions: this.state.interactions === 1 ? 0 : 1
        });
    }

    getWasEverFullyInViewCount(evt) {
        this.setState({
            wasEverFullyInViewCount: this.state.wasEverFullyInViewCount === 1 ? 0 : 1
        });
    }

    render() {
        // check if the user is logged in and is an admin.  Using a redirect below to take non admins back to home.
        const loginData = AuthAPI.getLoginData();
        if (!loginData) {
        return  <Redirect to='/' />;
        }
        return (
            <div className="DashboardPage">
                <Container>
                    <Row>
                        <Col className="pl-0 pr-0 mt-3">
                            <h1>Dashboard</h1>
                        </Col>
                    </Row>
                    {this.state.errorMsg &&
                    <Row>
                        <Alert variant="danger" onClose={this.dismissAlert} dismissible className="col-xs">
                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                        <p>
                            {this.state.errorMsg}
                        </p>
                        </Alert>
                    </Row>}
                    <Row className="mt-1">
                        <div className="col-xs mt-3">
                            <DatePicker dateChanged={this.handleDateChanged}/>
                        </div>
                        <Col>
                            <Navbar>
                                <NavDropdown title="Select Metrics" id="dashboard-metrics">
                                    <Container className="ml-1">
                                        <Form.Check type="checkbox" onChange={this.getImpressions} label="Impressions" checked={this.state.impressions}/>
                                        <Form.Check type="checkbox" onChange={this.getIvtCount} label="Non-Human Traffic" checked={this.state.ivtCount}/>
                                        <Form.Check type="checkbox" onChange={this.getDentsuOTSCount} label="Dentsu OTS" checked={this.state.dentsuOTSCount}/>
                                        <Form.Check type="checkbox" onChange={this.getAvgTotalDwellTime} label="Avg Dwell Time" checked={this.state.avgTotalDwellTime}/>
                                        <Form.Check type="checkbox" onChange={this.getAvgHalfInViewTime} label="Avg 50% In-View Time" checked={this.state.avgHalfInViewTime}/>
                                        <Form.Check type="checkbox" onChange={this.getClicks} label="Clicks" checked={this.state.clicks}/>
                                        <Form.Check type="checkbox" onChange={this.getInteractions} label="Interactions" checked={this.state.interactions}/>
                                        <Form.Check type="checkbox" onChange={this.getWasEverFullyInViewCount} label="Fully In-View" checked={this.state.wasEverFullyInViewCount}/>
                                    </Container>
                                </NavDropdown>
                            </Navbar>
                        </Col>
                        <Col className="mt-2">
                            <Form.Group>
                                <Form.Control as="select" onChange={this.getLevel1} value={this.state.level1} >
                                    <option value=''>All Ad Servers</option>
                                    {this.state.lookups.map((lookup) => 
                                    <option key={lookup.level1ID}>{lookup.level1ID}</option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="mt-2 pl-0 pr-0">
                            <Card>
                                <Card.Header as="h5">{this.state.company}</Card.Header>
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
                                            <XAxis dataKey="startDate"/>
                                            <YAxis dataKey="impressions"/>

                                            <Tooltip />
                                            <Legend />
                                            {this.state.impressions &&
                                            <Line type="monotone" dataKey="impressions" stroke="darkblue" name="Impressions" strokeWidth="5"/>
                                            }
                                            {this.state.ivtCount &&
                                            <Line type="monotone" dataKey="ivtCount" stroke="darkred" name="Non-Human Traffic"  strokeWidth="5"/>
                                            }
                                            {this.state.dentsuOTSCount &&
                                            <Line type="monotone" dataKey="dentsuOTSCount" stroke="orange" name="Dentsu OTS"  strokeWidth="5"/>
                                            }
                                            {this.state.avgTotalDwellTime &&
                                            <Line type="monotone" dataKey="avgTotalDwellTime" stroke="green" name="Avg Dwell Time"  strokeWidth="5"/>
                                            }
                                            {this.state.avgHalfInViewTime &&
                                            <Line type="monotone" dataKey="avgHalfInViewTime" stroke="brown" name="Avg 50% In-View Time"  strokeWidth="5"/>
                                            }
                                            {this.state.clicks &&
                                            <Line type="monotone" dataKey="clicks" stroke="darkmagenta" name="Clicks"  strokeWidth="5"/>
                                            }
                                            {this.state.interactions &&
                                            <Line type="monotone" dataKey="interactions" stroke="grey" name="Interactions"  strokeWidth="5"/>
                                            }
                                            {this.state.wasEverFullyInViewCount &&
                                            <Line type="monotone" dataKey="wasEverFullyInViewCount" stroke="purple" name="Fully In-View"  strokeWidth="5"/>
                                            }
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}


export default Dashboard;