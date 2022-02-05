import * as React from 'react';
import Header from '../../components/header/Header';
import Box from '@mui/material/Box';


export default function Home() {
    return (<>
        <Header></Header>
            <video style={{
                width: "100%"
            }} id="background-video" autoPlay loop muted>
                <source src="videos/home-video.mp4" type="video/mp4" />
                <source src="videos/home-video.mp4" type="video/ogg" />
                Your browser does not support the video tag.
            </video>
    </>
    )
}