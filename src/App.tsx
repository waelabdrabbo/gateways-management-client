import { Outlet, NavLink } from "react-router-dom";
import { AppBar, Drawer, Divider, List, Paper, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, ListItemButton, CssBaseline } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AbcIcon from '@mui/icons-material/Abc';
import DevicesIcon from '@mui/icons-material/Devices';
import { Provider } from 'react-redux'
import { store } from "./store/store";

interface ListItemLinkProps {
  icon?: React.ReactElement;
  text: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, text, to } = props;

  return (
    <ListItem disablePadding>
      <ListItemButton component={NavLink} to={to} key={text}  sx={{ "&.active": { background: "lightgrey" } }}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}

function App() {
  const drawerWidth = 240;
  return (
    <>
      <Provider store={store}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }} >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Gateways Management
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }} variant="permanent" anchor="left">
            <Toolbar> <AbcIcon sx={{ fontSize: 40 }} /> </Toolbar>

            <Divider />
            <Paper elevation={0}>
              <List aria-label="main">
                <ListItemLink to="/" text="Gateways" icon={<HomeIcon />} />
                <ListItemLink to="/devices" text="Devices" icon={<DevicesIcon />} />
              </List>
            </Paper>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </Provider>
    </>
  )
}

export default App
