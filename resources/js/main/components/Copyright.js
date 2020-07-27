import React from 'react';
import { Typography } from '@material-ui/core';

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Copyright © CosManage {new Date().getFullYear()}
    </Typography>
  );
};

export default Copyright;
