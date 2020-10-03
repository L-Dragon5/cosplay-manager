import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LazyLoad, { forceCheck } from 'react-lazyload';

import { Box, Grid, TextField, CssBaseline } from '@material-ui/core';

import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles';
import { orange, pink } from '@material-ui/core/colors';

import OutfitCard from './components/pages/CosplayManagement/OutfitCard';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: pink,
  },
});

const useStyles = makeStyles(() => ({
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

const PublicSharedPage = () => {
  const classes = useStyles();

  const [allOutfits, setAllOutfits] = useState(null); // All outfits available
  const [outfits, setOutfits] = useState(null); // Outfits being displayed
  const [search, setSearch] = useState(''); // Search input

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const getAll = () => {
    const uuid = window.location.pathname.substring(3);
    axios
      .get(`/api/all/${uuid}`, {
        headers: {
          Accept: 'application/json',
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
          window.location.replace('/');
        }
      });
  };

  // Set outfits based on search and filters.
  useEffect(() => {
    const lowerSearch = String(search).toLowerCase();

    if (allOutfits !== null) {
      setOutfits(
        allOutfits.filter(
          (item) =>
            String(item.title).toLowerCase().indexOf(lowerSearch) !== -1 ||
            String(item.character_name).toLowerCase().indexOf(lowerSearch) !==
              -1,
        ),
      );
    }
  }, [search]);

  useEffect(() => {
    forceCheck();
  }, [outfits]);

  useEffect(() => {
    document.title = 'CosManage';
    getAll();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={classes.root}>
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
        </Grid>

        <Box className="outfit-grid">
          {outfits &&
            outfits.map((item) => {
              return (
                <LazyLoad
                  key={`lazy-${item.id}`}
                  height={600}
                  once
                  offset={100}
                >
                  <OutfitCard
                    key={`o-${item.id}`}
                    token={null}
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
    </ThemeProvider>
  );
};

export default PublicSharedPage;
