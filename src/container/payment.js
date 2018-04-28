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
        for(var i = 0 ; i < Object.keys(response.data).length ;i++){
            var fee = response.data[i] ;
            arr.push({
                feeId: fee.fee_id,
                feeType: fee.type, 
                feeDept: fee.department_id, 
                feeCost: fee.cost,
                feeYear: fee.year, 
            }) ;  
        }

        that.setState({feeList:arr});
        
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
            <TableHeader  >
                <TableRow>
                    <TableHeaderColumn>ID</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody>
                {listItems}
                <TableRow>
                    <TableRowColumn>-</TableRowColumn>
                    <TableRowColumn>-</TableRowColumn>
                    <TableRowColumn>-</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
       
    );
  }
}

export default Request;