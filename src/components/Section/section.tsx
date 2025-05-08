import { Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material"
import { Link } from "react-router-dom";

interface Props {
    img: string,
    link: string,
    title: string,
    description: string
}

const Section = (props: Props) => {

    const { img, link, title, description } = props;

    return (
        <Card sx={{ 
            margin: 2, 
            transition: '0.3s', 
            border: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': { 
                boxShadow: '0px 4px 20px rgba(0, 0, 255, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
            } 
        }}>
            <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardActionArea>
                    <CardMedia sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <img src={img} width="200" height="200" />
                    </CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card >
    )
}

export default Section