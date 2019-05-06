import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = {
    card: {
        maxWidth: 300,
        maxWidth: 300,
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)"
    },
    title: {
        fontSize: 44
    },
    pos: {
        marginBottom: 12
    }
};

function GraphCard(props) {
    const { classes } = props;
    return (
        <Card className={classes.card}>
            <CardContent>
                {classes.gg}
            </CardContent>
        </Card>
    );
}

export default withStyles(styles)(GraphCard);