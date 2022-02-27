import { useEffect, useState } from 'react';
import Header from '../../commons/components/header/Header';

export default function Home() {
    const [video, SetVideo] = useState('videos/home-video-3.mp4');
    const getFaviconEl = () => {
        return document.getElementById("favicon");
    }

    const setFebicon = (url='') => {
        const favicon = getFaviconEl();
        if(favicon){
            favicon.href = url || 'images/company-logo.jpeg';
        }
    }
    useEffect(() => {
        let userData = JSON.parse(localStorage.getItem('pdf_parser_app') || '{}');
        SetVideo(userData.user_org_video_url);
        document.title = userData.user_org_name || 'Sielo App'
        setFebicon(userData.user_org_logo_url);
    }, []);

    return (<>
        <Header></Header>
        <video style={{
            width: "100%",
            marginTop: "-64px"
        }} id="background-video" autoPlay loop muted>
            <source src={video || "videos/home-video-3.mp4"} type="video/mp4" />
            <source src={video || "videos/home-video-3.mp4"} type="video/ogg" />
            Your browser does not support the video tag.
        </video>
    </>
    )
}