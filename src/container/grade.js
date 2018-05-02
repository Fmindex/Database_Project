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

    state = {
        semesters: [],
    }

    updateTable() {

        let semesters = [];
        let indexPool = [];
        this.props.courses.map((course, index) => {
            
            course.sections.map((section, index) => {
                
                let semesterName = section.year + '/' + section.semester;
                let semester = {};
                
                if(indexPool[semesterName] === undefined) {
                    indexPool[semesterName] = semesters.length;
                    semester = {
                        year: section.year,
                        semester: section.semester,
                        name: semesterName,
                        gpa: 0,
                        gpax: 0,
                        credit: 0,
                        creditx: 0,
                        courses: [],
                        verify: true,
                    }
                    semesters.push(semester);
                }
                
                semester = semesters[indexPool[semesterName]];
                if(0 <= section.grade && section.grade <= 4) {
                    semester.gpa += section.grade * course.credit;
                    semester.credit += course.credit;
                }
                else semester.verify = false;
                semester.courses.push({
                    courseId: course.course_id,
                    courseName: course.name,
                    section: section.section_id,
                    grade: section.grade,
                });
            });
        });

        semesters.sort((a, b) => {
            let aCost = a.year * 10 + a.semester;
            let bCost = b.year * 10 + b.semester;
            return aCost - bCost;
        });

        let gpa = 0;
        let credit = 0;
        semesters.map(semester => {
            gpa += semester.gpa;
            credit += semester.credit;
            semester.creditx = credit;
            semester.gpax = gpa;
        });

        this.state = {
            semesters: semesters,
        };
    }

    render() {

        this.updateTable();

        return (
            <div className="col-xs-12" style={{ overflow: 'scroll', height: '100%' }}>
                {
                    this.state.semesters.length ?
                        this.state.semesters.map((sem, index) => {
                            return (
                                <div key={index} style={{ widht: '100%' }}>
                                    <div style={{ fontSize: 20 }}>{sem.year}/{sem.semester}</div>
                                    <div style={{ width: '100%', marginBottom: '32px' }}>
                                        <Table>
                                            <TableBody displayRowCheckbox={false}>
                                                <TableRow>
                                                    <TableRowColumn style={{ fontWeight: 'bold', width: '20%' }}>#</TableRowColumn>
                                                    <TableRowColumn style={{ fontWeight: 'bold', width: '50%' }}>Course</TableRowColumn>
                                                    <TableRowColumn style={{ fontWeight: 'bold', width: '30%' }}>Grade</TableRowColumn>
                                                </TableRow>
                                                {
                                                    sem.courses.map((course, index) => {
                                                        return (
                                                            <TableRow key={index} >
                                                                <TableRowColumn style={{ width: '20%' }}>{course.courseId}</TableRowColumn>
                                                                <TableRowColumn style={{ width: '50%' }}>{course.courseName}</TableRowColumn>
                                                                <TableRowColumn style={{ width: '30%' }}>{
                                                                    course.grade >= 0 && course.grade <= 4 ? grades[parseInt((4 - course.grade) / 0.5)] : course.grade
                                                                }</TableRowColumn>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                                <TableRow>
                                                    <TableRowColumn style={{ width: '2%' }}></TableRowColumn>
                                                    <TableRowColumn style={{ width: '49%' }}><b>GPA: {!sem.verify ? '-' : (sem.gpa / sem.credit).toFixed(2)}</b></TableRowColumn>
                                                    <TableRowColumn style={{ width: '49%' }}><b>GPAX: {!sem.verify ? '-' : (sem.gpax / sem.creditx).toFixed(2)}</b></TableRowColumn>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div style={{ fontSize: '36px', textAlign: 'center', }}>NO COURSE</div>
                }
            </div>
        );
    }
}

export default Grade;
