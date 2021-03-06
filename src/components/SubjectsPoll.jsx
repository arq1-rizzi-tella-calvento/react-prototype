import React, { Component } from 'react';
import Alert from '../components/Alert.jsx';
import { render } from 'react-dom';
import SurveyConfirmation from '../containers/SurveySummary.jsx';

export default class  SubjectsPoll extends Component {
  state = { subjects: [] }
  componentDidMount() {
    this.props.fetch(
      this.props.match.params.token,
      data => this.setState({ 
        token: this.props.match.params.token, subjects: data.subjects, surveyId: data.survey_id 
      })
    );
  }

  setSelected = (subject) => {
    return (selected) => {
      const selectDropdown = selected.target;
      let subjectsDup = this.state.subjects;
      const subject = subjectsDup.find(subject => subject.name === selectDropdown.name)
      subject.selectedChair = selectDropdown.value;
      subject.selected = subject.selectedChair;

      this.setState({ subjects: subjectsDup });
    }
  };

  handleSubmit = (event) => {
    this.props.submit(
      this.state,
      data => render (<SurveyConfirmation msg={data} /> , document.getElementById('root')),
      data => render(<Alert msg={data.msg}/>, document.getElementById('alert'))
    )
    event.preventDefault();
  }

  _renderSubject(subject) {
    return (
      <div key={subject.name} className='col-md-6 form-group' style={{textAlign: '-webkit-center', MozTextAlignLast: 'center'}}>
        <div className='col-md-8' style={{textAlign: 'center', fontWeight: 'bolder', paddingBottom: 5 + 'px'}}>{subject.name}</div>
        <div className='col-md-8'>
          <select className='form-control' style={{textAlignLast: 'center' }}
                  value={subject.selected} onChange={this.setSelected(subject)} name={subject.name} id={subject.name}>
            <option value="dont">Todavía no voy a cursar</option>
            <option value="cant">No puedo por los horarios</option>
            { this._generateChairOptions(subject.chairs)}
            <option value="approved">Ya la cursé</option>
          </select>
        </div>
      </div>
    )
  }

  _generateChairOptions(chairs) {
    return chairs.map(chair => <option value={chair.id}>{chair.time}</option>);
  }

  render() {
    return(
      <form onSubmit={ this.handleSubmit }>
        <div id="alert">
        </div>
        <div className="container-fluid">
          <div className="alert alert-dark">
            ¿Qué materias tenes pensado cursar?
          </div>
          <div className="row">
            { this.state.subjects.map(subject => this._renderSubject(subject)) }
          </div>
          <button className="btn btn-sm btn-primary btn-block" type="submit">
            Enviar
          </button>
        </div>
      </form>
    )
  }
}