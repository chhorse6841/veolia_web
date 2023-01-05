import React from 'react';
import { Container, CircularProgress, Paper } from '@material-ui/core';
export const Progress = (props) => (
  <Container component={Paper} maxWidth="xs" className={props.container} align="center">
    <CircularProgress />
  </Container>
);
