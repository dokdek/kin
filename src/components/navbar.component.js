import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "fontsource-roboto";
import {
  IconButton,
  makeStyles,
  Toolbar,
  Button,
  AppBar,
  CssBaseline,
  Typography,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Divider,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MenuIcon from "@material-ui/icons/Menu";
import getLists from "./helpers/getLists";
import CreateTransaction from "./create-transaction.component";
import AddCats from "./add-list.component";
import Axios from "axios";

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
  mainList: {},
  mainListText: {
    fontWeight: "bold",
  },
  dashboard: {
    fontWeight: "bold",
    fontSize: 18,
  },
}));

const Navbar = ({
  username,
  setFilterValue,
  setForceReload,
  forceReload,
  selectedDate,
  setSelectedDate,
  setAuth,
  setUsername,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();

  const [categoryList, setCategoryList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addTransOpen, setAddTransOpen] = useState(false);
  const [addCatOpen, setAddCatOpen] = useState(false);
  const [selected, setSelected] = useState();

  
  useEffect(() => {
    getLists(username, setCategoryList, setPaymentList);
  }, [username, forceReload]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function logout() {
    Axios.get("https://kin-site.herokuapp.com/users/logout", { withCredentials: true })
      .then(() => {
        setAuth(false);
        setUsername("");
        history.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function renderCategoryDrawerList(item) {
    const items = item.subCategories.map((value, index) => {
      return (
        <div>
          <ListItem
            button
            key={value.name}
            component={Link}
            to="/list"
            selected={selected === value.name}
            onClick={() => {
              setFilterValue({
                type: "subCategory",
                name: value.name,
              });
              console.log("click");
              setSelected(value.name);
            }}
          >
            <ListItemText>{value.name}</ListItemText>
          </ListItem>
          <Divider />
        </div>
      );
    });
    return [
      <div key={item.category}>
        <ListItem className={classes.mainList}>
          <ListItemText classes={{ primary: classes.mainListText }}>
            {item.category}
          </ListItemText>
        </ListItem>
      </div>,
      items,
    ];
  }

  function renderPaymentDrawerList(item) {
    const items = item.subPayments.map((value, index) => {
      return (
        <div>
          <ListItem
            button
            key={value}
            component={Link}
            to="/list"
            selected={selected === value}
            onClick={() => {
              setFilterValue({
                type: "subPayment",
                name: value,
              });
              console.log("click");
              setSelected(value);
            }}
          >
            <ListItemText>{value}</ListItemText>
          </ListItem>
          <Divider />
        </div>
      );
    });
    return [
      <div key={item.payment}>
        <ListItem className={classes.mainList}>
          <ListItemText classes={{ primary: classes.mainListText }}>
            {item.payment}
          </ListItemText>
        </ListItem>
      </div>,
      items,
    ];
  }

  const drawer = (
    <List>
      <ListItem
        button
        key="dashboard"
        component={Link}
        to="/catlist"
        onClick={() => setSelected("")}
      >
        <ListItemText classes={{ primary: classes.dashboard }}>
          Dashboard
        </ListItemText>
      </ListItem>
      {categoryList.map((cat) => renderCategoryDrawerList(cat))}{" "}
      {/*Passes each cat through the render function, read above*/}
      {paymentList.map((cat) => renderPaymentDrawerList(cat))}{" "}
      {/*Passes each cat through the render function, read above*/}
      <ListItem
        button
        key="add-main"
        onClick={() => {
          setAddCatOpen(true);
        }}
      >
        <ListItemText classes={{ primary: classes.dashboard }}>
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
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              variant="inline"
              inputVariant="outlined"
              size="small"
              value={selectedDate}
              autoOk={true}
              openTo="month"
              views={["year", "month"]}
              format="MM/yyyy"
              onChange={(e) => {
                setSelectedDate(e);
              }}
              style={{ width: 90 }}
            />
          </MuiPickersUtilsProvider>
          <Button onClick={() => setAddTransOpen(true)}>Add Transaction</Button>
          <Button style={{marginLeft: 'auto'}}onClick={() => logout()}>Logout</Button>
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
      <CreateTransaction
        username={username}
        open={addTransOpen}
        setOpen={setAddTransOpen}
        setForceReload={setForceReload}
        forceReload={forceReload}
      />
      <AddCats
        username={username}
        open={addCatOpen}
        setOpen={setAddCatOpen}
        setForceReload={setForceReload}
        forceReload={forceReload}
      />
    </div>
  );
};

export default Navbar;
