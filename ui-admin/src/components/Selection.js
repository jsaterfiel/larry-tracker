import React, { Component } from "react";

const years = [
    2001,
    2002,
    2003,
    2004,
    2005,
    2006,
    2007,
    2008,
    2009,
    2010,
    2011,
    2012,
    2013,
    2014,
    2015
];

const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apl",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

class Selection extends Component {
    render() {
        return (
            <>
                <div className="container text-center">
                    <div>
                        <label className="y-1">From</label>
                        <select
                            className=" y-1 "
                            name="yearFrom"
                            value={this.props.yearFrom}
                            onChange={this.props.onChangeYear}
                        >
                            {years.map(y => {
                                return (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                );
                            })}
                        </select>
                        <select
                            className=" m-1 "
                            name="monthFrom"
                            value={this.props.monthFrom}
                            onChange={this.props.onChangeMonth}
                        >
                            {month.map(m => {
                                return (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                );
                            })}
                        </select>
                        <label className="y-2">to</label>
                        <select
                            className="listbox-area y-2 "
                            name="yearTo"
                            value={this.props.yearTo}
                            onChange={this.props.onChangeYear}
                        >
                            {years.map(y => {
                                return (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                );
                            })}
                        </select>
                        <select
                            className=" m-2 "
                            name="monthTo"
                            value={this.props.monthTo}
                            onChange={this.props.onChangeMonth}
                        >
                            {month.map(m => {
                                return (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            </>
        );
    }
}

export default Selection;
