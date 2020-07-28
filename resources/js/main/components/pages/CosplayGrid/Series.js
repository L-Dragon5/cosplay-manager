import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { Modal } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import SeriesEditForm from '../../forms/SeriesEditForm';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '65%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const Series = (props) => {
  const history = useHistory();
  const classes = useStyles();

  const { token } = props;
  let { id, characterCount } = props;

  id = id !== undefined ? id : null;
  characterCount =
    characterCount !== undefined
      ? characterCount + (characterCount === 1 ? ' Character' : ' Characters')
      : '0 Characters';

  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState(
    props.title !== undefined ? props.title : 'ERROR',
  );
  const [image, setImage] = useState(props.image);
  const [renderForm, setRenderForm] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const handleClick = () => {
    history.push(`/cosplay-management/s-${id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();

    if (
      confirm(
        `Are you sure you want to delete this series [${title}]? This will delete all characters and outfit in this series and is not reversible.`,
      )
    ) {
      const answer = prompt('Please enter DELETE to confirm.');

      if (answer === 'DELETE') {
        axios
          .get(`/api/series/destroy/${id}`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
              'content-type': 'multipart/form-data',
            },
          })
          .then((response) => {
            if (response.status === 200) {
              setSuccessAlertMessage(response.data.message);
              setVisible(false);
            }
          })
          .catch((error) => {
            if (error.response) {
              let message = '';

              Object.keys(error.response.data.message).forEach((key) => {
                message += `[${key}] - ${error.response.data.message[key]}\r\n`;
              });

              setErrorAlertMessage(message);
            }
          });
      } else {
        setErrorAlertMessage('Deletion cancelled');
      }
    }
  };

  const handleFormUnmount = (data) => {
    const obj = JSON.parse(data);
    if (obj) {
      setTitle(obj.title);
      setImage(obj.image);
    }

    setRenderForm(false);
  };

  const modalOpen = () => {
    setRenderForm(true);
    setModalStatus(true);
  };

  const modalClose = () => {
    setModalStatus(false);
  };

  if (visible) {
    const modalName = `series-single-modal-${id}`;

    if (title && image) {
      return (
        <>
          {errorAlertMessage && (
            <Alert severity="error" style={{ whiteSpace: 'pre' }}>
              {errorAlertMessage}
            </Alert>
          )}

          {successAlertMessage && (
            <Alert severity="success">{successAlertMessage}</Alert>
          )}

          <div className="series" onClick={handleClick}>
            <div className="series__image">
              <img src={image} draggable={false} />
            </div>
            <div className="series__title">
              <div
                className="series__icon modal-trigger"
                data-target={modalName}
                onClick={(e) => e.stopPropagation()}
              >
                <a className="btn-flat teal lighten-2" onClick={modalOpen}>
                  <i className="material-icons">edit</i>
                </a>
              </div>

              <div className="series__title__text">
                {title}
                <br />
                {characterCount}
              </div>

              <div className="series__icon" onClick={handleDelete}>
                <a className="btn-flat red lighten-2">
                  <i className="material-icons">delete</i>
                </a>
              </div>
            </div>
          </div>

          {renderForm ? (
            <Modal
              open={modalStatus}
              onClose={modalClose}
              disableEnforceFocus
              disableAutoFocus
            >
              <div className={classes.paper}>
                <SeriesEditForm
                  token={token}
                  id={id}
                  title={title}
                  unmount={handleFormUnmount}
                />
              </div>
            </Modal>
          ) : null}
        </>
      );
    }
  }

  return null;
};

export default Series;
