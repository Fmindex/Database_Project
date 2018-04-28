import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import Divider from 'material-ui/Divider';

const titleFontSize = '24px';
const contentFontSize = '18px';
const grades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F+', 'F'];
class Grade extends Component {
    
    render() {
        const { onReduce, semesters } = this.props || {};
        let styleReduce = onReduce === undefined ? false : onReduce;
        console.log(onReduce, styleReduce)

        console.log(semesters);

        return (
            <div className="col-xs-12" style={{ overflow: 'scroll', height: '100%' }}>
                {
                    1 > 0 ?
                    semesters.map((sem, index) => {
                        return (
                            <div key={index} style={{ widht: '100%' }}>
                                <div style={{ fontSize: styleReduce ? '20px' : '32px' }}>{sem.year}/{sem.semester}</div>
                                <Divider />
                                <div  style={{ width: '100%', marginBottom: '32px' }}>
                                    <Table>
                                        <TableHeader displaySelectAll={false}>
                                            <TableRow>
                                                <TableHeaderColumn style={{ fontSize: styleReduce ? '16px' : titleFontSize, width: '10%' }}></TableHeaderColumn>
                                                <TableHeaderColumn style={{ fontSize: styleReduce ? '16px' :  titleFontSize, width: '60%' }}>Course</TableHeaderColumn>
                                                <TableHeaderColumn style={{ fontSize: styleReduce ? '16px' :  titleFontSize, width: '30%' }}>Grade</TableHeaderColumn>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody displayRowCheckbox={false}>
                                            {
                                                sem.subjects.map((element, index) => {
                                                    return (
                                                        <TableRow key={index} >
                                                            <TableRowColumn style={{ fontSize: styleReduce ? '16px' :  contentFontSize, width: '20%' }}>{element.course_id ? element.course_id : element.courseNo}</TableRowColumn>
                                                            <TableRowColumn style={{ fontSize: styleReduce ? '16px' :  contentFontSize, width: '50%' }}>{element.name}</TableRowColumn>
                                                            <TableRowColumn style={{ fontSize: styleReduce ? '16px' :  contentFontSize, width: '30%' }}>{
                                                                element.grade >= 0 && element.grade <= 4 ? grades[parseInt((4 - element.grade) / 0.5)] : element.grade
                                                            }</TableRowColumn>
                                                        </TableRow>
                                                    )
                                                })
                                            }
                                            <TableRow>
                                                <TableRowColumn style={{ fontSize: styleReduce ? '16px' :  contentFontSize, width: '2%'  }}></TableRowColumn>
                                                <TableRowColumn style={{ fontSize: styleReduce ? '16px' :  contentFontSize, width: '49%'  }}>GPA: {sem.grade/sem.credit }</TableRowColumn>
                                                <TableRowColumn style={{ fontSize: styleReduce ? '16px' :  contentFontSize, width: '49%'  }}>GPAX: {sem.gradeX/sem.creditX} </TableRowColumn>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )
                    })
                    :
                    <div style={{ fontSize: '36px' }}>No course</div>
                }
            </div>
        );
  }
}

export default Grade;
