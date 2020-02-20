import React, {useState, useEffect} from 'react';
import Patient from '../PatientComponents/Patient'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import PatientData from '../ModelJSON/Patients.json'
import { render } from '@testing-library/react';

const DoctorView = () => {
    const [patients, setPatient] = useState(PatientData.patients)

const renderPatients = () => {
    render(
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            >
        {
            patients.map((p, i) => {
                return(
                    <Grid item xs={6}>
                        <Patient 
                        name={p.name} 
                        photo={p.photo}
                        profile={p.profile}
                        />
                    </Grid>
                )
        })
        }
        </Grid>
    )
}
    return ( 
        <Container fixed>
            <h2>Patient Dashboard</h2>
            {renderPatients()}
        </Container>
    );
}

export default DoctorView;




