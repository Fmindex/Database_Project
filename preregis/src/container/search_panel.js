import React, { Component } from 'react';

class SearchPanel extends Component {
  render() {
    return (
        <div className="col-sm-4 text-center">
            <div className="jumbotron">
                    <h3>List of course</h3>
                    <hr/>

                    <div className="col-sm-3" />
                    <input type="text" className="form-control" className="col-sm-6 search searchTime" placeholder="Time : 9.00" aria-describedby="basic-addon1" />
                    <div className="col-sm-12" />
                    <div className="col-sm-2" />
                    <input type="text" className="form-control" className="col-sm-8 search searchNo" placeholder="Course NO. : 88888888" aria-describedby="basic-addon1" />
                    <br/>
                    <input type="text" className="form-control" className="col-sm-12 search searchName" placeholder="Course Name : Gen Phy II" aria-describedby="basic-addon1" />
                
                <br/>
                <button className="btn btn-primary" type="botton">search</button>
                <hr/>

                <div className="col-sm-12 searched-course-name">
                    88888888 : Fmmmm 
                    <div className="searched-credit">(2 credit)</div>
                    <br/>   
                </div>
                

                <botton className="courselist col-sm-6">
                    By aj.Fmmmm
                    <br/>
                    Time : 9.00-11.00
                </botton>

                <botton className="courselist2 col-sm-6">
                    By aj.Fmmmm
                    <br/>
                    Time : 9.00-11.00
                </botton>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
            </div>
        </div>
    );
  }
}

export default SearchPanel;
