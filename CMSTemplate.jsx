import React from "react";
import {
  Container, Button, Modal, ModalHeader,
  ModalBody, Form, FormGroup, Label,
  ModalFooter, Row, Col
} from "reactstrap";
import debug from "sabio-debug";
import CmsTemplateCard from "./CmsTemplateCard";
import * as cmsTemplateService from "../../../services/cmsTemplateService";
import Swal from "sweetalert2";
import { Formik, Field, ErrorMessage } from "formik";
import { ValidationSchema } from "./cmsTemplateValidationSchema";
import Styles from "./cmsStyles.module.css";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const _logger = debug.extend("CmsTemplate");


class CmsTemplate extends React.Component {


  state = {
    cmsTemplates: [],
    mappedCmsTemplates: [],

    toggleModal: false,
    isAdding: false,
    isEditing: false,

    formData: {
      name: '',
      description: '',
      primaryImage: '',
    },

    pagination: {
      current: 0,
      pageIndex: 0,
      totalPages: 0,
      totalCount: 0,
      pageSize: 4,
    }

  }

  componentDidMount = () => {
    _logger("component did mount")

    this.getCmsTemplates(this.state.pagination.pageIndex, this.state.pagination.pageSize)
  }

  getCmsTemplates = (pageIndex, pageSize) => {
    cmsTemplateService.getAll(pageIndex, pageSize)
      .then(this.onGetCmsTemplatesSuccess)
      .catch(this.onError)
  }

  onError = (error) => {
    _logger(error)
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "There is an error loading this page"
    })
  }

  onGetCmsTemplatesSuccess = (response) => {
    _logger(response)
    let cmsTemplates = response.item.pagedItems;
    let pageIndex = response.item.pageIndex;
    let pageSize = response.item.pageSize;
    let totalPages = response.item.totalPages;
    let totalCount = response.item.totalCount;
    this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        pageIndex,
        totalPages,
        totalCount,
        pageSize
      },
      cmsTemplates,
    }));
    this.renderCmsTemplates(cmsTemplates)
  }

  renderCmsTemplates = (cmsTemplates) => {
    _logger("setting state", cmsTemplates)
    this.setState(prevState => {
      return {
        ...prevState,
        mappedCmsTemplates: cmsTemplates.map(this.mapCmsTemplates)
      }
    })
  }

  mapCmsTemplates = (cmsTemplate) => (
    <CmsTemplateCard
      cmsTemplate={cmsTemplate}
      key={cmsTemplate.id}
      handleEdit={this.handleEdit}
      handleDelete={this.handleDelete}>
    </CmsTemplateCard>
  );


  handleEdit = (cmsTemplate) => {
    _logger("setting state", cmsTemplate)
    this.toggleModal();
    this.setState(prevState => {
      return {
        ...prevState,
        formData: cmsTemplate,
        isEditing: !this.state.isEditing
      }
    });
  };

  handleDelete = (cmsTemplate) => {
    _logger("retrieved id: ", cmsTemplate.id)
    cmsTemplateService.deleteCMSTemplate(cmsTemplate.id)
      .then(Swal.fire({
        icon: 'success',
        title: 'Congrats!',
        text: `You have just deleted ${cmsTemplate.name}`
      }))
      .then(this.getCmsTemplates(this.state.pagination.pageIndex, this.state.pagination.pageSize))
      .catch(this.onError)
  };

  addCmsTemplateButtonHandler = (e) => {
    e.preventDefault();
    this.toggleModal()
    this.setState(prevState => {
      return {
        ...prevState,
        isAdding: !this.state.isAdding
      }
    })
  };



  handleSubmit = (payload, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    if (payload.id > 0) {
      cmsTemplateService.updateCMSTemplate(payload.id, payload)
        .then(Swal.fire({
          icon: 'success',
          title: 'Congrats!',
          text: `You have updated ${payload.name}`
        }))
        .then(this.toggleEditModal)
        .then(this.getCmsTemplates(this.state.pagination.pageIndex, this.state.pagination.pageSize))
        .catch(this.onError)
    }
    else {
      cmsTemplateService.addCMSTemplate(payload)
        .then(Swal.fire({
          icon: 'success',
          title: 'Congrats!',
          text: `You have created a new template`
        }))
        .then(this.toggleAddModal)
        .catch(this.onError)
    }
    _logger("submitting")
    resetForm();
    setSubmitting(false)
  };

  onChangePage = (page) => {
    this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        current: page
      }
    })
    )
    this.getCmsTemplates(page - 1, this.state.pagination.pageSize)
  }

  toggleModal = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        formData: {},
        toggleModal: !this.state.toggleModal,
      }
    })
    if (this.state.isAdding) {
      this.setState(prevState => {
        return {
          ...prevState,
          isAdding: !this.state.isAdding
        }
      })
    }
    if (this.state.isEditing) {
      this.setState(prevState => {
        return {
          ...prevState,
          isEditing: !this.state.isEditing
        }
      })
    }
  }

  render() {
    _logger("rendering")
    return (
      <React.Fragment>
        <Container className="jumbotron">
          <div className="header">
            <h3 className="text-center">CMS Template</h3>
            <div className="d-flex flex-row justify-content-center">
              <Button
                className="btn mr-2 btn-pill"
                type="button"
                name="addButton"
                color="success"
                onClick={this.addCmsTemplateButtonHandler}>
                Add
                            </Button>
            </div>
          </div>
        </Container>
        <div>
          <Row className="d-flex justify-content-center">
            {this.state.mappedCmsTemplates.length > 0 ? this.state.mappedCmsTemplates : "No Records Found"}
          </Row>
          <div className="d-flex justify-content-center">
            <Row>
              <Col sm="12">
                <div role="group" className="btn-group">
                  <Pagination
                    onChange={this.onChangePage}
                    current={this.state.pagination.current}
                    total={this.state.pagination.totalCount}
                    defaultPageSize={4}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <Modal isOpen={this.state.toggleModal}>
          <ModalHeader
            toggle={this.toggleModal}
            className="text-uppercase pr-auto pl-auto"
          >
            {(this.state.isEditing && !this.state.isAdding &&
              <span>Edit a CMS Template</span>)
              ||
              (this.state.isAdding && !this.state.isEditing &&
                <span>Add a CMS Template</span>
              )}
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                id: this.state.formData.id,
                name: this.state.formData.name,
                description: this.state.formData.description,
                primaryImage: this.state.formData.primaryImage,
                createdBy: this.state.formData.createdBy
              }}
              validationSchema={ValidationSchema}
              onSubmit={this.handleSubmit}
            >
              {({ values,
                handleBlur,
                handleSubmit,
                isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>

                    <FormGroup>
                      <Label for="name">Name </Label>
                      <br />
                      <Field
                        name="name"
                        placeholder={this.state.isEditing ?
                          this.state.formData.name : "Name..."}
                        onBlur={handleBlur}
                        value={values.name}
                        className="form-control"
                      >
                      </Field>
                      <ErrorMessage
                        name="name"
                        className={Styles.errorMessage} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">
                        Description
                                    </Label>
                      <br />
                      <Field
                        component="textarea"
                        cols="100"
                        rows="5"
                        name="description"
                        placeholder={this.state.isEditing ?
                          this.state.formData.description :
                          "Description..."}
                        onBlur={handleBlur}
                        value={values.description}
                        className="form-control"
                      >
                      </Field>
                      <ErrorMessage
                        name="description"
                        className={Styles.errorMessage} />
                    </FormGroup>
                    <FormGroup>
                      <Label for="primaryImage">Primary Image</Label>
                      <br />
                      <Field
                        name="primaryImage"
                        placeholder={this.state.isEditing ?
                          this.state.formData.primaryImage :
                          "Primary Image..."}
                        onBlur={handleBlur}
                        value={values.primaryImage}
                        className="form-control"
                      >
                      </Field>
                      <ErrorMessage
                        name="primaryImage"
                        className={Styles.errorMessage} />
                    </FormGroup>
                    <Button
                      type="submit"
                      color="success"
                      disabled={isSubmitting}
                    >
                      {this.state.isEditing ? "Edit" : "Add"}
                    </Button>
                  </Form>
                )}

            </Formik>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              type="button "
              onClick={this.toggleModal}

            >Cancel</Button>
          </ModalFooter>
        </Modal>

      </React.Fragment>
    )
  }
}

export default CmsTemplate