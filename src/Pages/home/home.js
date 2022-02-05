import * as React from 'react';
import Header from '../../components/header/Header';


export default function Home() {
    return (<>
        <Header></Header>
        <video sx={{
            margin: 4,
            padding: 4,
            maxWidth: { xs: '100%', md: '90%' }
        }} id="background-video" autoPlay loop muted>
            <source src="https://s3.ap-south-1.amazonaws.com/www.einsite.io/img/einsitewebsiteloop.mp4" type="video/mp4" />
            <source src="https://s3.ap-south-1.amazonaws.com/www.einsite.io/img/einsitewebsiteloop.mp4" type="video/ogg" />
            Your browser does not support the video tag.
        </video>
    </>
    )
}