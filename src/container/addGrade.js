import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import Cookies from 'universal-cookie';
import axios from 'axios';
// {course_id: "2111211", year: "2015", semester: "1", section_id: "1", student_id: "5831057021", grade: "4.00"}
const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
    button: {
        margin: 12,
        marginBottom: 32,
    },
};

const cookies = new Cookies();

class ShowList extends Component {

    state = {
        dataCourseID: ['2110101', '2110222'],
        dataYear: ['2016', '2017', '2018'],
        dataSemester: ['1', '2'],
        dataSectionID: ['1', '2', '3', '33'],
        dataStudentID: ['5830622421', '58311111'],
        dataGrade: [],
        courseId: '',
        year: '2017',
        semester: '2',
        grade: '',
        section: '',
        studentId: '',
    };

    handleUpdateInput = (value) => {
        this.setState(value);
    };

    handleSubmit = () => {
        let grade = 4.00;
        if (this.state.grade === 'A') grade = 4.00;
        if (this.state.grade === 'B+') grade = 3.50;
        if (this.state.grade === 'B') grade = 3.00;
        if (this.state.grade === 'C+') grade = 2.50;
        if (this.state.grade === 'C') grade = 2.00;
        if (this.state.grade === 'D+') grade = 1.50;
        if (this.state.grade === 'D') grade = 1.00;
        if (this.state.grade === 'F') grade = 0;

        axios.post('http://localhost:3000/instructor/course/grade/?token=' + cookies.get('token'), {
            course_id: this.state.courseId,
            year: this.state.year,
            semester: this.state.semester,
            section_id: this.state.section,
            student_id: this.state.studentId,
            grade: grade,
        }).then(res => {
            console.log(res.data);
            if (res.data == 'DENY') {
                alert('You are not teaching this section');
            }
            else if (res.data == 'STUDENT NOT FOUND') {
                alert('This student not found');
            }
            else if (res.data == 'OK') {
                alert('SUCCESS!');
            }
        });
    }

    render() {
        return (
            <div style={{ padding: '32px', fontSize: '16px' }}>
                <div className="row">
                    Course ID:
                <AutoComplete
                        hintText="ex. 2110101"
                        dataSource={this.state.dataCourseID}
                        onUpdateInput={(value) => this.handleUpdateInput({ ...this.state, courseId: value })}
                        value={this.state.courseId}
                        style={{ marginLeft: '16px' }}
                    />
                </div>
                {/* <div className="row">
                    Year:
                <AutoComplete
                        disabled
                        hintText="ex. 2016"
                        dataSource={this.state.dataYear}
                        onUpdateInput={(value) => this.handleUpdateInput({ ...this.state, year: value })}
                        value={this.state.year}
                        style={{ marginLeft: '16px' }}
                    />
                </div>
                <div className="row">
                    Semester:
                <AutoComplete
                        disabled
                        hintText="ex. 1"
                        dataSource={this.state.dataSemester}
                        onUpdateInput={(value) => this.handleUpdateInput({ ...this.state, semester: value })}
                        value={this.state.semester}
                        style={{ marginLeft: '16px' }}
                    />
                </div> */}
                <div className="row">
                    Section:
                <AutoComplete
                        hintText="ex. 33"
                        dataSource={this.state.dataSectionID}
                        onUpdateInput={(value) => this.handleUpdateInput({ ...this.state, section: value })}
                        value={this.state.section}
                        style={{ marginLeft: '16px' }}
                    />
                </div>
                <div className="row">
                    Student ID:
                <AutoComplete
                        hintText="ex. 5830622421"
                        dataSource={this.state.dataStudentID}
                        onUpdateInput={(value) => this.handleUpdateInput({ ...this.state, studentId: value })}
                        value={this.state.studentId}
                        style={{ marginLeft: '16px' }}
                    />
                </div>
                <div className="row">
                    Grade:
                <AutoComplete
                        hintText="ex. A"
                        dataSource={this.state.dataGrade}
                        onUpdateInput={(value) => this.handleUpdateInput({ ...this.state, grade: value })}
                        value={this.state.grade}
                        style={{ marginLeft: '16px' }}
                    />
                </div>
                <div className="row" style={{ marginLeft: '64px' }}>
                    <RaisedButton label="Submit" primary={true} style={styles.button} onClick={() => this.handleSubmit()} />
                </div>
            </div>
        );
    }
}

export default ShowList;