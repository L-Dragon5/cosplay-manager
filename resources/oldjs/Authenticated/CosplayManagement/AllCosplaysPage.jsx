import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LazyLoad, { forceCheck } from 'react-lazyload';

import {
  Box,
  Typography,
  Grid,
  TextField,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';
import OutfitCard from './OutfitCard';
import PublicLink from '../../PublicLink';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  filters: {
    margin: '16px 0 32px',
  },
  searchInput: {
    paddingRight: '16px',
  },
  checkboxes: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
}));

const AllCosplaysPage = () => {
  const classes = useStyles();
  const token = Helper.getToken();

  /**
   * Filter
   * 0 = none
   * 1 = future
   * 2 = owned & unworn
   * 4 = worn
   */
  const [allOutfits, setAllOutfits] = useState(null); // All outfits available
  const [outfits, setOutfits] = useState(null); // Outfits being displayed
  const [search, setSearch] = useState(''); // Search input
  const [filter, setFilter] = useState(7); // Filter mask

  const [checkboxes, setCheckboxes] = useState({
    futureCheckbox: true,
    ownedUnwornCheckbox: true,
    wornCheckbox: true,
  });

  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChange = (e) => {
    setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  };

  const getOutfits = () => {
    axios
      .get('/api/outfits/', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data) {
          setAllOutfits(response.data);
          setOutfits(response.data);
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

  const snackbarClose = () => {
    setSnackbarStatus(false);
    setErrorAlertMessage('');
  };

  // Set filter mask based on checkboxes.
  useEffect(() => {
    let mask = 0;

    if (checkboxes.futureCheckbox) {
      mask += 1;
    }

    if (checkboxes.ownedUnwornCheckbox) {
      mask += 2;
    }

    if (checkboxes.wornCheckbox) {
      mask += 4;
    }

    setFilter(mask);
  }, [checkboxes]);

  // Set outfits based on search and filters.
  useEffect(() => {
    const lowerSearch = String(search).toLowerCase();

    if (allOutfits !== null) {
      switch (filter) {
        case 0: // None
          setOutfits(null);
          break;
        case 1: // Future Only
          setOutfits(
            allOutfits.filter(
              (item) =>
                item.status === 0 &&
                (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                  String(item.character_name)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 2: // Unworn Only
          setOutfits(
            allOutfits.filter(
              (item) =>
                item.status === 1 &&
                (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                  String(item.character_name)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 3: // Future + Unworn
          setOutfits(
            allOutfits.filter(
              (item) =>
                (item.status === 0 || item.status === 1) &&
                (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                  String(item.character_name)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 4: // Worn Only
          setOutfits(
            allOutfits.filter(
              (item) =>
                item.status === 2 &&
                (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                  String(item.character_name)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 5: // Future + Worn
          setOutfits(
            allOutfits.filter(
              (item) =>
                (item.status === 0 || item.status === 2) &&
                (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                  String(item.character_name)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 6: // Unworn + Worn
          setOutfits(
            allOutfits.filter(
              (item) =>
                (item.status === 1 || item.status === 2) &&
                (String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                  String(item.character_name)
                    .toLowerCase()
                    .indexOf(lowerSearch) !== -1 ||
                  item.tags.filter((tag) => {
                    return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                  }).length > 0),
            ),
          );
          break;
        case 7: // Future + Unworn + Worn
          setOutfits(
            allOutfits.filter(
              (item) =>
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
                String(item.character_name)
                  .toLowerCase()
                  .indexOf(lowerSearch) !== -1 ||
                item.tags.filter((tag) => {
                  return tag.label.toLowerCase().indexOf(lowerSearch) !== -1;
                }).length > 0,
            ),
          );
          break;
        default:
          break;
      }
    }
  }, [filter, search]);

  useEffect(() => {
    forceCheck();
  }, [outfits]);

  useEffect(() => {
    document.title = 'All Cosplays | CosManage';
    getOutfits();
  }, []);

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>
        <Typography component="span" variant="h4">
          All Cosplays
        </Typography>

        <PublicLink />
      </Box>

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

      <Grid container className={classes.filters}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search"
            id="search"
            name="search"
            variant="outlined"
            className={classes.searchInput}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.checkboxes}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Filters</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkboxes.futureCheckbox}
                    name="futureCheckbox"
                    onChange={handleChange}
                  />
                }
                label="Future"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkboxes.ownedUnwornCheckbox}
                    name="ownedUnwornCheckbox"
                    onChange={handleChange}
                  />
                }
                label="Owned & Unworn"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkboxes.wornCheckbox}
                    name="wornCheckbox"
                    onChange={handleChange}
                  />
                }
                label="Worn"
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Box className="outfit-grid">
        {outfits &&
          outfits.map((item) => {
            return (
              <LazyLoad key={`lazy-${item.id}`} height={600} once offset={100}>
                <OutfitCard
                  key={`o-${item.id}`}
                  token={token}
                  id={item.id}
                  character_name={item.character_name}
                  title={item.title}
                  images={item.images}
                  status={item.status}
                  obtained_on={item.obtained_on}
                  creator={item.creator}
                  tags={item.tags}
                  storage_location={item.storage_location}
                  times_worn={item.times_worn}
                />
              </LazyLoad>
            );
          })}
      </Box>
    </Box>
  );
};

export default AllCosplaysPage;
