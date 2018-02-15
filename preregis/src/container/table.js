import React, { Component } from 'react';

import SubjectBar from '../components/subject_bar';

class Table extends Component {

    constructor(props) {
        super(props);
    }

    renderSubjects(subject) {
        return (
            <SubjectBar period={subject.period} name={subject.name} />
        );
    }

    renderTimePeriods(timePeriod) {
        return (
            <div style={{ display: 'inline', width: '10%'}}>
                <div className="timeperiod my-color" style={{ width: '5%' }}> {timePeriod }</div>
                <div className="timeperiod my-color" style={{ width: '5%' }}> </div>
            </div>
        );
    }

    renderDay(index) {
        let label = '';
        if(index == 1)label = 'Monday';
        else if(index == 2)label = 'Tueday';
        else if(index == 3)label = 'Wednesday';
        else if(index == 4)label = 'Thursday';
        else if(index == 5)label = 'Friday';
        else if(index == 6)label = 'Saturday';
        else if(index == 7)label = 'Sunday';
        else label = 'focus';

        console.log("ghwejhfkaf");

        return (
            <div style={{ display: 'inline-block' }}>
                {label}
            </div>
        );
    }

    renderClass(detail) {
        if(detail.courseNo == null){
            return (
                <div style={{ height: '100%', display: 'inline-block', width: '5%'}}></div>
            );
        } else {
            return (
                <div style={{ top: 0, height: '100%', backgroundColor: 'red', display: 'inline-block', width: `${detail.period*5}%`}}>
                    { detail.name }
                </div>
            );
        }
    }

    

    render() {
        let time_periods = ['8', '9', '10', '11', '12', '13', '14', '15', '16' ,'17'];
        return (

              <div >
                <div className="jumbotron">
                  <div className="col-sm-8 text-left my-table" >
                      <div className="row" style={{ width: '100%'}} >
                          <div className="col-xs-2  blankbox"></div>
                          <div className="col-xs-10  blankbox no-padding" style={{ height: '100%' }}>{time_periods.map(this.renderTimePeriods)}</div>
                      </div>
                      
                      <div className="blackline" />
                      
                      {
                          this.props.classOnTable.map((day, index)=> {
                              return(
                                  <div className="row" style={{ width: '100%', height: '40px' }}>
                                      <div className="col-xs-2">{ this.renderDay(index+1) }</div>
                                      <div className="col-xs-10 no-padding" style={{ height: '100%', display: 'flex' }}>{ day.map((detail) => { return this.renderClass(detail) }) }</div> 
                                  </div>  
                              )
                          })
                      }
                  </div>          
                </div>

                <div style={{ width : '800px', marginTop: '20px'}} >
                    {
                        
                        this.props.subject.map((element) => {
                            return(
                                <div style={{display: 'inline-block'}}>
                                    { element.onList==false ? '' :
                                        <div style={{border: '1px solid lightgray', padding: '10px', margin: '5px'}}>
                                            <div className="courseNostyle" > { element.courseNo } </div>
                                            <div className="namestyle" > { element.name } </div>
                                            <button onClick={()=> this.props.falseOnlist(element.index)}>
                                                <span className="glyphicon glyphicon-remove" style={{ display: 'inline'}} ></span>
                                            </button>
                                        </div> 
                                        

                                    }
                                </div>
                                
                            )}
                        )
                    }
                
                </div>


              </div>
    );
  }
}

export default Table;

