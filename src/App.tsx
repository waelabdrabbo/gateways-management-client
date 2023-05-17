import { Outlet, Link } from "react-router-dom";
import CssBaseline from '@mui/joy/CssBaseline';
import { AppBar, Drawer, Divider, List, Paper, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import { Provider } from 'react-redux'
import { store } from "./store/store";
interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  return (
    <li>
      <ListItem button component={Link} to={to}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

function App() {
  const drawerWidth = 240;

  return (
    <>
      <Provider store={store}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Gateways Management
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', }, }} variant="permanent" anchor="left">
            <Toolbar />
            <Divider />
            <Paper elevation={0}>
              <List aria-label="main mailbox folders">
                <ListItemLink to="/" primary="Gateways" icon={<HomeIcon />} />
                <ListItemLink to="/devices" primary="Devices" icon={<DevicesIcon />} />
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
