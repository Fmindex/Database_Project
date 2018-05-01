import React, { Component } from 'react';
import '../style/loginStyle.css';
import axios from 'axios';
import Cookies from 'universal-cookie';

import { Tabs, Tab } from 'material-ui/Tabs';

class LoginPage extends Component {

    cookies = new Cookies();

    backend = 'http://127.0.0.1:3000';

    state = {
        username: "",
        password: "",
        type: ""
    };

    constructor(props) {
        super(props);
        let queryToken = '?token=' + this.cookies.get('token');
        axios.get('http://127.0.0.1:3000' + '/auth/check' + queryToken).then(data => {
            if (data.data.type) {
                if (data.data.type === 'instructor') props.changePage('teacherDashboard');
                else if (data.data.type === 'student') props.changePage('studentDashboard');
            }
        });
    }

    handleUserNameChange = (event) => {
        this.setState({ username: event.target.value });
    }
    handlePasswordNameChange = (event) => {
        this.setState({ password: event.target.value });
    }


    handleSubmit = (event) => {

        let that = this;

        console.log(this.state.username);
        if (this.state.type == "instructor") {
            console.log("inst sub");
            axios.post('http://127.0.0.1:3000' + '/auth/instructor', {
                instructor_id: this.state.username,
                password: this.state.password
            }).then(function (response) {
                if (Object.keys(response.data).length === 0) {
                    alert('Your username or password wrong!');
                } else {
                    that.cookies.set('token', response.data.token);
                    that.props.changePage('teacherDashboard')
                    that.props.changeID(response.data.instructor_id);
                    that.props.changeType("instructor");
                }
            }.bind(this)).catch(function (err) {
                console.error(err);
            });

        } else {
            console.log("student sub");
            axios.post('http://127.0.0.1:3000' + '/auth/student', {
                student_id: this.state.username,
                password: this.state.password
            }).then(function (response) {
                if (Object.keys(response.data).length === 0) {
                } else {
                    console.log(response.data);
                    console.log('LOGIN STU SUCCESS');
                    that.cookies.set('token', response.data.token);
                    that.props.changePage('studentDashboard')
                    that.props.changeID(response.data.student_id);
                    that.props.changeType("student");

                }
                // console.log( response );
                // console.log('LOGIN INST SUCCESS');
                // this.props.changePage('studentDashboard')
                // // this.props.changeID('')
                // this.props.changeType("student")
            }).catch(function (err) {
                console.error(err);
            });
        }

    }

    handleTabChange = (value) => {
        this.setState({ type: value });
        console.log(this.state.type);
    };

    render() {
        // console.log(this.props)
        return (
            <div className="signin-container" style={{ overflow: 'hidden', marginTop: '64px', height: '100%', paddingBottom: '128px' }}>
                <Tabs style={{ width: '400px', margin: 'auto', borderTopRightRadius: '5px', borderTopLeftRadius: '5px', boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)', backgroundColor: '#555555' }} value={this.state.value} onChange={this.handleTabChange}>
                    <Tab label="Student" style={{ borderTopRightRadius: '5px', borderTopLeftRadius: '5px', backgroundColor: '#555555' }} value="student">
                        <div className="signup">
                            <h1>Login for student</h1>
                            <div className="row">
                                <input type="text" name="username" placeholder="Student ID" onChange={this.handleUserNameChange} value={this.state.username} />
                            </div>
                            <div className="row">
                                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordNameChange} />
                            </div>
                            <button onClick={this.handleSubmit}>
                                Log in
                            </button>
                        </div>
                    </Tab>
                    <Tab label="Instructor" style={{ borderTopRightRadius: '5px', borderTopLeftRadius: '5px', backgroundColor: '#555555' }} value="instructor">
                        <div className="signup">
                            <h1>Login for instructor</h1>
                            <div className="row">
                                <input type="text" name="username" placeholder="Instructor ID" onChange={this.handleUserNameChange} value={this.state.username} />
                            </div>
                            <div className="row">
                                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordNameChange} />
                            </div>
                            <button onClick={this.handleSubmit}>
                                Log in
                            </button>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default LoginPage;
