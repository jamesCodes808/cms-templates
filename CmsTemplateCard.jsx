import React from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardFooter,
  Button,
  Col,
} from "reactstrap";
import PropTypes from "prop-types";

const CmsTemplateCard = (props) => {
  const deleteHandler = () => {
    props.handleDelete(props.cmsTemplate);
  };

  const editHandler = () => {
    props.handleEdit(props.cmsTemplate);
  };

  return (
    <Col sm="3" style={{ width: "18rem" }}>
      <Card className="card height-equal">
        <div className="card-header">
          <CardTitle height="10%" width="90%">
            {props.cmsTemplate.name}
          </CardTitle>
        </div>
        <CardBody className="card-body">
          <CardImg
            height="50%"
            width="90%"
            src={props.cmsTemplate.primaryImage}
            alt="Card image cap"
          />
          <CardText height="10%" width="90%">
            {props.cmsTemplate.description}
          </CardText>
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            size="sm"
            className="float-left btn-pill"
            onClick={editHandler}
          >
            Edit
          </Button>

          <Button
            color="danger"
            size="sm"
            className="float-right btn-pill"
            onClick={deleteHandler}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </Col>
  );
};

CmsTemplateCard.propTypes = {
  cmsTemplate: PropTypes.arrayOf(
    PropTypes.shape({
      createdBy: PropTypes.number,
      dateCreated: PropTypes.string,
      dateModified: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      primaryImage: PropTypes.string,
    })
  ),
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
};

export default CmsTemplateCard;
