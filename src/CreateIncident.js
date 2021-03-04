import { Form, Container, Navbar, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css'
import { Controller, useForm } from 'react-hook-form'
import 'react-image-crop/dist/ReactCrop.css';
import Cropper from './Cropper';
import PhotoUploadList from './PhotoUploadList';


const photoCategories = [
    {
        id: 'detector',
        formLabel: 'Detector'
    },
    {
        id: 'sub_alarm_panel',
        formLabel: 'Sub Alarm Panel'
    },
    {
        id: 'main_alarm_panel',
        formLabel: 'Main Alarm Panel'
    },
    {
        id: 'others',
        formLabel: 'Other Supporting Pictures (Site Area or Layout Plan)'
    },
]



function CreateIncident({ incident, onSubmit, onCancel, error, isSaving }) {
    const { register, handleSubmit, control, setValue: setFormValue, getValues } = useForm({
        defaultValues: incident
    })
    const [imageToCrop, setImageToCrop] = useState({ photoCategory: { id: "", formLabel: "" }, src: "" })

    const onFormSubmit = async (form) => {
        onSubmit(form)
    }

    const onImageCropConfirm = async (category, { data, size }) => {
        setFormValue(category, [...getValues(category), { data, size }])
        setImageToCrop({ photoCategory: { id: "", formLabel: "" }, src: "" })
    }

    return (
        <>
            { error &&
                <div className="d-flex justify-content-center">
                    <div className="alert alert-danger position-fixed" style={{ zIndex: 99999, bottom: 0 }} role="alert">
                        Error saving. Please try again!
                    </div>
                </div>
            }
            <Form onSubmit={handleSubmit(onFormSubmit)}>
                <Navbar className="py-3" bg="dark" variant="dark" sticky="top">
                    <Button variant="secondary" className="mr-auto" onClick={onCancel}>Cancel</Button>
                    <Navbar.Brand color="light" className="mx-auto">Add Incident</Navbar.Brand>
                    <Button variant="primary" type="submit" className="ml-auto">
                        {isSaving ?
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            : "Submit"
                        }
                    </Button>
                </Navbar>
                <Container className="pt-2">
                    <Form.Group>
                        <Form.Label>Incident No.</Form.Label>
                        <Form.Control required ref={register} name="incident_no" placeholder="" readOnly={!!incident.incident_no} />
                    </Form.Group>
                    {/* <Form.Group>
                <Form.Label>Stop Message</Form.Label>
                <Form.Control ref={register} name="stop_message" as="textarea" rows={4} placeholder="" />
                </Form.Group> */}
                    {photoCategories.map(photoCategory =>
                        <Form.Group key={photoCategory.id}>
                            <Form.Label>{photoCategory.formLabel}</Form.Label>
                            <Controller
                                control={control}
                                name={photoCategory.id}
                                render={({ onChange, value }) =>
                                    <PhotoUploadList
                                        photoCategoryId={photoCategory.id}
                                        photos={value}
                                        onPhotoUpload={(photo) => setImageToCrop({
                                            photoCategory,
                                            src: photo
                                        })}
                                        onPhotoRemove={(dataOfPhotoToBeRemoved) => {
                                            // This won't work if two of the same photos are uploaded
                                            // If one of the two photos were removed, the other one would as well
                                            const remainingPhotos = value.filter((photo) => photo.data !== dataOfPhotoToBeRemoved)
                                            setFormValue(photoCategory.id, remainingPhotos)
                                        }}
                                    />
                                }
                                defaultValue={[]}
                            />
                        </Form.Group>
                    )
                    }
                    {
                        imageToCrop.photoCategory.id &&
                        <Cropper
                            title={imageToCrop.photoCategory.formLabel}
                            onConfirm={({ data, size }) => onImageCropConfirm(imageToCrop.photoCategory.id, { data, size })}
                            imageToCrop={imageToCrop}
                            onClose={() => setImageToCrop({ photoCategory: { id: "", formLabel: "" }, file: "" })}
                        />
                    }
                </Container>
            </Form>
        </>
    )
}

export default CreateIncident