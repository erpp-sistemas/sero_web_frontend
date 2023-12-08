import * as React from 'react';
import { useTheme, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useNavigate } from 'react-router-dom'

import { tokens } from '../.../../theme'

export default function RecipeReviewCard({ place }) {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const navigation = useNavigate()

    return (
        <Card sx={{ width: '31%', height: 320, backgroundColor: colors.primary[400], padding: '10px', marginBottom: '15px' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: colors.greenAccent[400] }} aria-label="recipe">
                        P
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={place.name}
            />

            <img style={{ width: '50%', margin: '0 auto' }} src={`https://www.ser0.mx/ser0/image/plaza/${place.image}`} alt="" />

            <CardContent sx={{ marginBottom: '20px' }}>
                <Button variant="contained"
                    onClick={() => navigation(`/map/${place.place_id}`)}
                    sx={{
                        backgroundColor: colors.greenAccent[400],
                        ":hover": {
                            bgcolor: colors.greenAccent[600]
                        }
                    }}
                >Mostrar mapa</Button>
            </CardContent>


        </Card>
    );
}