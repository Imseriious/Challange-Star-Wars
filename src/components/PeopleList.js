import React, { Fragment } from 'react';
import { ListItem, ListItemText, Avatar, Card } from '@material-ui/core';
import Loader from './Loader';
import { Link } from 'react-router-dom'
import { getId, getInitials } from '../Utils';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    avatar: {
        margin: 10,
    },
    card: {
        minWidth: 100,
    },
}));


const PeopleList = ({ items, loading }) => {
    const classes = useStyles();
    // Just the GRID and the card view has been added
    return (
        <Fragment >
            <Grid container spacing={0}>
                {items.length !== 0 &&
                    items.map(({ name, mass, height, url }) =>
                        <Fragment key={getId(url)}>
                            <Grid item xs={12} sm={6} md={6} className={classes.paper}> 
                                <Card className={classes.card}>
                                    <ListItem button component={Link} to={`/people/${getId(url)}`} >
                                        <Avatar className={classes.avatar}>{getInitials(name)}</Avatar>
                                        <ListItemText primary={name} secondary={`Weight: ${mass}, Height: ${height}CM, `} />
                                    </ListItem>
                                </Card>
                            </Grid>
                        </Fragment>
                    )
                }
            </Grid>
                <div className = "loader">
                {loading && <Loader />}
                </div>
        </Fragment>
    )
}


export default PeopleList;