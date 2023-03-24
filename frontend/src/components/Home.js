import {useEffect, useState} from 'react'
import Banner from "./Banner";
import NavBar from './NavBar'
import { Navbar, Nav, Container, Row, Col, Button} from "react-bootstrap";
import Intro from './Intro_anime'
const Home = () =>{
    return (
        <div >
            <NavBar/>
            <section className='Intro'>
                <Intro />
            </section>
            <section className="Features">
                <Container >
                    <h1>Features</h1><br/>
                    <Row >
                    <Col md={3} className="Feature">
                        <h2 >Mock Interview</h2>
                        <p>Practice your interview skills with our mock interview feature! Use our AI powered Interview Generator to 
                            Generate your own custom Interview. The User can then conduct their interview with Text-to-Speech
                            that acts as the Interviewer and record their interview. At the end the User can save their recording
                            to their very own media gallery! 
                        </p>
                        <Button href="/Practice">Get Started</Button>
                    </Col>
                    <Col md={3} className="Feature">
                        <h2>Media Gallery</h2>
                        <p>Browse your collection of interview recordings. Rewatch previous interview recordings and learn. Offers
                            widgets for organizationing your gallery, such as deleting recordings you no longer need </p>
                        <Button href="/Media">Get Started</Button>
                    </Col>
                    <Col md={3} className="Feature">
                        <h2>Application Database</h2>
                        <p>Allows users to see all the job applications that they have applied for in an organized manner. Users can
                            add, delete and update their applications. Has built in job application form that the user
                            will user to submit or update their applications. This form contains an AI powered job summarizer which 
                            automatically summarizes long job descriptions. </p>
                        <Button href="/Applications">Get Started</Button>
                    </Col>
                    </Row>
                </Container>
            </section>

            <section className="About">
                <Container >
                <h1>About</h1><br/>
                <p>
                    Hi everyone,<br/> <br/>
                    My rational behind this website was to enable indivduals themselves to improve their interview skills 
                    and store their job applications in neat and organized manner. 
                    <br/><br/>As the job market becomes
                    increasingly competitive, I think it's essential to find ways to seperate yourself from the rest of the 
                    competition. One great way to do that, is perfecting your interview skills through tons of practice. I have
                    always found that recording oneself is an excellet way to learn, especially when it comes to presentations. 
                    You can catch so many things such as body language, and tone of voice just by watching recordings of oneself <br/>
                    <br/> 
                    It is also very hard to keep track of all your job applications. During a job search process, you can apply for hundreds of jobs and it gets 
                    difficult to keep track of everything. Additionally, many of the job postings get taken down and won't be accessible if you were to 
                    need them again. Thus, I designed a job appliation database to store all of an indivudals job applications in a neat and accesbile  manner.  
                </p>
                </Container>
            </section>
        </div>
    )
}
export default Home