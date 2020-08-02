import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Box,
  IconButton,
  TextField,
  Snackbar,
  Typography,
} from '@material-ui/core';
import { Alert, TreeView, TreeItem } from '@material-ui/lab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  heading: {
    marginBottom: theme.spacing(2),
  },
  addTagField: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  buttons: {
    marginLeft: theme.spacing(2),
  },
}));

const TagManager = () => {
  const classes = useStyles();
  const token = Helper.getToken();

  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState('');
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const [tags, setTags] = useState(null);

  const getTags = () => {
    axios
      .get('/api/tags', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setTags(response.data);
        }
      })
      .catch((error) => {
        if (error.response) {
          let message = '';

          if (Array.isArray(error.response)) {
            Object.keys(error.response.data.message).forEach((key) => {
              message += `[${key}] - ${error.response.data.message[key]}\r\n`;
            });
          } else {
            message += error.response.data.message;
          }

          setErrorAlertMessage(message);
          setSnackbarStatus(true);
        }
      });
  };

  const handleAddTag = (e, parentId) => {
    e.persist();

    if (e.key === 'Enter') {
      const formData = new FormData();
      formData.set('title', e.target.value);
      formData.set('parent_id', parentId);

      axios
        .post('/api/tag/create', formData, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            e.target.value = null;
            setSuccessAlertMessage(response.data.message);
            setSnackbarStatus(true);
            getTags();
          }
        })
        .catch((error) => {
          if (error.response) {
            let message = '';

            if (Array.isArray(error.response)) {
              Object.keys(error.response.data.message).forEach((key) => {
                message += `[${key}] - ${error.response.data.message[key]}\r\n`;
              });
            } else {
              message += error.response.data.message;
            }

            setErrorAlertMessage(message);
            setSnackbarStatus(true);
          }
        });
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();

    const newTitle = prompt('Please enter the new tag title.');

    if (newTitle !== null) {
      const formData = new FormData();
      formData.set('title', newTitle);

      axios
        .post(`/api/tag/update/${id}`, formData, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setSuccessAlertMessage(response.data.message);
            setSnackbarStatus(true);
            getTags();
          }
        })
        .catch((error) => {
          if (error.response) {
            let message = '';

            if (Array.isArray(error.response)) {
              Object.keys(error.response.data.message).forEach((key) => {
                message += `[${key}] - ${error.response.data.message[key]}\r\n`;
              });
            } else {
              message += error.response.data.message;
            }

            setErrorAlertMessage(message);
            setSnackbarStatus(true);
          }
        });
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();

    if (
      confirm(
        `Are you sure you want to delete this tag? This will delete all associations to this tag and is not reversible.`,
      )
    ) {
      axios
        .get(`/api/tag/destroy/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'content-type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setSuccessAlertMessage(response.data.message);
            setSnackbarStatus(true);
            getTags();
          }
        })
        .catch((error) => {
          if (error.response) {
            let message = '';

            if (Array.isArray(error.response)) {
              Object.keys(error.response.data.message).forEach((key) => {
                message += `[${key}] - ${error.response.data.message[key]}\r\n`;
              });
            } else {
              message += error.response.data.message;
            }

            setErrorAlertMessage(message);
            setSnackbarStatus(true);
          }
        });
    }
  };

  const renderTree = (nodes) => {
    const buttons = (
      <>
        <Box component="span">{nodes.title}</Box>
        <Box component="span" className={classes.buttons}>
          <IconButton
            size="small"
            color="secondary"
            onClick={(e) => {
              handleEdit(e, nodes.id);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={(e) => {
              handleDelete(e, nodes.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </>
    );

    return (
      <TreeItem key={nodes.id} nodeId={nodes.id.toString()} label={buttons}>
        {nodes.children !== undefined && Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
        <TextField
          label="Add tag"
          onKeyPress={(e) => handleAddTag(e, nodes.id)}
          className={classes.addTagField}
        />
      </TreeItem>
    );
  };

  const snackbarClose = () => {
    setSnackbarStatus(false);
    setSuccessAlertMessage('');
    setErrorAlertMessage('');
  };

  useEffect(() => {
    getTags();
    document.title = 'Tag Manager | CosManage';
  }, []);

  return (
    <Box className={classes.root}>
      <Typography variant="h4" className={classes.heading}>
        Tags
      </Typography>

      {errorAlertMessage && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={snackbarStatus}
          onClose={snackbarClose}
          autoHideDuration={2000}
        >
          <Alert severity="error" style={{ whiteSpace: 'pre' }}>
            {errorAlertMessage}
          </Alert>
        </Snackbar>
      )}

      {successAlertMessage && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={snackbarStatus}
          onClose={snackbarClose}
          autoHideDuration={2000}
        >
          <Alert severity="success">{successAlertMessage}</Alert>
        </Snackbar>
      )}

      <Box>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {tags && tags.map((item) => renderTree(item))}
        </TreeView>
        <TextField
          label="Add tag"
          onKeyPress={(e) => handleAddTag(e, 0)}
          className={classes.addTagField}
        />
      </Box>
    </Box>
  );
};

export default TagManager;
