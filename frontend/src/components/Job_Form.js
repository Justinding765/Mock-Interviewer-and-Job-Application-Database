import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavBar from "./NavBar"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import Swal from 'sweetalert2';
function Job_Form(props) {
    const [jobTitle, setJobTitle] = useState(props.props.jobTitle);
    const [positionType, setPositionType] = useState(props.props.positionType);
    const [company, setCompany] = useState(props.props.company);
    const [dateApplied, setDateApplied] = useState( props.props.date_applied  ?  new Date(props.props.date_applied): "");
    const [applicationDeadline, setApplicationDeadline] = useState(props.props.application_Deadline ? new Date(props.props.application_Deadline): "");
    const [link, setLink] = useState(props.props.link);
    const [jobDescription, setJobDescription] = useState(props.props.jobDescription);
    const showSuccessAlert = () => {
        Swal.fire({
          icon: 'success',
          iconColor: '#008000',
          title: 'Success!',
          text: '',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#6ac259',
          background: 'lightblue'
        }).then(() => {
            window.location.href = '/Applications';
          });

    };
    async function handleClick() {
        const res = await fetch('/api/applications/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: jobDescription })
        });
        const data = await res.json();
        setJobDescription(data.data);
      }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            jobTitle,
            positionType,
            company,
            dateApplied,
            applicationDeadline,
            link,
            jobDescription
        };
        if(props.props.id!==undefined){
            console.log(props.props.id)
            fetch('/api/applications/updateApplication/'+ props.props._id , {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    showSuccessAlert();
                })
                .catch(error => {
                    console.log(error)
                    window.location.reload()
                });
        }
        else{
            fetch('/api/applications/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    showSuccessAlert();
                })
                .catch(error => 
                    window.location.reload());
        }
        
    };


  return (
    <div style={{margin:'30px'}}>
        <Container>
            <div className="form-container">
                <center><h2>Application</h2></center>

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="jobTitle">
                        <Form.Label>Job Title*</Form.Label>
                        <Form.Control
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                        />
                    </Form.Group>

                    <Form.Group controlId="positionType">
                        <Form.Label>Position Type*</Form.Label>
                        <Form.Control
                        type="text"
                        value={positionType}
                        onChange={(e) => setPositionType(e.target.value)}
                        required
                        />
                    </Form.Group>

                    <Form.Group controlId="company">
                        <Form.Label>Company*</Form.Label>
                        <Form.Control
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                        />
                    </Form.Group>

                    <Form.Group controlId="dateApplied">
                        <Form.Label>Date Applied*</Form.Label>
                        <DatePicker
                            selected={dateApplied}
                            onChange={(date) => setDateApplied(date)}
                            required
                            className="rounded-2 border-gray-300 border-white px-2 py-1"

                        />
                    </Form.Group>

                    <Form.Group controlId="applicationDeadline">
                        <Form.Label>Application Deadline</Form.Label>
                        <DatePicker
                            selected={applicationDeadline}
                            onChange={(date) => setApplicationDeadline(date)}
                            className="rounded-2 border-gray-300 border-white px-2 py-1"
                            />
                    </Form.Group>

                    <Form.Group controlId="link">
                        <Form.Label>Link</Form.Label>
                        <Form.Control
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="jobDescription">
                        <Form.Label>Job Description/Other</Form.Label>
                        {/* <Form.Control
                            as="textarea"
                            rows={10}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />  */}
                        <CKEditor   editor={ClassicEditor}
                            data={jobDescription}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setJobDescription(data);}}
                                style={{
                                    border: "1px solid #ced4da",
                                    borderRadius: "0.25rem",
                                    padding: "0.375rem 0.75rem",
                                    fontSize: "1rem",
                                    lineHeight: "1.5",
                                    color: "#495057",
                                    backgroundColor: "#fff",
                                    boxShadow: "none",
                                }}
                        />
                        <br/>
                        <center><Button onClick={handleClick} variant="danger" >
                        Summarize Description
                    </Button></center>
                    </Form.Group><br/>
                    <br/><br/>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </Container>
    </div>
    );
}

export default Job_Form;
