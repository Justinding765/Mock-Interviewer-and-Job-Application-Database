import Job_Form from "./Job_Form";
import NavBar from "./NavBar";
function Submit_Application() {
    return (
    <>
        <NavBar />
        <Job_Form props={{
                application_Deadline: "", 
                company: "", 
                createdAt: "", 
                date_applied: "", 
                jobDescription : "", 
                jobTitle: "", 
                link: "",
                positionType: "",
                updatedAt: "",
                __v: 0,
                _id: ""}}/>
    </>
    );
}
export default Submit_Application