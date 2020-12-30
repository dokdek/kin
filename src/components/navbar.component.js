import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "fontsource-roboto";
import {
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Button,
  AppBar,
  CssBaseline,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Divider
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import getLists from './helpers/getLists';
import renderCategorySelectGroup from './helpers/renderCategorySelectGroup';
import renderPaymentSelectGroup from './helpers/renderPaymentSelectGroup';
import CreateTransaction from './create-transaction.component';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  typographyStyle: {
    flexGrow: 1,
    align: "center",
  },
  appBarStyle: {
    alignItems: "center",
  },
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Navbar = ({ username, setFilterValue}) => {
  const theme = useTheme();
  const classes = useStyles();

  const [categoryList, setCategoryList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addTransOpen, setAddTransOpen] = useState(false);


  useEffect(() => {
    getLists(username, setCategoryList, setPaymentList);
    console.log(username);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function renderCategoryDrawerList(item) {
    const items = item.subCategories.map((value) => {
      return (
        <ListItem button key={value.name} component={Link} to="/list" onClick={()=>{setFilterValue({
          type: "subCategory",
          name: value.name
        })
      console.log("click")}}>
        <ListItemText>
          {value.name}
        </ListItemText>
        </ListItem>
      );
    });
    return [<div key={item.category}><ListItem><ListItemText>{item.category}</ListItemText></ListItem><Divider/></div>, items];
  }

  function renderPaymentDrawerList(item) {
    const items = item.subPayments.map((value) => {
      return (
        <ListItem button key={value} component={Link} to="/list" onClick={()=>{setFilterValue({
          type: "subPayment",
          name: value
        })
        console.log("click")}}>
        <ListItemText>
          {value}
        </ListItemText>
        </ListItem>
      );
    });
    return [<div key={item.payment}><ListItem><ListItemText>{item.payment}</ListItemText></ListItem><Divider/></div>, items];
  }

  const drawer = (
      <List>
        <ListItem button key='dashboard' component={Link} to="/catlist">
        <ListItemText>
          Dashboard
        </ListItemText>
        </ListItem>
        {categoryList.map((cat) => renderCategoryDrawerList(cat))} {/*Passes each cat through the render function, read above*/}
        <Divider/>
        {paymentList.map((cat) => renderPaymentDrawerList(cat))} {/*Passes each cat through the render function, read above*/}
        <Divider/>
        <ListItem button key='add-main'>
        <ListItemText>
          Add
        </ListItemText>
        </ListItem>
      </List>

  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Title
          </Typography>
          <Button onClick={()=>setAddTransOpen(true)}>
            Add Transaction
          </Button>
          <Button component={Link} to="/signup">
            New User
          </Button>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <CreateTransaction username={username} open={addTransOpen} setOpen={setAddTransOpen}/>
    </div>
  );
};

export default Navbar;
