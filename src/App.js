import React, { Component } from 'react';

import LoginPage from './pages/LoginPage';
import DashboardStudent from './pages/DashboardStudent';
import DashboardTeacher from './pages/DashboardTeacher';
import NavBar from './container/nav_bar';
import axios from 'axios';
import Cookies from 'universal-cookie';

class App extends Component {

  cookies = new Cookies();
  
  state = {
    page: 'login',
    // page: 'studentDashboard',
    // page: 'teacherDashboard',
    id: -1,
    type: "",
  };

  changeID = (nid) => {
    this.setState({id:nid})
  }

  changeType= (ntype) => {
    this.setState({type:ntype})
  }

  logOut = () => {
    let queryToken = '?token=' + this.cookies.get('token');
    axios.post('http://127.0.0.1:3000' + '/auth/logout' + queryToken, {}).then(data => {
      this.cookies.remove('token');
      this.setState({ page: 'login' });
    });
  }
  changePage = (pageName) => {
    this.setState({ page: pageName });
  }

  render() {
    return (
        <div style={{ overflow: 'hidden', height: '80%' }}>
          <NavBar logOut={this.logOut} isLogin={this.state.page == 'login'} />
          {this.state.page === 'login' && <LoginPage changePage={this.changePage} changeID = {this.changeID} changeType = {this.changeType}/>}
          {this.state.page === 'studentDashboard' && <DashboardStudent id = {this.state.id}/>}
          {this.state.page === 'teacherDashboard' && <DashboardTeacher id = {this.state.id}/>}
        </div>
    );
  }
}

export default App;
