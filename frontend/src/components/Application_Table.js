import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Button} from "react-bootstrap";
import { Table } from 'antd';
import Modal from "react-modal";
import { ModalHeader, ModalBody } from 'react-bootstrap';
import Job_Form from "./Job_Form";

const Application_Table = () => {
    const [applications, setApplications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState({})
    useEffect(() => {
        fetch('/api/applications/getApplications' ,{
            method: 'GET',
        })
        .then(response => { 
            return response.json()})
        .then(data => {
            setApplications(data.data)
            })
        .catch(error => console.error(error));
    }, []);

    function toggleModal() {
        console.log("sdd")
        setIsOpen(!isOpen);
      }
    function handleDelete(data){

        fetch('/api/applications/deleteApplication/'+data._id, {
            method:'DELETE'
        })
        .then(response =>{
            return response.json()
        })
        .then(data => {
            window.location.reload()
        })
        .catch(error => console.error(error))
    
    }
    // const handleEdit = (record) => {
    //     setEditingKey(record.key);
    //   };
    function handleUpdate(record){
        setData(record)
        setIsOpen(true);

    }
    return(
        <div style={{ margin: '30px' }}>
            <Modal isOpen={isOpen} onRequestClose={toggleModal} id="Application_Modal">
                <ModalHeader> 
                    <button id="btn" type="button" onClick={toggleModal}><div>x</div></button>
                </ModalHeader>
                <ModalBody>
                    <Job_Form props={data}/>
                </ModalBody>
            </Modal>

            <Table dataSource={applications}  scroll={{ x: true }} pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} entries`, style: { color: 'lightblue' }
            }}>
                <Table.Column dataIndex="key" key="key" render={(text, record, index) => index+1} />
                <Table.Column editable={true} title="Job Title" dataIndex="jobTitle" key="jobTitle" />
                <Table.Column editable={true} title="Position Type" dataIndex="positionType" key="positionType" />
                <Table.Column editable={true} title="Company" dataIndex="company" key="company" />
                <Table.Column editable={true} title="Date Applied" dataIndex="date_applied" key="date_applied" />
                <Table.Column editable={true} title="Application Deadline" dataIndex="application_Deadline" key="application_Deadline" />
                <Table.Column editable={true} title="Link" dataIndex="link" key="link"  render={(link) => 
                    (<a href={link} target="_blank" rel="noopener noreferrer">{link}</a>)}/>
                <Table.Column editable={true} title="Job Description" dataIndex="jobDescription" key="jobDescription"
                render={(text) => (
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                  )}
                   />
                <Table.Column editable={true} title="Action" key="action" render={(text, record, index) => (
                    <span>
                        <Button className="btn btn-primary" onClick={() => handleUpdate(record, index)}>Update</Button><br/><br/>
                        <Button className="btn btn-danger mr-2" onClick={() => handleDelete(record, index)}>Delete</Button>
                    </span>
                )} />
            </Table>
        </div>
    )
}
export default Application_Table