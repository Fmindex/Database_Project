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
      feeList : [{
          feeId: 1,
        feeType: "1", 
        feeDept: 1, 
        feeCost: 1,
        feeYear: 1, 
      }],
      sumCost:0,
  }

  componentDidMount() {
    let that = this ;
    let queryToken = '?token=' + this.cookies.get('token');
    axios.get('http://127.0.0.1:3000' + '/student/payment' + queryToken, {
    }).then(function (response) {
        console.log(response.data) ;
        var arr = [] ; 
        var total = 0;
        response.data.fees.map(fee => {
            arr.push({
                feeId: fee.fee_id,
                feeType: fee.type,
                feeDept: fee.department_id,
                feeCost: fee.cost,
                feeYear: fee.year,
            }); 
            total += fee.cost;
        });
        that.setState({
            feeList: arr,
            total: total
        });
        
    }).catch(function (err) {
        console.error(err);
    });  
  }


  render() {

    const listItems = this.state.feeList.map(
        function(object) {
            return (
                <TableRow>
                    <TableRowColumn>{object.feeType}</TableRowColumn>
                    <TableRowColumn>{object.feeYear}</TableRowColumn>
                    <TableRowColumn>{object.feeCost}</TableRowColumn>
                </TableRow>
            );
        });

    return (
        <Table >
            <TableHeader displaySelectAll={false}>
                <TableRow>
                    <TableHeaderColumn>Type</TableHeaderColumn>
                    <TableHeaderColumn>Registered In</TableHeaderColumn>
                    <TableHeaderColumn>Cost</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {listItems}
                <TableRow>
                    <TableRowColumn><b>TOTAL</b></TableRowColumn>
                    <TableRowColumn></TableRowColumn>
                    <TableRowColumn><b>{this.state.total}</b></TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
       
    );
  }
}

export default Request;