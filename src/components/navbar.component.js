import React, { Component } from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import "fontsource-roboto";
import {
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles(() => ({
  typographyStyle: {
    flexGrow: 1,
    align: "center",
  },
  appBarStyle: {
    alignItems: "center",
  },
}));

const Navbar = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton>
          <MenuIcon></MenuIcon>
        </IconButton>
        <Button component={Link} to="/">
            List
        </Button>
        <Button component={Link} to="/newTransaction">
            Add
        </Button>
        <Button component={Link} to="/signup">
          New User
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
