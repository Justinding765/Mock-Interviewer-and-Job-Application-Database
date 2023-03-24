import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Row, Col, Button, Form} from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const Forum = () => {
    const [response, setResponse] = useState(null);
    const [outputText, setOuputText] = useState('');
    const [value, setValue] = useState("")

    function handleOnChange(e, editor) {
        const data = editor.getData()
        console.log(data)
        setValue(data);
    }
    
    async function handleClick() {
        const res = await fetch('/api/info/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: value })
        });
        const data = await res.json();
        console.log(data)
        setOuputText(data.data);
      }
    return(
        <section className="forum">
            <Container>
                
                <Row>
                <Col xl={6}>
                        <CKEditor  data=""editor={ClassicEditor} onChange={handleOnChange} />
                    <Button  onClick={handleClick} variant="primary">Click me!</Button></Col>
                    <Col  xl={6}>
                        <CKEditor  data={outputText} editor={ClassicEditor} onChange={handleOnChange} />
                    </Col>
                </Row>

            </Container>
        </section>
    )
}
export default Forum

