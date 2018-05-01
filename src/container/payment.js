import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import React, { Component } from 'react';


import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import Cookies from 'universal-cookie' 
import axios from 'axios' ;
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';

class Request extends Component {
  
    cookies = new Cookies();

    state = {
        feeList: [],
        total: 0,
        oldPayments: [],
    };

    componentWillMount() {
        let that = this ;
        let queryToken = '?token=' + this.cookies.get('token');
        axios.get('http://127.0.0.1:3000' + '/student/payment' + queryToken, {
        }).then(function (response) {
            var arr = [];
            var old = [];
            var total = 0;
            response.data.fees.map(fee => {

                if(fee.fee_year == 2017 && fee.fee_semester == 2) {
                    arr.push(fee);
                    total += fee.cost;
                }
                else {
                    if(old[fee.fee_year + '/' + fee.fee_semester] === undefined) {
                        old[fee.fee_year + '/' + fee.fee_semester] = {
                            year: fee.fee_year,
                            semester: fee.fee_semester,
                            total: 0,
                            fees: [],
                        }
                    }
                    
                    old[fee.fee_year + '/' + fee.fee_semester].fees.push(fee);
                    old[fee.fee_year + '/' + fee.fee_semester].total += fee.cost;
                }
            });
            let nw = [];
            Object.keys(old).map(key => {
                nw.push(old[key]);
            });
            nw.sort((A, B) => {
                let a = A.year * 10 + A.semester;
                let b = B.year * 10 + B.semester;
                return b - a;
            });
            that.setState({
                feeList: arr,
                total: total,
                oldPayments: nw,
            });
            
        }).catch(function (err) {
            console.error(err);
        });  
    }


  render() {

    const listItems = this.state.feeList.map(
        function(object, key) {
            return (
                <TableRow key={key}>
                    <TableRowColumn style = {{ width: 100 }} >
                        {object.paid == true  && <i style={{ color: 'green' }} className='material-icons'>check_circle</i>}
                        {object.paid == false && <i style={{ color: 'orange' }} className='material-icons'>remove_circle</i>}
                    </TableRowColumn>
                    <TableRowColumn>{object.type}</TableRowColumn>
                    <TableRowColumn>{object.cost}</TableRowColumn>
                </TableRow>
            );
        });

    return (
        <div className="col-xs-12" style={{ overflow: 'scroll', height: '100%' }} >
            <div style={{ fontSize: 20, marginLeft: 16, }} >Current Semester Payment</div>
            <div style={{ paddingLeft: 16, paddingRight: 16, marginBottom: 16, }} >
                <Table>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow>
                            <TableRowColumn style={{ width: 100 }} ></TableRowColumn>
                            <TableRowColumn>Type</TableRowColumn>
                            <TableRowColumn>Cost</TableRowColumn>
                        </TableRow>
                        {listItems}
                        <TableRow>
                            <TableRowColumn style={{ width: 100 }} ></TableRowColumn>
                            <TableRowColumn><b>TOTAL</b></TableRowColumn>
                            <TableRowColumn><b>{this.state.total}</b></TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div style={{ fontSize: 20, marginLeft: 16, }} >Payment History</div>

            {
                this.state.oldPayments.map((payment, key) => (
                    <div key={key} style={{ padding: 16 }} >
                        <div style={{ fontSize: 18, marginLeft: 16, marginTop: 16, }}>{payment.year}/{payment.semester}</div>
                        <Table >
                            <TableBody displayRowCheckbox={false}>
                                <TableRow>
                                    <TableRowColumn style={{ width: 100 }} ></TableRowColumn>
                                    <TableRowColumn>Type</TableRowColumn>
                                    <TableRowColumn>Cost</TableRowColumn>
                                </TableRow>
                                {
                                    payment.fees.map((fee, _key) => (
                                        <TableRow key={_key}>
                                            <TableRowColumn style={{ width: 100 }} >
                                                {fee.paid == true && <i style={{ color: 'green' }} className='material-icons'>check_circle</i>}
                                                {fee.paid == false && <i style={{ color: 'orange' }} className='material-icons'>remove_circle</i>}
                                            </TableRowColumn>
                                            <TableRowColumn>{fee.type}</TableRowColumn>
                                            <TableRowColumn>{fee.cost}</TableRowColumn>
                                        </TableRow>
                                    ))
                                }
                                <TableRow>
                                    <TableRowColumn style={{ width: 100 }} ></TableRowColumn>
                                    <TableRowColumn><b>Total</b></TableRowColumn>
                                    <TableRowColumn><b>{payment.total}</b></TableRowColumn>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                ))
            }
        </div>
    );
  }
}

export default Request;