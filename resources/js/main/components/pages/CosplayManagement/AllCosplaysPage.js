import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

// Components
import Helper from '../../Helper';
// import OutfitCard from './OutfitCard';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  filters: {
    margin: '16px 0 32px',
  },
  searchInput: {
    paddingRight: '16px',
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
  const [allTags, setAllTags] = useState([]); // All tag options

  const [checkboxes, setCheckboxes] = useState({
    futureCheckbox: true,
    ownedUnwornCheckbox: true,
    wornCheckbox: true,
  });

  const [errorAlertMessage, setErrorAlertMessage] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleChange = (e) => {
    setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  };

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
          const tagArray = [];

          Object.keys(response.data).forEach((tag) => {
            tagArray.push({ value: tag.id, lable: tag.title });
          });

          setAllTags(tagArray);
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

          Object.keys(error.response.data.message).forEach((key) => {
            message += `[${key}] - ${error.response.data.message[key]}\r\n`;
          });

          setErrorAlertMessage(message);
        }
      });
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
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        case 2: // Unworn Only
          setOutfits(
            allOutfits.filter(
              (item) =>
                item.status === 1 &&
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        case 3: // Future + Unworn
          setOutfits(
            allOutfits.filter(
              (item) =>
                (item.status === 0 || item.status === 1) &&
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        case 4: // Worn Only
          setOutfits(
            allOutfits.filter(
              (item) =>
                item.status === 2 &&
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        case 5: // Future + Worn
          setOutfits(
            allOutfits.filter(
              (item) =>
                (item.status === 0 || item.status === 2) &&
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        case 6: // Unworn + Worn
          setOutfits(
            allOutfits.filter(
              (item) =>
                (item.status === 1 || item.status === 2) &&
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        case 7: // Future + Unworn + Worn
          setOutfits(
            allOutfits.filter(
              (item) =>
                String(item.title).toLowerCase().indexOf(lowerSearch) !== -1,
            ),
          );
          break;
        default:
          break;
      }
    }
  }, [filter, search]);

  useEffect(() => {
    document.title = 'All Cosplays | CosManage';
    getTags();
    getOutfits();
  }, []);

  return (
    <Box className={classes.root}>
      <Typography variant="h4">All Cosplays</Typography>

      {errorAlertMessage && (
        <Alert severity="error" style={{ whiteSpace: 'pre' }}>
          {errorAlertMessage}
        </Alert>
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
        <Grid item xs={12} md={6}>
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
            return <div>{item.character_name}</div>;
          })}
      </Box>
    </Box>
  );
};

/**
 * <OutfitCard
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
                allTags={allTags}
                storage_location={item.storage_location}
                times_worn={item.times_worn}
              />
 */

export default AllCosplaysPage;
